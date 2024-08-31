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
  ScrollShadow,
  useDisclosure,
} from "@nextui-org/react";
import { useTranslations } from "next-intl";
import { usePathname, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

interface LibraryFileChunkProps {
  filename: string;
  chunks: Chunk[];
}

const LibraryFileChunk: React.FC<LibraryFileChunkProps> = ({ filename, chunks }) => {
  const t = useTranslations();
  const router = useRouter();
  const pathname = usePathname();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [selectedChunk, setSelectedChunk] = useState<Chunk | null>(null);

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
    <div className="container mx-auto flex min-h-screen flex-col bg-gray-50 p-6">
      <div className="mb-4 flex flex-row items-center gap-2">
        <Icon
          icon="mdi:arrow-left"
          className="cursor-pointer text-2xl text-gray-600 hover:text-gray-800"
          onClick={handleBack}
          aria-label="Go back"
        />
        <FileIcon fileExtension="pdf" />
        <h3 className="text-xl font-bold text-gray-800">{filename}</h3>
      </div>
      <Divider className="mb-4" />
      <div className="flex flex-grow flex-col overflow-auto">
        {chunks.length > 0 ? (
          <>
            <h4 className="mb-4 text-lg font-semibold text-gray-700">
              {chunks.length} Chunks
            </h4>
            <ScrollShadow className="flex-grow">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
                {chunks.map((chunk) => (
                  <Card
                    key={chunk.id}
                    isPressable
                    isHoverable
                    onPress={() => handleChunkClick(chunk)}
                    className="h-full w-full bg-gray-100 shadow-sm transition-all duration-200 ease-in-out hover:border-blue-200 hover:bg-blue-50">
                    <div className="p-4">
                      <div className="mb-2 flex items-center justify-between">
                        <span className="text-xs font-semibold text-gray-500">
                          #{chunk.sequence.toString().padStart(3, "0")}
                        </span>
                        <span className="text-xs text-gray-500">
                          {chunk.doc_type || "Unknown"}
                        </span>
                      </div>
                      <p className="line-clamp-3 text-sm text-gray-700">
                        {chunk.content}
                      </p>
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
