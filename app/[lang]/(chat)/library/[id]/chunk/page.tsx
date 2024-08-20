import { auth } from "@/auth";
import LibraryFileChunk from "@/components/Library/LibraryFileChunk";
import "@/lib/apiClient";
import { Chunk, CollectionService, FileChunkRequest } from "@/restful/generated";
import { Spinner } from "@nextui-org/react";
import { notFound } from "next/navigation";
import { Suspense } from "react";

async function getChunksData(fileId: string) {
  const session = await auth();
  if (!session?.user) {
    throw new Error("Unauthorized");
  }

  try {
    const body: FileChunkRequest = { file_id: fileId };
    const response = await CollectionService.getChunksOfFileV1CollectionChunksPost({
      requestBody: body,
    });
    return response;
  } catch (error) {
    console.error("Error fetching chunks:", error);
    throw error;
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

async function ChunkContent({ fileId, filename }: { fileId: string; filename: string }) {
  try {
    const chunksData: Chunk[] = await getChunksData(fileId);
    return <LibraryFileChunk filename={filename} chunks={chunksData} />;
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return <ErrorDisplay message="You must be logged in to view this page." />;
    }
    return <ErrorDisplay message="Error loading chunks data. Please try again later." />;
  }
}

export default function FileChunkPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const fileId = searchParams.fileId as string;
  const filename = searchParams.filename as string;

  if (!fileId || !filename) {
    notFound();
  }

  return (
    <div className="h-full w-full">
      <Suspense fallback={<LoadingSpinner />}>
        <ChunkContent fileId={fileId} filename={filename} />
      </Suspense>
    </div>
  );
}
