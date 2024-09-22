"use client";
import FileIcon from "@/components/ui/file-icons";
import { Chunk } from "@/restful/generated";
import { Icon } from "@iconify/react";
import {
  Button,
  Card,
  Divider,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Pagination,
  ScrollShadow,
  Spacer,
  useDisclosure,
} from "@nextui-org/react";
import { useTranslations } from "next-intl";
import { usePathname, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

interface LibraryFileChunkProps {
  fileId: string;
  filename: string;
  initialChunks: Chunk[];
}

const LibraryFileChunk: React.FC<LibraryFileChunkProps> = ({
  fileId,
  filename,
  initialChunks,
}) => {
  const t = useTranslations();
  const router = useRouter();
  const pathname = usePathname();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [chunks, setChunks] = useState<Chunk[]>(initialChunks);
  const pageSize = 20;
  const total = chunks[0].total || 0;
  const totalPages = Math.ceil(total / pageSize);
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(20);

  const pages = Math.ceil(total / rowsPerPage);

  const onRowsPerPageChange = React.useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      setRowsPerPage(Number(e.target.value));
      setPage(1);
    },
    [],
  );

  const onPageChange = React.useCallback(
    async (page: number) => {
      try {
        const response = await fetch(`/api/collection/chunks`, {
          method: "POST",
          body: JSON.stringify({
            file_id: fileId,
            limit: rowsPerPage,
            offset: (page - 1) * rowsPerPage,
          }),
        });
        const data = await response.json();
        setChunks(data);
        setPage(page);
      } catch (error) {
        console.error("Error fetching chunks:", error);
      }
    },
    [fileId, rowsPerPage, page],
  );

  const [selectedChunk, setSelectedChunk] = useState<Chunk | null>(null);
  const ext = filename.split(".").pop();
  useEffect(() => {
    if (chunks.length > 0 && !selectedChunk) {
      setSelectedChunk(chunks[0]);
    }
  }, [chunks, selectedChunk]);

  const handleBack = () => {
    router.back();
  };

  const handleChunkClick = (chunk: Chunk) => {
    setSelectedChunk(chunk);
    onOpen();
  };

  const parseContent = (content: string | undefined) => {
    if (!content) return { isJson: false, parsedContent: t("No content available") };
    try {
      const parsedJson = JSON.parse(content);
      return { isJson: true, parsedContent: parsedJson };
    } catch (e) {
      return { isJson: false, parsedContent: content };
    }
  };

  const renderContent = (content: string | undefined) => {
    const { isJson, parsedContent } = parseContent(content);
    if (isJson) {
      return (
        <pre className="whitespace-pre-wrap text-sm text-gray-700">
          {JSON.stringify(parsedContent, null, 2)}
        </pre>
      );
    }
    return <p className="text-sm text-gray-700">{parsedContent}</p>;
  };

  return (
    <div className="m container mx-auto flex flex-col bg-gray-50 p-6">
      <div className="mb-4 flex flex-row items-center gap-2">
        <Icon
          icon="mdi:arrow-left"
          className="cursor-pointer text-2xl text-gray-600 hover:text-gray-800"
          onClick={handleBack}
          aria-label="Go back"
        />
        <FileIcon fileExtension={ext || ""} />
        <h3 className="max-w-3xl truncate text-xl font-bold text-gray-800">{filename}</h3>
      </div>
      <Divider className="mb-4" />
      <div className="flex flex-grow flex-col overflow-auto">
        {chunks.length > 0 ? (
          <>
            <h4 className="mb-4 text-lg font-semibold text-gray-700">{total} Chunks</h4>
            <ScrollShadow className="flex-grow">
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {chunks.map((chunk) => (
                  <Card
                    key={chunk.id}
                    isPressable
                    isHoverable
                    onPress={() => handleChunkClick(chunk)}
                    className="group h-full w-full bg-white shadow-sm transition-all duration-200 ease-in-out hover:shadow-md">
                    <div className="flex h-full flex-col p-4">
                      <div className="mb-3 flex items-center justify-between">
                        <span className="rounded-full bg-blue-100 px-2 py-1 text-xs font-semibold text-blue-600">
                          #{chunk.sequence.toString().padStart(3, "0")}
                        </span>
                        <span className="text-xs font-medium text-gray-500">
                          {chunk.doc_type || "Unknown"}
                        </span>
                      </div>
                      <p className="line-clamp-4 flex-grow text-sm text-gray-700">
                        {chunk.content}
                      </p>
                      <div className="mt-3 flex items-center justify-end">
                        <span className="text-xs font-medium text-blue-600 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                          {t("View details")} →
                        </span>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </ScrollShadow>
          </>
        ) : (
          <div className="flex flex-grow items-center justify-center">
            <Card className="p-8 text-center">
              <Icon
                icon="mdi:file-document-outline"
                className="mx-auto mb-4 text-6xl text-gray-400"
              />
              <h5 className="mb-2 text-xl font-semibold text-gray-700"></h5>
              <p className="text-sm text-gray-600">
                {t("There are no chunks available for this file")} .
              </p>
            </Card>
          </div>
        )}
      </div>
      <Spacer y={4} />
      <div className="flex flex-col items-center justify-between gap-4 px-2 py-2 sm:flex-row">
        <div className="hidden w-full sm:flex sm:items-center sm:justify-between">
          <Pagination
            showControls
            showShadow
            color="primary"
            page={page}
            total={totalPages}
            onChange={onPageChange}
          />
          <div className="flex items-center gap-2">
            <span className="text-small text-default-400">Rows per page:</span>
            <select
              className="rounded-md bg-transparent text-small text-default-400"
              onChange={onRowsPerPageChange}>
              <option value="20">20</option>
              {/* <option value="40">40</option>
              <option value="60">60</option> */}
            </select>
          </div>
        </div>
      </div>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        size="3xl"
        classNames={{
          body: "p-0",
          base: "max-h-[80vh]",
        }}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Chunk #{selectedChunk?.sequence.toString().padStart(3, "0")}
              </ModalHeader>
              <ModalBody>
                <ScrollShadow className="h-[calc(80vh-130px)]">
                  <div className="p-4">
                    <div className="mb-4">
                      <h5 className="mb-2 text-lg font-semibold">{t("Content")}:</h5>
                      {renderContent(selectedChunk?.content)}
                    </div>
                    <div>
                      <h5 className="mb-2 text-lg font-semibold">{t("Metadata")}:</h5>
                      {selectedChunk?.metadata ? (
                        <pre className="whitespace-pre-wrap text-xs text-gray-600">
                          {JSON.stringify(selectedChunk.metadata, null, 2)}
                        </pre>
                      ) : (
                        <p className="text-sm text-gray-600">
                          {t("No metadata available")}
                        </p>
                      )}
                    </div>
                  </div>
                </ScrollShadow>
              </ModalBody>
              <ModalFooter>
                <Button color="primary" onPress={onClose}>
                  {t("Close")}
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
};

export default LibraryFileChunk;
