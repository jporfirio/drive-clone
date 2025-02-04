import { db } from "@drive/server/db";
import { files_table, folders_table } from "@drive/server/db/schema";
import { eq, and, isNull } from "drizzle-orm";

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
      .where(eq(files_table.parent, folderId))
      .orderBy(files_table.id);
  },

  getFolders(folderId: number) {
    return db
      .select()
      .from(folders_table)
      .where(eq(folders_table.parent, folderId))
      .orderBy(folders_table.id);
  },

  async getFolder(folderId: number) {
    const folders = await db
      .select()
      .from(folders_table)
      .where(eq(folders_table.id, folderId));

    return folders[0];
  },

  getRootFolderForUser: async function (userId: string) {
    const folder = await db
      .select()
      .from(folders_table)
      .where(
        and(eq(folders_table.ownerId, userId), isNull(folders_table.parent)),
      );
    return folder[0];
  },
};

export const MUTATIONS = {
  async createFile(input: {
    file: {
      name: string;
      size: number;
      url: string;
      parent: number;
    };
    userId: string;
  }) {
    if (!input.userId) throw new Error("Unauthorized");

    return await db
      .insert(files_table)
      .values({ ...input.file, createdAt: undefined, ownerId: input.userId });
  },

  onboardUser: async function (userId: string) {
    const rootFolder = await db
      .insert(folders_table)
      .values({
        name: "Root",
        parent: null,
        ownerId: userId,
      })
      .$returningId();

    const rootFolderId = rootFolder[0]!.id;

    await db.insert(folders_table).values([
      {
        name: "Trash",
        parent: rootFolderId,
        ownerId: userId,
      },
      {
        name: "Shared",
        parent: rootFolderId,
        ownerId: userId,
      },
      {
        name: "Documents",
        parent: rootFolderId,
        ownerId: userId,
      },
    ]);

    return rootFolderId;
  },
};
