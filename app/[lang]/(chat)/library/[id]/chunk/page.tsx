import { auth } from "@/auth";
import LibraryFileChunk from "@/components/Library/LibraryFileChunk";
import "@/lib/apiClient";
import { CollectionService, FileChunkRequest } from "@/restful/generated";
import { Spinner } from "@nextui-org/react";
import { notFound } from "next/navigation";
import { Suspense } from "react";

interface FileChunkPageProps {
  searchParams: {
    fileId?: string;
    filename?: string;
    [key: string]: string | string[] | undefined;
  };
}

export default async function FileChunkPage({ searchParams }: FileChunkPageProps) {
  const { fileId, filename } = searchParams;

  if (!fileId || !filename) {
    notFound();
  }

  return (
    <div className="h-full w-full">
      <Suspense fallback={<LoadingSpinner />}>
        {await renderContent(fileId, filename)}
      </Suspense>
    </div>
  );
}

async function renderContent(fileId: string, filename: string) {
  try {
    const session = await auth();
    if (!session?.user) {
      return <ErrorDisplay message="You must be logged in to view this page." />;
    }

    const body: FileChunkRequest = { file_id: fileId, limit: 10, offset: 0 };
    const chunksData = await CollectionService.getChunksOfFileV1CollectionChunksPost({
      requestBody: body,
    });

    return (
      <LibraryFileChunk fileId={fileId} filename={filename} initialChunks={chunksData} />
    );
  } catch (error) {
    console.error("Error fetching chunks:", error);
    return <ErrorDisplay message="Error loading chunks data. Please try again later." />;
  }
}

function LoadingSpinner() {
  return (
    <div className="flex h-screen items-center justify-center">
      <Spinner size="lg" />
    </div>
  );
}

function ErrorDisplay({ message }: { message: string }) {
  return (
    <div className="flex h-screen items-center justify-center">
      <p className="text-red-500">{message}</p>
    </div>
  );
}
