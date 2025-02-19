"use client";
import FileTable, { FileDTO } from "@/components/Library/LibraryFileList/file-table";
import DeleteConfirmModal from "@/components/ui/delete-modal";
import DeleteMultipleModal from "@/components/ui/delete-mutiple-modal";
import GenericModal from "@/components/ui/generic-modal";
import { PlusIcon } from "@/components/ui/icons";
import UploadZone, { UploadFileType } from "@/components/UploadZone";
import {
  FilesListQuery,
  KnowledgeBaseDetailQuery,
  Order_By,
  Status_Enum,
  useBatchDeleteFilesMutation,
  useFilesListQuery,
  useKnowledgeBaseDetailQuery,
} from "@/graphql/generated/types";
import { Icon } from "@iconify/react";
import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  Tooltip,
} from "@nextui-org/react";
import { usePathname, useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { useTranslations } from "use-intl";

interface FilesListProps {
  initialFiles: FilesListQuery | null;
  knowledgeBaseId: string;
}

interface File {
  id: string;
  name: string;
}

export default function LibraryFileList({
  initialFiles,
  knowledgeBaseId,
}: FilesListProps) {
  const [page, setPage] = useState<number>(1);
  const [searchValue, setSearchValue] = useState("");
  const [deleteModal, setDeleteModal] = useState(false);
  const [deleteFilesModal, setDeleteFilesModal] = useState(false);
  const [rebuildLibraryModal, setRebuildLibraryModal] = useState(false);
  const [isRebuiding, setIsRebuilding] = useState(false);

  const [selectedFile, setSelectFile] = useState<File | null>();
  useBatchDeleteFilesMutation();
  const [batchDeleteFilesMutation] = useBatchDeleteFilesMutation();
  const [reprocessingFiles, setReprocessingFiles] = useState<Set<string>>(new Set());
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [selectedFileList, setSelectedFileList] = useState<string[]>([]);
  const [isExporting, setIsExporting] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [knowledgeBaseDetail, setKnowledgeBaseDetail] =
    useState<KnowledgeBaseDetailQuery | null>(null);
  const { data: knowledgeBaseDetailData } = useKnowledgeBaseDetailQuery({
    variables: { id: knowledgeBaseId },
  });

  const t = useTranslations("");

  const router = useRouter();
  const pathname = usePathname();

  const pageSize = 10;
  const [files, setFiles] = useState<FilesListQuery["files"]>(initialFiles?.files || []);
  const pages = Math.ceil(
    (initialFiles?.files_aggregate.aggregate?.count || 0) / pageSize,
  );

  const queryVariables = useMemo(
    () => ({
      order_by: { updated_at: Order_By.DescNullsLast },
      where: {
        knowledge_base_id: { _eq: knowledgeBaseId },
        // Add search condition if searchValue is not empty
        ...(searchValue
          ? {
              _or: [
                { name: { _ilike: `%${searchValue}%` } },
                // Add more fields to search as needed
              ],
            }
          : {}),
      },
      limit: pageSize,
      offset: (page - 1) * pageSize,
    }),
    [knowledgeBaseId, searchValue, page, pageSize],
  );

  const { loading, error, data, refetch } = useFilesListQuery({
    variables: queryVariables,
  });

  useEffect(() => {
    if (data && data.files) {
      setFiles(data.files);
    }
  }, [data]);

  useEffect(() => {
    if (knowledgeBaseDetailData) {
      setKnowledgeBaseDetail(knowledgeBaseDetailData);
    }
  }, [knowledgeBaseDetailData]);

  const handleSetPage = (page: number) => {
    setPage(page);
    refetch();
  };

  const handleViewFile = useCallback((file: FileDTO) => {
    router.push(`${pathname}/chunk?filename=${file.name}&fileId=${file.id}`);
  }, []);

  const handleRedoFile = useCallback(
    async (file: FileDTO) => {
      if (reprocessingFiles.has(file.id)) return;

      setReprocessingFiles((prev) => new Set(prev).add(file.id));
      try {
        const response = await fetch("/api/file/reprocess", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            file_id: file.id,
          }),
        });

        if (!response.ok) {
          throw new Error(t("Failed to reprocess file"));
        }
        const result = await response.json();
        toast.success(t(`File is being reprocessed`));

        refetch();
      } catch (error) {
        console.error(t("Error reprocessing file"), error);
        toast.error(t(`Failed to reprocess file`));
      } finally {
        setReprocessingFiles((prev) => {
          const newSet = new Set(prev);
          newSet.delete(file.id);
          return newSet;
        });
      }
    },
    [refetch, reprocessingFiles],
  );

  const handleRebuildLibrary = useCallback(async () => {
    setIsRebuilding(true);
    try {
      const response = await fetch("/api/collection/rebuild", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          knowledge_base_id: knowledgeBaseId,
        }),
      });

      if (!response.ok) {
        throw new Error(t("Failed to rebuild library"));
      }
      const result = await response.json();
      toast.success(t(`File is rebuilding`));

      refetch();
    } catch (error) {
      console.error(t("Error to rebuild library"), error);
      toast.error(t(`Failed to rebuild library`));
    } finally {
    }
    setIsRebuilding(false);
  }, [refetch]);

  const handleDeleteFile = useCallback(
    (ids: string[]) => {
      // 实现删除文件的逻辑
      batchDeleteFilesMutation({
        variables: {
          where: { id: { _in: ids } },
        },
      }).then(async (res) => {
        toast.success(
          `${t("Successfully deleted files")}: ${res.data?.delete_files?.returning.length || 0}`,
        );
        refetch();
      });
    },
    [batchDeleteFilesMutation, refetch, toast],
  );

  const handleExportLibrary = useCallback(async () => {
    setIsExporting(true);
    try {
      const response = await fetch("/api/collection/export", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          knowledge_base_id: knowledgeBaseId,
        }),
      });
      const result = await response.json();
      toast.success(
        t(`Library exported successfully`, {
          defaultValue: "Library exported successfully; Please wait for the process.",
        }),
      );
    } catch (error) {
      console.error(t("Error to export library"), error);
      toast.error(t(`Failed to export library`));
    } finally {
      setIsExporting(false);
    }
  }, [knowledgeBaseId, refetch]);

  const handleDownloadLibrary = useCallback(
    async (key: string) => {
      setIsDownloading(true);
      try {
        const response = await fetch("/api/file/get_signed_url", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            bucket: "chat",
            key: key,
            expires: 60 * 60,
          }),
        });
        const result = await response.json();
        window.open(result.url, "_blank");
        toast.success(t(`Library downloaded successfully`));
      } catch (error) {
        console.error(t("Error to export library"), error);
        toast.error(t(`Failed to export library`));
      } finally {
        setIsDownloading(false);
      }
    },
    [knowledgeBaseId, refetch],
  );

  const handleAfterUploadFile = useCallback((files: UploadFileType[]) => {
    setPage(1);
  }, []);

  const handleExportFile = useCallback(
    async (file: FileDTO) => {
      // 实现导出文件的逻辑
      const fileObject = files.find((f) => f.id === file.id);
      console.log(fileObject);
      const path = fileObject?.path;
      const bucket = path?.split("/")[0];
      const objectName = path?.split("/").slice(1).join("/");

      console.log(bucket, objectName);

      try {
        const response = await fetch("/api/file/get_signed_url", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            bucket,
            key: objectName,
            expires: 60 * 10,
          }),
        });
        const result = await response.json();
        window.open(result.url, "_blank");
        toast.success(t(`File exported successfully`));
      } catch (error) {
        console.error(t("Error to export file"), error);
      }
    },
    [files],
  );

  const openUploadModal = useCallback(() => {
    setIsUploadOpen(true);
  }, []);

  const closeUploadModal = () => {
    setIsUploadOpen(false);
    refetch();
  };

  return (
    <div className="flex h-full w-full max-w-7xl flex-col items-start gap-2 p-4">
      <div className="flex w-full justify-between">
        <Input
          fullWidth
          aria-label="search"
          className="w-full max-w-sm px-1"
          labelPlacement="outside"
          placeholder={`${t("Search")}...`}
          value={searchValue}
          onValueChange={setSearchValue}
          startContent={
            <Icon
              className="text-default-500 [&>g]:stroke-[2px]"
              icon="solar:magnifer-linear"
              width={18}
            />
          }
        />
        <div className="flex flex-row gap-2">
          {selectedFileList.length > 0 && (
            <Button
              color="danger"
              variant="bordered"
              onClick={() => {
                setDeleteFilesModal(true);
              }}>
              {t("Delete Files")}
            </Button>
          )}
          <Button color="primary" endContent={<PlusIcon />} onClick={openUploadModal}>
            {t("Add New")}
          </Button>
          <Dropdown>
            <DropdownTrigger>
              <Button
                color="primary"
                variant="bordered"
                endContent={<Icon icon="icon-park-outline:more" width={18} />}>
                {t("More")}
              </Button>
            </DropdownTrigger>
            <DropdownMenu className="w-48">
              <DropdownItem className="data-[hover]:bg-transparent">
                {knowledgeBaseDetail?.knowledge_base_by_pk?.export_key && (
                  <Tooltip content={t("Download latest exported library")}>
                    <Button
                      color="primary"
                      variant="light"
                      className="w-full"
                      isDisabled={isDownloading}
                      isLoading={isDownloading}
                      onClick={() => {
                        handleDownloadLibrary(
                          knowledgeBaseDetail?.knowledge_base_by_pk?.export_key || "",
                        );
                      }}
                      startContent={<Icon icon="solar:download-linear" width={18} />}>
                      {t("Download Library")}
                    </Button>
                  </Tooltip>
                )}
              </DropdownItem>
              <DropdownItem className="data-[hover]:bg-transparent">
                <Button
                  color="secondary"
                  variant="light"
                  className="w-full"
                  isDisabled={isExporting}
                  isLoading={isExporting}
                  onClick={() => {
                    handleExportLibrary();
                  }}
                  startContent={<Icon icon="solar:download-linear" width={18} />}>
                  {t("Export Library")}
                </Button>
              </DropdownItem>

              <DropdownItem className="data-[hover]:bg-transparent">
                <Button
                  color="danger"
                  variant="light"
                  className="w-full"
                  isDisabled={isRebuiding}
                  isLoading={isRebuiding}
                  startContent={<Icon icon="icon-park-outline:redo" width={18} />}
                  onClick={() => {
                    setRebuildLibraryModal(true);
                  }}>
                  {t("Rebuild Library")}
                </Button>
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </div>
      </div>

      <FileTable
        files={files.map((file) => ({
          ...{
            id: file.id,
            name: file.name,
            size: file.size,
            status: file.status as Status_Enum,
            updateTime: file.updated_at,
            errorMessage: file.error_message || "",
          },
        }))}
        page={page}
        pages={pages}
        onPage={handleSetPage}
        onView={handleViewFile}
        onExport={handleExportFile}
        onRedo={handleRedoFile}
        onDelete={(file: { id: string; name: string }) => {
          setDeleteModal(true);
          setSelectFile(file);
        }}
        onFileListSelectedChange={setSelectedFileList}
        reprocessingFiles={reprocessingFiles}
      />
      <Modal
        isOpen={isUploadOpen}
        onClose={closeUploadModal}
        className="rounded-lg bg-white shadow-lg"
        size="2xl">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1 border-b pb-4 text-2xl font-semibold text-gray-700">
                {t("Upload Files")}
              </ModalHeader>
              <ModalBody className="py-6">
                <UploadZone
                  knowledgeBaseId={knowledgeBaseId}
                  maxNumberOfFile={100}
                  acceptFileTypes=".doc,.docx,.pdf,.ppt,.pptx,.xls,.xlsx,.txt,.md,.json,.mp3,.mp4"
                  onAfterUpload={handleAfterUploadFile}
                />
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
      {deleteModal && (
        <DeleteConfirmModal
          isOpen={deleteModal}
          title={t("Delete File")}
          name={selectedFile?.name || ""}
          id={selectedFile?.id || ""}
          onClose={() => {
            setDeleteModal(false);
            setSelectFile(null);
          }}
          onAffirm={() => {
            if (selectedFile?.id) {
              handleDeleteFile([selectedFile?.id]);
            }
            setSelectFile(null);
          }}
        />
      )}
      {deleteFilesModal && (
        <DeleteMultipleModal
          isOpen={deleteFilesModal}
          title={t("Delete Files")}
          name={"file"}
          ids={selectedFileList}
          onClose={() => {
            setDeleteFilesModal(false);
            // setSelectedFileList([]);
          }}
          onAffirm={() => {
            handleDeleteFile(selectedFileList);
            setSelectedFileList([]);
          }}
        />
      )}
      {rebuildLibraryModal && (
        <GenericModal
          isOpen={rebuildLibraryModal}
          onClose={() => setRebuildLibraryModal(false)}
          title={t("Confirm Rebuild")}
          primaryButtonText={t("Rebuild")}
          primaryButtonColor="danger"
          secondaryButtonText={t("Close")}
          onPrimaryAction={handleRebuildLibrary}>
          <p>{t("Are you sure you want to rebuild this library")}?</p>
        </GenericModal>
      )}
    </div>
  );
}
