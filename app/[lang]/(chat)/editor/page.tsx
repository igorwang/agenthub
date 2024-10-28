"use client";
import PdfViewer from "@/components/PdfViewer";
import { useTranslations } from "next-intl";

export default function EditorPage() {
  const t = useTranslations("");

  return (
    <div className="mx-auto flex h-full w-full max-w-7xl flex-col">
      <PdfViewer pdfUrl="https://arxiv.org/pdf/2203.11115" />
    </div>
  );
}
