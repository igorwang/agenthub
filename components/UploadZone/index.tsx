"use client";
import { getFileImage } from "@/components/UploadZone/fileImages";
import { Dropzone, ExtFile, FileMosaic } from "@dropzone-ui/react";
import { Button } from "@nextui-org/button";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { toast } from "sonner";
import { v4 } from "uuid";

export type UploadZoneProps = {
  knowledgeBaseId?: string;
  onAfterUpload?: () => void;
};

export default function UploadZone({ knowledgeBaseId, onAfterUpload }: UploadZoneProps) {
  const [files, setFiles] = useState<ExtFile[]>([]);
  const [isUploading, setIsUploading] = useState<boolean>(false);

  const session = useSession();
  const updateFiles = (incommingFiles: ExtFile[]) => {
    const files = incommingFiles.map((item) => {
      if (item) {
        const fileType = item.name?.split(".").pop() || "default";
        return { ...item, imageUrl: getFileImage(fileType) };
      }
      return item;
    });
    setFiles(files);
  };

  const onDelete = (id: string | number | undefined) => {
    setFiles(files.filter((x) => x.id !== id));
  };
  const handleAbort = (id: string | number | undefined) => {
    setFiles(
      files.map((ef) => {
        if (ef.id === id) {
          return { ...ef, uploadStatus: "aborted" };
        } else return { ...ef };
      }),
    );
  };
  const handleCancel = (id: string | number | undefined) => {
    setFiles(
      files.map((ef) => {
        if (ef.id === id) {
          return { ...ef, uploadStatus: undefined };
        } else return { ...ef };
      }),
    );
  };
  const handleClear = () => {
    setFiles([]);
  };
  const handleUploadStart = async () => {
    setIsUploading(true);
    setFiles(
      files.map((file) => ({
        ...file,
        uploadStatus: "uploading",
      })),
    );

    const uploadSingleFile = async (file: ExtFile) => {
      const ext = file.name?.split(".").pop();
      const fileName = `${v4()}.${ext}`;

      const body = {
        bucket: "chat",
        objectName: `knowledge_base/${knowledgeBaseId}/${fileName}`,
        contentType: file.type || "application/octet-stream",
        metadata: {
          fileName: file.name,
          creatorId: session.data?.user?.id || "",
        },
      };

      try {
        const response = await fetch("/api/file/presigned_url/v1", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(body),
        });

        if (response.ok) {
          const { presignedPutUrl } = await response.json();

          const uploadResponse = await fetch(presignedPutUrl, {
            method: "PUT",
            body: file.file,
            headers: {
              "Content-Type": file.type || "application/octet-stream",
            },
          });

          if (!uploadResponse.ok) {
            throw new Error("Failed to upload file");
          }
          setFiles((prevFiles) =>
            prevFiles.map((item) =>
              item.id === file.id ? { ...item, uploadStatus: "success" } : item,
            ),
          );

          return {
            ...file,
            uploadUrl: presignedPutUrl,
            uploadStatus: "success",
          };
        } else {
          throw new Error("Failed to get presigned URL");
        }
      } catch (error) {
        console.error("error:", error);
        toast.error("Error uploading data");
        return {
          ...file,
          uploadStatus: "Failed",
        };
      }
    };

    const handleUploadFiles = async (incommingFiles: ExtFile[]) => {
      const updatedFiles = await Promise.all(
        incommingFiles.map((file) => uploadSingleFile(file)),
      );
      return updatedFiles;
    };

    handleUploadFiles(files)
      .then((updatedFiles) => {
        toast.success(
          "Files uploaded successfully! AI will take a little time to process.",
        );
      })
      .catch((error) => {
        console.error("Error uploading files:", error);
      });
    onAfterUpload?.();
    setIsUploading(false);
  };

  return (
    <div className="flex h-full w-full flex-col items-end overflow-auto">
      <Dropzone
        className="h-full max-h-full min-h-0 flex-1"
        onChange={updateFiles}
        value={files}
        accept=".doc,.docx,.pdf,.ppt,.pptx,.xls,.xlsx,.txt,.json"
        label="Drop or Click to upload your files"
        maxFiles={20}
        maxFileSize={10 * 1024 * 1024}
        footer={false}
        header={false}>
        {files.map((file, index) => (
          <FileMosaic
            key={file.id}
            onDelete={onDelete}
            {...file}
            backgroundBlurImage={false}
            imageUrl={file.imageUrl}
            onAbort={handleAbort}
            onCancel={handleCancel}
            preview
          />
        ))}
      </Dropzone>
      <div className="justify-self-end">
        <Button
          className="mr-2 mt-2"
          size="md"
          variant="solid"
          color="primary"
          onClick={handleClear}>
          Clear
        </Button>
        <Button
          className="mt-2"
          size="md"
          variant="solid"
          color="primary"
          onClick={handleUploadStart}
          disabled={isUploading || !files.length}>
          Upload
        </Button>
      </div>
    </div>
  );
}
