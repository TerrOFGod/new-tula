import { Infer, v } from "convex/values";

import { applyPatches } from "../utils/jsonDiff";
import { BoardStateData } from "../app/types/history";

import { mutation, query } from "./_generated/server";
import {
  boardDataPatchConvexValue,
  boardDataSnapshotConvexValue,
  boardHistoryTypeValue,
  TBoardPatchDataValue,
} from "./validators/boardData";
import { Doc, Id } from "./_generated/dataModel";

export const createVersion = mutation({
  args: {
    boardId: v.id("boards"),
    type: boardHistoryTypeValue,
    data: v.union(boardDataSnapshotConvexValue, boardDataPatchConvexValue),
    message: v.optional(v.string()),
    restoreByTime: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");

    // Получаем текущую версию
    const board = await ctx.db.get(args.boardId);
    if (!board) throw new Error("Board not found");

    // Валидация для патчей
    if (args.type === "patch") {
      const baseExists = await ctx.db
        .query("boardsHistory")
        .withIndex("by_board_version", (q) =>
          q
            .eq("boardId", args.boardId)
            .eq("version", (args.data as TBoardPatchDataValue).base)
        )
        .unique();
      if (!baseExists) throw new Error("Base version not found");
    }

    const versionId = await ctx.db.insert("boardsHistory", {
      boardId: args.boardId,
      version: board.currentVersion + 1,
      type: args.type,
      data: args.data,
      authorId: identity.subject,
      authorName: identity.name!,
      message: args.message,
      restoreByTime: args.restoreByTime,
    });

    // Получаем полную запись с _creationTime
    const newVersion = await ctx.db.get(versionId);

    if (!newVersion) throw new Error("Failed to create version");

    // Обновляем головную версию доски
    await ctx.db.patch(args.boardId, {
      currentVersion: newVersion?.version,
      head: versionId,
      updatedTime: newVersion?._creationTime,
    });

    return {
      id: versionId,
      version: newVersion.version,
      createdAt: newVersion._creationTime,
    };
  },
});

// Вынесенная обработка результатов
const processResults = (
  results: Doc<"boardsHistory">[],
  groupByBase?: boolean
) => {
  if (groupByBase) {
    const grouped: Record<number, Doc<"boardsHistory">[]> = {};

    let currentBase = 0;

    for (const record of results) {
      if (record.type === "snapshot") {
        currentBase =
          currentBase === record.version ? currentBase : record.version;
        grouped[currentBase] = grouped[currentBase] || [];
        grouped[currentBase].push(record);
      } else {
        grouped[currentBase] = grouped[currentBase] || [];
        grouped[currentBase].push(record);
      }
    }

    return { grouped, results };
  }

  return { grouped: undefined, results };
};

export const getBoardHistory = query({
  args: {
    boardId: v.id("boards"),
    searchQuery: v.optional(v.string()),
    startDate: v.optional(v.number()),
    endDate: v.optional(v.number()),
    groupByBase: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    // Отдельная обработка поисковых запросов
    if (args.searchQuery) {
      let searchResults = await ctx.db
        .query("boardsHistory")
        .withSearchIndex("search_message", (q) =>
          q.search("message", args.searchQuery!).eq("boardId", args.boardId)
        );

      if (args.startDate || args.endDate) {
        searchResults = await searchResults.filter((q) =>
          q.and(
            args.startDate
              ? q.gte(q.field("_creationTime"), args.startDate)
              : q.and(),
            args.endDate
              ? q.lte(q.field("_creationTime"), args.endDate)
              : q.and()
          )
        );
      }

      // Ручная сортировка результатов поиска
      let sortedResults = await searchResults.collect();

      sortedResults = sortedResults.sort(
        (a, b) => b._creationTime - a._creationTime
      );

      return processResults(sortedResults, args?.groupByBase);
    }

    // Базовый запрос с сортировкой по версии
    let query = ctx.db
      .query("boardsHistory")
      .withIndex("by_board", (q) => q.eq("boardId", args.boardId))
      .order("asc");

    // Фильтрация по дате
    if (args.startDate || args.endDate) {
      query = query.filter((q) =>
        q.and(
          args.startDate
            ? q.gte(q.field("_creationTime"), args.startDate)
            : q.and(),
          args.endDate ? q.lte(q.field("_creationTime"), args.endDate) : q.and()
        )
      );
    }

    const results = await query.collect();

    return processResults(results, args?.groupByBase);
  },
});

export const getVersion = query({
  args: { versionId: v.id("boardsHistory") },
  handler: async (ctx, args) => {
    return ctx.db.get(args.versionId);
  },
});

export const getVersionByNumber = query({
  args: { boardId: v.id("boards"), version: v.number() },
  handler: async (ctx, args) => {
    return ctx.db
      .query("boardsHistory")
      .withIndex("by_board_version", (q) =>
        q.eq("boardId", args.boardId).eq("version", args.version)
      )
      .unique();
  },
});

export const compareVersions = query({
  args: {
    versionId1: v.id("boardsHistory"),
    versionId2: v.id("boardsHistory"),
  },
  handler: async (ctx, args) => {
    const v1 = await ctx.db.get(args.versionId1);
    const v2 = await ctx.db.get(args.versionId2);
    return { v1, v2 };
  },
});

