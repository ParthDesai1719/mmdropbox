import { getMetadata } from "@/lib/kv";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

export default async function Page({
  params,
}: {
  params: { uuid: string; filename: string };
}) {
  const metadata = await getMetadata(params.uuid);

  if (!metadata || metadata.filename !== params.filename) {
    return notFound();
  }

  const fileUrl = `https://${process.env.R2_BUCKET}.r2.cloudflarestorage.com/${params.uuid}/${params.filename}`;
  const isImage = metadata.mimetype.startsWith("image/");
  const isPdf = metadata.mimetype === "application/pdf";

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 py-10 text-center">
      <h1 className="text-xl font-bold mb-4">{metadata.filename}</h1>
      <p className="text-sm text-gray-500 mb-2">
        {metadata.size} bytes • Uploaded {new Date(metadata.createdAt).toLocaleString()}
      </p>

      {isImage && (
        <Image
          src={fileUrl}
          alt={metadata.filename}
          width={800}
          height={600}
          className="rounded shadow my-4"
          unoptimized
        />
      )}

      {isPdf && (
        <iframe
          src={fileUrl}
          className="w-full max-w-4xl h-[500px] border my-4"
          title="PDF Preview"
        />
      )}

      <Link
        href={fileUrl}
        download
        target="_blank"
        rel="noopener noreferrer"
        className="bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700 mt-4"
      >
        Download File
      </Link>
    </div>
  );
}
