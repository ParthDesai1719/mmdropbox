"use client";

import { UploadButton } from "@uploadthing/react";
import type { OurFileRouter } from "@/app/api/uploadthing/core";
import { useRouter } from "next/navigation";
import { useState } from "react";

type UploadResponse = {
  uuid: string;
  filename: string;
  url: string;
};

export default function UploadPage() {
  const [uploading, setUploading] = useState(false);
  const router = useRouter();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-10">
      <h1 className="text-2xl font-bold mb-6">Upload a File</h1>

      <UploadButton<OurFileRouter, "driveUploader">
        endpoint="driveUploader"
        onUploadBegin={() => setUploading(true)}
        onClientUploadComplete={(res) => {
          setUploading(false);
          
          const fileData = res as unknown as UploadResponse[];
          if (fileData && fileData[0]) {
            router.push(`/f/${fileData[0].uuid}/${fileData[0].filename}`);
          }
        }}
        onUploadError={(err) => {
          setUploading(false);
          alert("Upload failed: " + err.message);
        }}
      />

      {uploading && <p className="mt-4 text-blue-600">Uploading file...</p>}
    </div>
  );
}
