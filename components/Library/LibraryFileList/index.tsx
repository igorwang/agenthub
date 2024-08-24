"use client";
import FileTable, { FileDTO } from "@/components/Library/LibraryFileList/file-table";
import DeleteConfirmModal from "@/components/ui/delete-modal";
import { PlusIcon } from "@/components/ui/icons";
import UploadZone from "@/components/UploadZone";
import {
  FilesListQuery,
  Order_By,
  Status_Enum,
  useDeleteFileByIdMutation,
  useFilesListQuery,
} from "@/graphql/generated/types";
import { Icon } from "@iconify/react";
import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
} from "@nextui-org/react";
import { usePathname, useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

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
  const [selectedFile, setSelectFile] = useState<File | null>();
  const [deleteFileById] = useDeleteFileByIdMutation();
  const [reprocessingFiles, setReprocessingFiles] = useState<Set<string>>(new Set());
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [selectedFileList, setSelectedFileList] = useState<string[]>([]);

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

  const handleSetPage = (page: number) => {
    setPage(page);
    refetch();
  };

  const handleViewFile = useCallback((file: FileDTO) => {
    router.push(`${pathname}/chunk?filename=${file.name}&fileId=${file.id}`);
    // 实现查看文件的逻辑
    // toast.error("Wating for implement");
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
          throw new Error("Failed to reprocess file");
        }
        const result = await response.json();
        toast.success(`File "${file.name}" is being reprocessed.`);

        refetch();
      } catch (error) {
        console.error("Error reprocessing file:", error);
        toast.error(`Failed to reprocess file "${file.name}". Please try again.`);
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

  const handleDeleteFile = useCallback((id: string) => {
    // 实现删除文件的逻辑
    deleteFileById({ variables: { id: id } }).then(async (res) => {
      toast.success(`${res?.data?.delete_files_by_pk?.name} was successfully deleted`);
      refetch();
    });
  }, []);

  const handleAfterUploadFile = useCallback(() => {
    setPage(1);
  }, []);

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
          placeholder="Search..."
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
            <Button color="danger" onClick={openUploadModal}>
              Delete Files
            </Button>
          )}
          <Button color="primary" endContent={<PlusIcon />} onClick={openUploadModal}>
            Add New
          </Button>
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
                Upload Files
              </ModalHeader>
              <ModalBody className="py-6">
                <UploadZone
                  knowledgeBaseId={knowledgeBaseId}
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
          title={"Delete File"}
          name={selectedFile?.name || ""}
          id={selectedFile?.id || ""}
          onClose={() => {
            setDeleteModal(false);
            setSelectFile(null);
          }}
          onAffirm={() => {
            handleDeleteFile(selectedFile?.id || "");
            setSelectFile(null);
          }}
        />
      )}
      {deleteFilesModal && (
        <DeleteConfirmModal
          isOpen={deleteFilesModal}
          title={"Delete Files"}
          name={""}
          id={selectedFile?.id || ""}
          onClose={() => {
            setDeleteModal(false);
            setSelectFile(null);
          }}
          onAffirm={() => {
            handleDeleteFile(selectedFile?.id || "");
            setSelectFile(null);
          }}
        />
      )}
    </div>
  );
}
