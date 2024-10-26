"use client";

import { PDFDocumentProxy } from "pdfjs-dist";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  PdfHighlighter,
  PdfHighlighterUtils,
  PdfLoader,
} from "react-pdf-highlighter-extended";

import HighlightContainer from "@/components/PdfViewer/highlight-container";
import PdfViewerSidebar from "@/components/PdfViewer/pdf-viewer-sidebar";
import { CommentedHighlight } from "@/components/PdfViewer/types";
import { testHighlights as _testHighlights } from "./test-highlights";

const TEST_HIGHLIGHTS = _testHighlights;
const PRIMARY_PDF_URL = "https://arxiv.org/pdf/2203.11115";
const SECONDARY_PDF_URL = "https://arxiv.org/pdf/1604.02480";

const getNextId = () => String(Math.random()).slice(2);

const parseIdFromHash = () => {
  return document.location.hash.slice("#highlight-".length);
};

const resetHash = () => {
  document.location.hash = "";
};

interface PdfViewerProps {
  pdfUrl: string;
}

export default function PdfViewer({ pdfUrl }: PdfViewerProps) {
  const highlighterUtilsRef = useRef<PdfHighlighterUtils>();
  const [highlights, setHighlights] = useState<Array<CommentedHighlight>>(
    TEST_HIGHLIGHTS[PRIMARY_PDF_URL] ?? [],
  );

  const getHighlightById = useCallback(
    (id: string) => {
      return highlights.find((highlight) => highlight.id === id);
    },
    [highlights],
  );

  const handlePdfLoad = (pdfDocument: PDFDocumentProxy) => {
    pdfDocument.getPage(1).then((page) => {
      const viewport = page.getViewport({ scale: 1.0 });
    });
  };

  // Scroll to highlight based on hash in the URL
  const scrollToHighlightFromHash = useCallback(() => {
    const highlight = getHighlightById(parseIdFromHash());

    if (highlight && highlighterUtilsRef.current) {
      highlighterUtilsRef.current.scrollToHighlight(highlight);
    }
  }, [getHighlightById, highlighterUtilsRef]);

  // Hash listeners for autoscrolling to highlights
  useEffect(() => {
    window.addEventListener("hashchange", scrollToHighlightFromHash);

    return () => {
      window.removeEventListener("hashchange", scrollToHighlightFromHash);
    };
  }, [scrollToHighlightFromHash]);

  return (
    <div className="flex h-full w-full flex-row gap-1">
      <div className="relative w-3/4">
        <div className="custom-scrollbar absolute inset-0 overflow-auto">
          <PdfLoader document={pdfUrl}>
            {(pdfDocument) => {
              handlePdfLoad(pdfDocument);
              return (
                <PdfHighlighter
                  pdfDocument={pdfDocument}
                  highlights={highlights}
                  onScrollAway={resetHash}
                  utilsRef={(utils) => {
                    if (utils) {
                      highlighterUtilsRef.current = utils;
                    }
                  }}
                  // 添加自定义样式
                  // scrollRef={null}
                  style={{
                    backgroundColor: "#f5f5f5", // A light gray color
                    scrollbarWidth: "thin",
                  }}>
                  <HighlightContainer editHighlight={() => {}} onContextMenu={() => {}} />
                </PdfHighlighter>
              );
            }}
          </PdfLoader>
        </div>
      </div>

      <PdfViewerSidebar highlights={highlights} />
    </div>
  );
}
