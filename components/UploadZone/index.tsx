import { getFileImage } from "@/components/UploadZone/fileImages";
import { Dropzone, ExtFile, FileMosaic } from "@dropzone-ui/react";
import { Button } from "@nextui-org/button";
import { useState } from "react";

export default function UploadZone() {
  const [files, setFiles] = useState<ExtFile[]>([]);
  const [isUploading, setIsUploading] = useState<boolean>(false);
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
  const handleUploadStart = () => {
    setIsUploading(true);
    console.log("handleUploadStart");
    setFiles(
      files.map((ef) => ({
        ...ef,
        uploadStatus: "uploading",
      })),
    );

    setTimeout(() => {
      setFiles(
        files.map((file) => ({
          ...file,
          uploadStatus: "success",
        })),
      );
    }, 1000);
    setIsUploading(false);
  };

  return (
    <div className="flex flex-col items-end w-full p-2 h-full overflow-auto">
      <Dropzone
        className="max-h-full min-h-0 h-full flex-1"
        onChange={updateFiles}
        value={files}
        accept=".doc,.docx,.pdf,.ppt,.pptx,.xls,.xlsx,.txt"
        label="Drop or Click to upload your files"
        maxFiles={5}
        maxFileSize={10 * 1024 * 1024}
        footer={false}
        header={false}
      >
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
          className="mt-2 mr-2"
          size="md"
          variant="solid"
          color="primary"
          onClick={handleClear}
        >
          Clear
        </Button>
        <Button
          className="mt-2"
          size="md"
          variant="solid"
          color="primary"
          onClick={handleUploadStart}
          disabled={isUploading}
        >
          Upload
        </Button>
      </div>
    </div>
  );
}
