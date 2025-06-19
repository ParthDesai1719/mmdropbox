import { getMetadata } from "@/lib/kv";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { formatBytes, timeSince } from "@/lib/utils";
import type { Metadata } from "next";
import { checkFields, AwaitedFirstArg, Diff } from "@/lib/type-check";

type PageProps = {
  params: { uuid: string; filename: string };
};

// ✅ Optional type check to catch prop mismatches during build
checkFields<Diff<PageProps, AwaitedFirstArg<typeof Page>>>();

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const metadata = await getMetadata(params.uuid);

  if (!metadata || metadata.filename !== params.filename) {
    return { title: "File Not Found" };
  }

  const fileUrl = `https://${process.env.R2_BUCKET}.r2.cloudflarestorage.com/${params.uuid}/${params.filename}`;
  const title = metadata.filename;
  const description = `${formatBytes(metadata.size)} • Uploaded ${timeSince(metadata.createdAt)}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: fileUrl,
      images: metadata.mimetype.startsWith("image/")
        ? [{ url: fileUrl, width: 800, height: 600 }]
        : undefined,
    },
    twitter: {
      card: metadata.mimetype.startsWith("image/") ? "summary_large_image" : "summary",
      title,
      description,
      images: metadata.mimetype.startsWith("image/") ? [fileUrl] : undefined,
    },
  };
}

export default async function Page({ params }: PageProps) {
  const { uuid, filename } = params;
  const metadata = await getMetadata(uuid);

  if (!metadata || metadata.filename !== filename) {
    return notFound();
  }

  const fileUrl = `https://${process.env.R2_BUCKET}.r2.cloudflarestorage.com/${uuid}/${filename}`;
  const isImage = metadata.mimetype.startsWith("image/");
  const isPdf = metadata.mimetype === "application/pdf";

  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-4">
      <h1 className="text-xl font-semibold mb-2">{metadata.filename}</h1>
      <p className="text-gray-500 mb-4">
        {formatBytes(metadata.size)} • Uploaded {timeSince(metadata.createdAt)}
      </p>

      {isImage ? (
        <Image
          src={fileUrl}
          alt={metadata.filename}
          width={800}
          height={600}
          className="rounded shadow mb-4"
          unoptimized
        />
      ) : isPdf ? (
        <iframe
          src={fileUrl}
          className="w-full max-w-4xl h-[500px] mb-4"
          title="PDF Preview"
        />
      ) : (
        <p className="mb-4 text-sm text-gray-400">No preview available for this file type.</p>
      )}

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
