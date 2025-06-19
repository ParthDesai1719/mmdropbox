// api/uploadthing/core.ts
import { createUploadthing, type FileRouter } from "uploadthing/server";
import { uploadToR2 } from "@/api/r2/r2";
import { saveMetadata } from "@/lib/kv";
import { v4 as uuidv4 } from "uuid";

const f = createUploadthing();

export const fileRouter = {
  driveUploader: f({
  "image": { maxFileSize: "8MB" },
  "video": { maxFileSize: "64MB" },
  "text": { maxFileSize: "1MB" },
  "audio": { maxFileSize: "16MB" },
    "pdf": { maxFileSize: "32MB" },
    "blob": { maxFileSize: "32MB" },
    }).onUploadComplete(async ({ file }) => {
    const uuid = uuidv4();
    const response = await fetch(file.url);
    const buffer = Buffer.from(await response.arrayBuffer());

    const key = `${uuid}/${file.name}`;
    await uploadToR2(key, buffer, file.type);

    await saveMetadata(uuid, {
      uuid,
      filename: file.name,
      mimetype: file.type,
      size: file.size,
      createdAt: new Date().toISOString(),
    });

    return {
      uuid,
      filename: file.name,
      url: `/f/${uuid}/${file.name}`,
    };
  }),
} satisfies FileRouter;

export type OurFileRouter = typeof fileRouter;
