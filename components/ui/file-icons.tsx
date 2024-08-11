import { Icon } from "@iconify/react";
import React from "react";

type FileExtension =
  | "txt"
  | "md"
  | "pdf"
  | "doc"
  | "docx"
  | "ppt"
  | "pptx"
  | "xls"
  | "xlsx"
  | "csv"
  | "rtf"
  | "jpg"
  | "jpeg"
  | "png"
  | "gif"
  | "bmp"
  | "svg"
  | "ico"
  | "mp3"
  | "wav"
  | "ogg"
  | "mp4"
  | "avi"
  | "mov"
  | "wmv"
  | "zip"
  | "rar"
  | "7z"
  | "tar"
  | "html"
  | "css"
  | "js"
  | "json"
  | "xml"
  | "ts"
  | "tsx"
  | "jsx"
  | string;

interface FileIconProps {
  fileExtension: FileExtension;
  size?: number;
}

const FileIcon: React.FC<FileIconProps> = ({ fileExtension, size = 24 }) => {
  const getIconName = (ext: FileExtension): string => {
    switch (ext.toLowerCase()) {
      // Document formats
      case "txt":
        return "vscode-icons:file-type-text";
      case "md":
        return "vscode-icons:file-type-markdown";
      case "pdf":
        return "vscode-icons:file-type-pdf2";
      case "doc":
      case "docx":
        return "vscode-icons:file-type-word";
      case "ppt":
      case "pptx":
        return "vscode-icons:file-type-powerpoint";
      case "xls":
      case "xlsx":
        return "vscode-icons:file-type-excel";
      case "csv":
        return "vscode-icons:file-type-csv";
      case "rtf":
        return "vscode-icons:file-type-rich-text";

      // Image formats
      case "jpg":
      case "jpeg":
        return "vscode-icons:file-type-image";
      case "png":
        return "vscode-icons:file-type-png";
      case "gif":
        return "vscode-icons:file-type-gif";
      case "bmp":
        return "vscode-icons:file-type-bmp";
      case "svg":
        return "vscode-icons:file-type-svg";
      case "ico":
        return "vscode-icons:file-type-favicon";

      // Audio formats
      case "mp3":
        return "vscode-icons:file-type-audio";
      case "wav":
        return "vscode-icons:file-type-wav";
      case "ogg":
        return "vscode-icons:file-type-ogg";

      // Video formats
      case "mp4":
        return "vscode-icons:file-type-video";
      case "avi":
        return "vscode-icons:file-type-avi";
      case "mov":
        return "vscode-icons:file-type-mov";
      case "wmv":
        return "vscode-icons:file-type-wmv";

      // Archive formats
      case "zip":
        return "vscode-icons:file-type-zip";
      case "rar":
        return "vscode-icons:file-type-rar";
      case "7z":
        return "vscode-icons:file-type-7z";
      case "tar":
        return "vscode-icons:file-type-tar";

      // Programming and web formats
      case "html":
        return "vscode-icons:file-type-html";
      case "css":
        return "vscode-icons:file-type-css";
      case "js":
        return "vscode-icons:file-type-js";
      case "json":
        return "carbon:json-reference";
      case "xml":
        return "vscode-icons:file-type-xml";
      case "ts":
        return "vscode-icons:file-type-typescript";
      case "tsx":
        return "vscode-icons:file-type-react-ts";
      case "jsx":
        return "vscode-icons:file-type-react";

      // Default
      default:
        return "vscode-icons:default-file";
    }
  };

  const iconName = getIconName(fileExtension);

  return <Icon icon={iconName} width={size} height={size} />;
};

export default FileIcon;
