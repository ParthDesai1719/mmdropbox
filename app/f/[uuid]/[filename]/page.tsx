import { getMetadata } from "@/lib/kv";
import { notFound } from "next/navigation";
import { formatBytes, timeSince } from "@/lib/utils";
import Link from "next/link";
import Image from "next/image";

type Props = {
  params: {
    uuid: string;
    filename: string;
  };
};

export default async function FilePage({ params }: Props) {
  const { uuid, filename } = params;
  const metadata = await getMetadata(uuid);

  if (!metadata || metadata.filename !== filename) return notFound();

  const fileUrl = `https://${process.env.R2_BUCKET}.r2.cloudflarestorage.com/${uuid}/${filename}`;
  const isImage = metadata.mimetype.startsWith("image/");
  const isPdf = metadata.mimetype === "application/pdf";

  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-4">
      <h1 className="text-xl font-semibold mb-2">{metadata.filename}</h1>
      <p className="text-gray-500 mb-4">
        {formatBytes(metadata.size)} • Uploaded {timeSince(metadata.createdAt)}
      </p>

          {isImage && (
            <Image
              src={fileUrl}
              alt={metadata.filename}
              width={800}
              height={600}
              className="rounded shadow mb-4"
              unoptimized
            />
          )}

      {isPdf && <iframe src={fileUrl} className="w-full max-w-4xl h-[500px] mb-4" />}

      <Link
        href={fileUrl}
        download
        target="_blank"
        rel="noopener noreferrer"
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Download File
      </Link>
    </div>
  );
}
