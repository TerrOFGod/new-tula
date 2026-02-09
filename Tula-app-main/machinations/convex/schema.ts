import { v } from "convex/values";
import { defineSchema, defineTable } from "convex/server";
import {
  boardEdgesTypeValue,
  boardHistoryDataValue,
  boardHistoryTypeValue,
} from "./validators/boardData";

export default defineSchema({
  boards: defineTable({
    orgId: v.string(),
    authorId: v.string(),
    authorName: v.string(),
    imageUrl: v.string(),
    title: v.string(),
    description: v.optional(v.string()),
    edgesType: v.optional(boardEdgesTypeValue),
    currentVersion: v.number(), // Последняя версия
    head: v.optional(v.id("boardsHistory")), // Ссылка на актуальную версию
    updatedTime: v.optional(v.number()),
  })
    .index("by_org", ["orgId"])
    .searchIndex("search_title", {
      searchField: "title",
      filterFields: ["orgId"],
    }),
  boardsHistory: defineTable({
    boardId: v.id("boards"),
    version: v.number(),
    type: boardHistoryTypeValue,
    data: boardHistoryDataValue,
    authorId: v.string(),
    authorName: v.optional(v.string()),
    message: v.optional(v.string()),
    restoreByTime: v.optional(v.number()),
  })
    .index("by_board_version", ["boardId", "version"])
    .index("by_board", ["boardId"])
    .index("by_base", ["boardId", "data.base"])
    .searchIndex("search_message", {
      searchField: "message",
      filterFields: ["boardId", "version"],
    }),
  userFavorites: defineTable({
    orgId: v.string(),
    userId: v.string(),
    boardId: v.id("boards"),
  })
    .index("by_board", ["boardId"])
    .index("by_user_org", ["userId", "orgId"])
    .index("by_user_board", ["userId", "boardId"])
    .index("by_user_board_org", ["userId", "boardId", "orgId"]),
});
