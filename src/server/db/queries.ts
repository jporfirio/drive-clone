import { db } from "@drive/server/db";
import {
  DB_FileType,
  files_table,
  folders_table,
} from "@drive/server/db/schema";
import { eq } from "drizzle-orm";

export const QUERIES = {
  async getParents(folderId: number) {
    const parents = [];
    let currentId: number | null = folderId;
    while (currentId !== null) {
      const folder = await db
        .selectDistinct()
        .from(folders_table)
        .where(eq(folders_table.id, currentId));

      if (!folder[0]) throw new Error("Parent not found");

      parents.unshift(folder[0]);
      currentId = folder[0]?.parent;
    }
    return parents;
  },

  getFiles(folderId: number) {
    return db
      .select()
      .from(files_table)
      .where(eq(files_table.parent, folderId));
  },

  getFolders(folderId: number) {
    return db
      .select()
      .from(folders_table)
      .where(eq(folders_table.parent, folderId));
  },
};

export const MUTATIONS = {
  async createFile(input: {
    file: {
      name: string;
      size: number;
      url: string;
    };
    userId: string;
  }) {
    if (!input.userId) throw new Error("Unauthorized");

    return await db
      .insert(files_table)
      .values({ ...input.file, parent: 1, createdAt: undefined, ownerId: "" });
  },
};
