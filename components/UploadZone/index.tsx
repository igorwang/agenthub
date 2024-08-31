"use client";
import { getFileImage } from "@/components/UploadZone/fileImages";
import { Dropzone, ExtFile, FileMosaic } from "@dropzone-ui/react";
import { Button } from "@nextui-org/button";
import { useSession } from "next-auth/react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { toast } from "sonner";
import { v4 } from "uuid";

export type UploadFileType = {
  id?: string | number;
  uploadUrl?: any;
  uploadStatus?: string;
  objectName?: string;
  file?: File;
  name?: string;
  type?: string;
  size?: number;
  valid?: boolean;
  errors?: string[];
  uploadMessage?: string;
  videoUrl?: string;
  [key: string]: any;
};

export type UploadZoneProps = {
  maxNumberOfFile?: number;
  maxFileSize?: number;
  knowledgeBaseId?: string;
  sessionId?: string;
  acceptFileTypes?: string;
  onAfterUpload?: (files: UploadFileType[]) => void;
  // onFileUploadCallback?: (files: { id: string | number; name: string }[]) => void;
};

export default function UploadZone({
  sessionId,
  knowledgeBaseId,
  maxNumberOfFile = 10,
  maxFileSize = 100 * 1024 * 1024,
  acceptFileTypes = ".doc,.docx,.pdf,.ppt,.pptx,.xls,.xlsx,.txt,.json",
  onAfterUpload,
  // onFileUploadCallback,
}: UploadZoneProps) {
  const [files, setFiles] = useState<ExtFile[]>([]);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const t = useTranslations();

  const session = useSession();

  const updateFiles = (incommingFiles: ExtFile[]) => {
    const fileId = `${v4()}`;
    const files = incommingFiles.map((item) => {
      if (item) {
        const fileType = item.name?.split(".").pop() || "default";
        return { ...item, imageUrl: getFileImage(fileType), id: fileId };
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
      const fileId = v4();
      const ext = file.name?.split(".").pop();
      let objectName: string;
      if (knowledgeBaseId) {
        objectName = `knowledge_base/${knowledgeBaseId}/${fileId}.${ext}`;
      } else if (sessionId) {
        objectName = `session/${sessionId}/${fileId}.${ext}`;
      } else {
        objectName = `tmp/${fileId}.${ext}`;
      }

      const body = {
        bucket: "chat",
        objectName: objectName,
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
              item.id === file.id
                ? { ...item, uploadStatus: "success", id: fileId }
                : item,
            ),
          );

          return {
            ...file,
            id: fileId,
            uploadUrl: presignedPutUrl,
            uploadStatus: "success",
            objectName: objectName,
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
          objectName: objectName,
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
        // const callbackFiles = updatedFiles.map((item) => ({
        //   id: item.id || "",
        //   name: item.file?.name || "",
        // }));
        toast.success(
          "Files uploaded successfully! AI will take a little time to process.",
        );
        onAfterUpload?.(updatedFiles);
        // onFileUploadCallback?.(callbackFiles);
      })
      .catch((error) => {
        console.error("Error uploading files:", error);
      });
    setIsUploading(false);
  };

  return (
    <div className="flex h-full w-full flex-col items-end overflow-auto">
      <Dropzone
        className="h-full max-h-full min-h-0 flex-1"
        onChange={updateFiles}
        value={files}
        accept={acceptFileTypes}
        label={t("Drop or Click to upload your files")}
        maxFiles={maxNumberOfFile}
        maxFileSize={maxFileSize}
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
          {t("Clear")}
        </Button>
        <Button
          className="mt-2"
          size="md"
          variant="solid"
          color="primary"
          onClick={handleUploadStart}
          disabled={isUploading || !files.length}>
          {t("Upload")}
        </Button>
      </div>
    </div>
  );
}
