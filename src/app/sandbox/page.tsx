import { mockFiles, mockFolders } from "@drive/lib/mock-data";
import { db } from "@drive/server/db";
import { files_table, folders_table } from "@drive/server/db/schema";

export default function SandboxPage() {
  return (
    <div className="grid h-screen w-screen items-center justify-center">
      <div>
        <form
          action={async () => {
            "use server";

            const folders = mockFolders.map((folder, index) => ({
              id: index + 1,
              name: folder.name,
              parent: index !== 0 ? 1 : null,
              ownerId: "",
            }));
            await db.insert(folders_table).values(folders);

            const files = mockFiles.map((file, index) => ({
              id: index + 1,
              name: file.name,
              size: parseInt(file.size),
              url: file.url,
              parent: (index % 3) + 1,
              ownerId: "",
            }));
            await db.insert(files_table).values(files);
          }}
        >
          <button type="submit">Seed</button>
        </form>
      </div>
    </div>
  );
}
