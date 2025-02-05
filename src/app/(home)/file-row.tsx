import { Folder as FolderIcon, FileIcon, Trash2Icon } from "lucide-react";
import type { files_table, folders_table } from "@drive/server/db/schema";
import Link from "next/link";
import { Button } from "@drive/components/ui/button";
import { deleteFile } from "@drive/server/actions";

export function FileRow(props: { file: typeof files_table.$inferSelect }) {
  return (
    <li
      key={props.file.id}
      className="hover:bg-gray-750 border-b border-gray-700 px-6 py-4"
    >
      <div className="grid grid-cols-12 items-center gap-4">
        <div className="col-span-6 flex items-center">
          <a
            href={props.file.url}
            className="flex items-center text-gray-100 hover:text-blue-400"
            target="_blank"
          >
            <FileIcon className="mr-3" size={20} />
            {props.file.name}
          </a>
        </div>
        <div className="col-span-2 text-gray-400">{props.file.size}</div>
        <div className="col-span-3 text-gray-400">File</div>
        <div className="col-span-1 text-gray-400">
          <Button
            variant="ghost"
            aria-label="delete file"
            onClick={() => deleteFile(props.file.id)}
          >
            <Trash2Icon size={20} />
          </Button>
        </div>
      </div>
    </li>
  );
}

export function FolderRow(props: {
  folder: typeof folders_table.$inferSelect;
}) {
  return (
    <li
      key={props.folder.id}
      className="hover:bg-gray-750 border-b border-gray-700 px-6 py-4"
    >
      <div className="grid grid-cols-12 items-center gap-4">
        <div className="col-span-6 flex items-center">
          <Link
            href={`/f/${props.folder.id}`}
            className="flex items-center text-gray-100 hover:text-blue-400"
          >
            <FolderIcon className="mr-3" size={20} />
            {props.folder.name}
          </Link>
        </div>
        <div className="col-span-2 text-gray-400">--</div>
        <div className="col-span-3 text-gray-400">File</div>
        <div className="col-span-1 text-gray-400"></div>
      </div>
    </li>
  );
}
