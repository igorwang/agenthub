"use client";
import FileTable, { FileDTO } from "@/components/LibraryFileList/file-table";
import {
  FilesListQuery,
  Order_By,
  Status_Enum,
  useFilesListLazyQuery,
} from "@/graphql/generated/types";
import { useCallback, useState } from "react";

interface FilesListProps {
  initialFiles: FilesListQuery | null;
  knowledgeBaseId: string;
}

export default function LibraryFileList({
  initialFiles,
  knowledgeBaseId,
}: FilesListProps) {
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const [files, setFiles] = useState<FilesListQuery["files"]>(initialFiles?.files || []);

  const [fetchFiles, { loading, error }] = useFilesListLazyQuery({
    variables: {
      order_by: { updated_at: Order_By.DescNullsLast },
      where: { knowledge_base_id: { _eq: knowledgeBaseId } },
      limit: pageSize,
      offset: (page - 1) * pageSize,
    },
    onCompleted: (data) => {
      if (data && data.files) {
        setFiles((prevFiles) => [...prevFiles, ...data.files]);
      }
    },
  });

  const handleLoadMore = () => {
    setPage((prevPage) => prevPage + 1);
  };

  const handleViewFile = useCallback((file: FileDTO) => {
    console.log("Viewing file:", file.name);
    // 实现查看文件的逻辑
  }, []);

  const handleEditFile = useCallback((file: FileDTO) => {
    console.log("Editing file:", file.name);
    // 实现编辑文件的逻辑
  }, []);

  const handleDeleteFile = useCallback((file: FileDTO) => {
    console.log("Deleting file:", file.name);
    // 实现删除文件的逻辑
  }, []);

  console.log("files", files, initialFiles);

  return (
    <div>
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
        onView={handleViewFile}
        onEdit={handleEditFile}
        onDelete={handleDeleteFile}
      />
    </div>
  );
}
