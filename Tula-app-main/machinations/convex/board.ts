import { v } from "convex/values";

import { api } from "./_generated/api";
import { mutation, query } from "./_generated/server";
import { Id } from "./_generated/dataModel";
import {
  boardEdgesTypeValue,
  TBoardPatchDataValue,
  TBoardSnapshotDataValue,
} from "./validators/boardData";
import { applyPatches } from "../utils/jsonDiff";

export const create = mutation({
  args: {
    orgId: v.string(),
    title: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("Unauthorized");
    }

    const boardId = await ctx.db.insert("boards", {
      orgId: args.orgId,
      authorId: identity.subject,
      authorName: identity.name!,
      imageUrl: "/placeholders/example.png",
      title: args.title,
      description: "",
      edgesType: "Default",
      currentVersion: 0,
      //head: "" as Id<"boardsHistory">,
    });

    // Создаем начальный снапшот
    const snapshotId = await ctx.db.insert("boardsHistory", {
      boardId: boardId,
      version: 0,
      type: "snapshot",
      data: { nodes: [], edges: [] },
      authorId: identity.subject,
      authorName: identity.name!,
    });

    // Обновляем head доски
    await ctx.db.patch(boardId, { head: snapshotId });

    return boardId;
  },
});

export const updateHead = mutation({
  args: {
    boardId: v.id("boards"),
    newHead: v.id("boardsHistory"),
    newVersion: v.number(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.boardId, {
      currentVersion: args.newVersion,
      head: args.newHead,
    });
  },
});

export const updateTitle = mutation({
  args: { id: v.id("boards"), title: v.string() },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("Unauthorized");
    }

    const title = args.title.trim();

    if (!title) {
      throw new Error("Title is required");
    }

    if (title.length > 60) {
      throw new Error("Title cannot be longer than 60 characters");
    }

    const board = await ctx.db.patch(args.id, {
      title: args.title,
    });

    return board;
  },
});

export const updateMetaInfo = mutation({
  args: {
    id: v.id("boards"),
    title: v.string(),
    description: v.string(),
    edgesType: boardEdgesTypeValue,
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("Unauthorized");
    }

    const title = args.title.trim();

    if (title.length > 60) {
      throw new Error("Title cannot be longer than 60 characters");
    }

    const board = await ctx.db.patch(args.id, {
      title: args.title,
      description: args.description.trim(),
      edgesType: args.edgesType,
      updatedTime: Date.now(),
    });

    return board;
  },
});

export const remove = mutation({
  args: { id: v.id("boards") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("Unauthorized");
    }

    const userId = identity.subject;

    const historyRecords = await ctx.db
      .query("boardsHistory")
      .withIndex("by_board", (q) => q.eq("boardId", args.id))
      .collect();

    await Promise.all(
      historyRecords.map((record) => ctx.db.delete(record._id))
    );

    const existingFavorite = await ctx.db
      .query("userFavorites")
      .withIndex("by_user_board", (q) =>
        q.eq("userId", userId).eq("boardId", args.id)
      )
      .unique();

    if (existingFavorite) {
      await ctx.db.delete(existingFavorite._id);
    }

    await ctx.db.delete(args.id);

    return { success: true };
  },
});

export const favorite = mutation({
  args: { id: v.id("boards"), orgId: v.string() },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("Unauthorized");
    }

    const board = await ctx.db.get(args.id);

    if (!board) {
      throw new Error("Board not found");
    }

    const userId = identity.subject;

    const existingFavorite = await ctx.db
      .query("userFavorites")
      .withIndex("by_user_board", (q) =>
        q.eq("userId", userId).eq("boardId", board._id)
      )
      .unique();

    if (existingFavorite) {
      throw new Error("Board already favorited");
    }

    await ctx.db.insert("userFavorites", {
      userId,
      boardId: board._id,
      orgId: args.orgId,
    });

    return board;
  },
});

export const unfavorite = mutation({
  args: { id: v.id("boards") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("Unauthorized");
    }

    const board = await ctx.db.get(args.id);

    if (!board) {
      throw new Error("Board not found");
    }

    const userId = identity.subject;

    const existingFavorite = await ctx.db
      .query("userFavorites")
      .withIndex("by_user_board", (q) =>
        q.eq("userId", userId).eq("boardId", board._id)
      )
      .unique();

    if (!existingFavorite) {
      throw new Error("Favorite board not found");
    }

    await ctx.db.delete(existingFavorite._id);

    return board;
  },
});

export const get = query({
  args: { id: v.id("boards") },
  handler: async (ctx, args) => {
    try {
      const board = await ctx.db.get(args.id);
      return board;
    } catch (error) {
      console.error(error);
      throw error;
    }
  },
});

export const loadBoardState = query({
  args: { boardId: v.id("boards") },
  handler: async (ctx, args) => {
    const board = await ctx.db.get(args.boardId);
    if (!board) throw new Error("Board not found");

    // Получаем последнюю версию из истории
    const headVersion = await ctx.db
      .query("boardsHistory")
      .withIndex("by_board_version", (q) =>
        q.eq("boardId", args.boardId).eq("version", board.currentVersion)
      )
      .unique();

    if (!headVersion) throw new Error("Head version not found");

    // Восстанавливаем состояние через цепочку версий
    let state: TBoardSnapshotDataValue;

    if (headVersion.type === "snapshot") {
      state = headVersion.data as TBoardSnapshotDataValue;
    } else {
      const baseVersion = await ctx.db
        .query("boardsHistory")
        .withIndex("by_board_version", (q) =>
          q
            .eq("boardId", args.boardId)
            .eq("version", (headVersion.data as TBoardPatchDataValue).base)
        )
        .unique();

      if (!baseVersion) throw new Error("Base version not found");

      const baseState = await ctx.runQuery(api.boardsHistory.restoreVersion, {
        versionId: baseVersion._id,
      });

      state = applyPatches(
        baseState,
        (headVersion.data as TBoardPatchDataValue).patches
      );
    }

    return {
      nodes: state.nodes,
      edges: state.edges,
      version: headVersion.version,
      title: board.title,
      description: board.description,
      edgesType: board.edgesType,
      _creationTime: headVersion._creationTime,
    };
  },
});
