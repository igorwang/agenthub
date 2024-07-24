"use client";
import FileTable, { FileDTO } from "@/components/LibraryFileList/file-table";
import { PlusIcon } from "@/components/ui/icons";
import UploadZone from "@/components/UploadZone";
import {
  FilesListQuery,
  Order_By,
  Status_Enum,
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
import { useCallback, useEffect, useMemo, useState } from "react";

interface FilesListProps {
  initialFiles: FilesListQuery | null;
  knowledgeBaseId: string;
}

export default function LibraryFileList({
  initialFiles,
  knowledgeBaseId,
}: FilesListProps) {
  const [page, setPage] = useState<number>(1);
  const [searchValue, setSearchValue] = useState("");

  const pageSize = 10;
  const [files, setFiles] = useState<FilesListQuery["files"]>(initialFiles?.files || []);
  const pages = Math.ceil(
    (initialFiles?.files_aggregate.aggregate?.count || 0) / pageSize,
  );
  const [isUploadOpen, setIsUploadOpen] = useState(false);

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
    console.log("Viewing file:", file.name);
    // 实现查看文件的逻辑
  }, []);

  const handleRedoFile = useCallback((file: FileDTO) => {
    console.log("Editing file:", file.name);
    // 实现编辑文件的逻辑
  }, []);

  const handleDeleteFile = useCallback((file: FileDTO) => {
    console.log("Deleting file:", file.name);
    // 实现删除文件的逻辑
  }, []);

  const handleAfterUploadFile = useCallback(() => {
    console.log("handleAfterUploadFile");
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
        <Button color="primary" endContent={<PlusIcon />} onClick={openUploadModal}>
          Add New
        </Button>
      </div>

      <FileTable
        files={files.map((file) => ({
          ...{
            id: file.id,
            name: file.name,
            size: file.size,
            status: file.status as Status_Enum,
            updateTime: file.updated_at,
          }, // 确保状态与 Status_Enum 兼容
        }))}
        page={page}
        pages={pages}
        onPage={handleSetPage}
        onView={handleViewFile}
        onRedo={handleRedoFile}
        onDelete={handleDeleteFile}
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
    </div>
  );
}