// Восстановление версии
export const restoreVersion = query({
  args: { versionId: v.id("boardsHistory") },
  handler: async (ctx, args) => {
    // Получаем начальную версию
    const initialVersion = await ctx.db.get(args.versionId);

    if (!initialVersion) {
      throw new Error("Version not found");
    }

    const versionChain = [];
    let currentVersion: typeof initialVersion | null = initialVersion;

    while (currentVersion) {
      versionChain.unshift(currentVersion);

      if (currentVersion.type === "snapshot") {
        break;
      }

      const patchData = currentVersion.data as TBoardPatchDataValue;

      const nextVersion = await ctx.db
        .query("boardsHistory")
        .withIndex(
          "by_board_version",
          (q) =>
            q
              .eq("boardId", currentVersion!.boardId) // Явное утверждение non-null
              .eq("version", patchData.base) // Используем номер базовой версии
        )
        .unique();

      currentVersion = nextVersion;
    }

    return versionChain.reduce((acc, version) => {
      if (version.type === "snapshot") return version.data;

      const patchData = version.data as Infer<typeof boardDataPatchConvexValue>;

      return applyPatches(acc, patchData.patches);
    }, {} as BoardStateData);
  },
});

export const searchByMessage = query({
  args: { boardId: v.id("boards"), query: v.string() },
  handler: async (ctx, args) => {
    return ctx.db
      .query("boardsHistory")
      .withSearchIndex("search_message", (q) =>
        q.search("message", args.query).eq("boardId", args.boardId)
      )
      .collect();
  },
});

// Удаление старых версий
export const pruneHistory = mutation({
  args: { boardId: v.id("boards"), keepLast: v.number() },
  handler: async (ctx, args) => {
    const history = await ctx.db
      .query("boardsHistory")
      .withIndex("by_board", (q) => q.eq("boardId", args.boardId))
      .order("desc")
      .collect();

    const toDelete = history.slice(args.keepLast);

    await Promise.all(toDelete.map((version) => ctx.db.delete(version._id)));

    return { deleted: toDelete.length };
  },
});

// Получение базового снапшота для патча
export const getBaseSnapshot = query({
  args: { boardId: v.id("boards"), version: v.number() },
  handler: async (ctx, args) => {
    return ctx.db
      .query("boardsHistory")
      .withIndex("by_board_version", (q) =>
        q.eq("boardId", args.boardId).eq("version", args.version)
      )
      .unique();
  },
});

export const updateVersionMessage = mutation({
  args: { id: v.id("boardsHistory"), message: v.string() },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("Unauthorized");
    }

    const message = args.message.trim();

    if (!message) {
      throw new Error("Message is required");
    }

    if (message.length > 60) {
      throw new Error("Message cannot be longer than 60 characters");
    }

    const board = await ctx.db.patch(args.id, {
      message,
    });

    return board;
  },
});

export const deleteVersion = mutation({
  args: { versionId: v.id("boardsHistory") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");

    const targetVersion = await ctx.db.get(args.versionId);
    if (!targetVersion) throw new Error("Version not found");

    // Для снэпшотов: каскадное удаление всех зависимых патчей
    if (targetVersion.type === "snapshot") {
      const chainToDelete: Doc<"boardsHistory">[] = [];
      let currentVersion: typeof targetVersion | null = targetVersion;

      // 2. Находим все зависимые патчи до следующего снэпшота
      while (currentVersion) {
        const nextVersion = await ctx.db
          .query("boardsHistory")
          .withIndex("by_base", (q) =>
            q
              .eq("boardId", targetVersion.boardId)
              .eq("data.base", currentVersion?.version)
          )
          .first();

        if (!nextVersion || nextVersion.type === "snapshot") break;

        chainToDelete.push(nextVersion);
        currentVersion = nextVersion;
      }

      // 3. Удаляем всю цепочку
      await Promise.all([
        ...chainToDelete.map((v) => ctx.db.delete(v._id)),
        ctx.db.delete(args.versionId),
      ]);

      // Обновление текущей версии доски
      const board = await ctx.db.get(targetVersion.boardId);

      if (board) {
        const isCurrentVersionInChain =
          chainToDelete.some((v) => v.version === board?.currentVersion) ||
          targetVersion.version === board?.currentVersion;

        if (isCurrentVersionInChain) {
          const prevVersion = await ctx.db
            .query("boardsHistory")
            .withIndex("by_board", (q) =>
              q.eq("boardId", targetVersion.boardId)
            )
            .order("desc")
            .first();

          if (prevVersion) {
            await ctx.db.patch(board._id, {
              currentVersion: prevVersion.version,
              head: prevVersion._id,
            });
          }
        }
      }

      return { success: true };
    }

    const patchData = targetVersion.data as TBoardPatchDataValue;
    const baseVersion = patchData.base;

    // Для патчей: перенаправление зависимых версий
    const nextVersions = await ctx.db
      .query("boardsHistory")
      .withIndex("by_base", (q) =>
        q
          .eq("boardId", targetVersion.boardId)
          .eq("data.base", targetVersion.version)
      )
      .collect();

    // Находим предыдущую версию
    const previousVersion = await ctx.db
      .query("boardsHistory")
      .withIndex("by_board_version", (q) =>
        q.eq("boardId", targetVersion.boardId).eq("version", baseVersion)
      )
      .order("desc")
      .first();

    if (!previousVersion) {
      throw new Error("Cannot delete base version");
    }

    // Обновляем базовые ссылки у следующих версий
    await Promise.all(
      nextVersions.map(async (version) => {
        if (version.type === "patch") {
          await ctx.db.patch(version._id, {
            data: {
              ...version.data,
              base: previousVersion.version,
            },
          });
        }
      })
    );

    // Удаляем целевой патч
    await ctx.db.delete(targetVersion._id);

    // 5. Обновляем текущую версию доски
    const board = await ctx.db.get(targetVersion.boardId);

    if (board?.currentVersion === targetVersion.version) {
      await ctx.db.patch(board._id, {
        currentVersion: previousVersion.version,
        head: previousVersion._id,
      });
    }

    return { success: true };
  },
});
