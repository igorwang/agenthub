"use client";

import UploadZone from "@/components/UploadZone";
import {
  Chunking_Strategy_Enum,
  FilesItemFragment,
  FilesListQueryVariables,
  Knowledge_Base_Set_Input,
  Knowledge_Base_Type_Enum,
  Order_By,
  useBatchDeleteFilesMutation,
  useDeleteFileByIdMutation,
  useFilesListLazyQuery,
  useKnowledgeBaseDetailQuery,
  useUpdateKnowledgeBaseMutation,
} from "@/graphql/generated/types";
import { getSignedUrl } from "@/lib/apiBizClient";
import { formatTime } from "@/lib/utils/date";
import { Icon } from "@iconify/react";
import {
  Button,
  Divider,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  Pagination,
  Selection,
  SortDescriptor,
  Spinner,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  Textarea,
  Tooltip,
} from "@nextui-org/react";
import React, {
  forwardRef,
  Key,
  useEffect,
  useImperativeHandle,
  useMemo,
  useState,
} from "react";
import { toast } from "sonner";

type Condition = {
  key?: string;
  value?: string;
};

const waitTime = (time = 100) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, time);
  });
};

const columns = [
  { name: "Name", uid: "name", sortable: true },
  { name: "Size", uid: "size", sortable: true },
  { name: "Status", uid: "status" },
  { name: "Update Time", uid: "UpdateTime", sortable: true },
  { name: "Action", uid: "action" },
];

interface KnowledgeBaseItem {
  id?: string;
  name?: string;
  description?: string;
  extraction_prompt_id?: number;
  base_type?: Knowledge_Base_Type_Enum;
  chunking_strategy?: Chunking_Strategy_Enum;
  chunking_parameters?: any;
  model_name?: string;
  is_extraction?: boolean;
  is_publish?: boolean;
  type?: {
    value?: string;
    comment?: string;
  };
}

interface ModalPropsItem {
  ids: string[];
  name?: string;
}

interface LibraryFileProps {
  id: string;
  showSaveButton?: boolean;
}

export interface LibraryFileHandle {
  saveLibraryInfo: () => void;
}

const LibraryFile = forwardRef<LibraryFileHandle, LibraryFileProps>(
  ({ id, showSaveButton = false }, ref) => {
    const [knowledgeBase, setknowledgeBase] = useState<KnowledgeBaseItem | null>();
    const [filterValue, setFilterValue] = useState("");
    const [isUploadOpen, setIsUploadOpen] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [modalProps, setModalProps] = useState<ModalPropsItem | null>(null);
    const [deleteFileById] = useDeleteFileByIdMutation();
    const [batchDeleteFilesMutation] = useBatchDeleteFilesMutation();
    const [condition, setCondition] = useState<Condition>({});
    const [selectedKeys, setSelectedKeys] = useState<Selection>(new Set([]));
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({
      column: "age",
      direction: "ascending",
    });
    const [page, setPage] = useState(1);
    const [filesQuery, { data, refetch }] = useFilesListLazyQuery();
    const [updateKnowledgeBaseMutation] = useUpdateKnowledgeBaseMutation();

    const query = useKnowledgeBaseDetailQuery({ variables: { id: id } });
    const pages = Math.ceil((data?.files_aggregate?.aggregate?.count || 0) / rowsPerPage);
    const onNextPage = React.useCallback(() => {
      if (page < pages) {
        setPage(page + 1);
      }
    }, [page, pages]);

    useImperativeHandle(ref, () => ({
      saveLibraryInfo() {
        // Add your save logic here
        handleSaveLibraryInfo();
      },
    }));

    const handleSaveLibraryInfo = () => {
      const input: Knowledge_Base_Set_Input = {
        name: knowledgeBase?.name,
        description: knowledgeBase?.description,
      };
      updateKnowledgeBaseMutation({
        variables: {
          pk_columns: { id: id },
          _set: input,
        },
      }).then(() => {
        query.refetch();
        toast.success("Library information update succeeded！");
      });
    };

    useEffect(() => {
      if (query.data) {
        setknowledgeBase({ ...query.data?.knowledge_base_by_pk } as KnowledgeBaseItem);
      }
    }, [query]);

    const onPreviousPage = React.useCallback(() => {
      if (page > 1) {
        setPage(page - 1);
      }
    }, [page]);

    const onRowsPerPageChange = React.useCallback(
      (e: React.ChangeEvent<HTMLSelectElement>) => {
        setRowsPerPage(Number(e.target.value));
        setPage(1);
      },
      [],
    );

    const onSearchChange = React.useCallback((value?: string) => {
      if (value) {
        setFilterValue(value);
        setPage(1);
      } else {
        setFilterValue("");
      }
    }, []);

    const onClear = React.useCallback(() => {
      setFilterValue("");
      setPage(1);
    }, []);

    const editContent = (
      <div className="flex flex-col gap-4 pt-2">
        <Input
          isRequired
          label="Library Name"
          labelPlacement="outside"
          placeholder="Enter library name"
          type="text"
          variant={"flat"}
          value={knowledgeBase?.name}
          onChange={(e) =>
            setknowledgeBase({ ...knowledgeBase, name: e.target.value || "" })
          }
        />
        <Textarea
          label="Library Description"
          labelPlacement="outside"
          placeholder="Enter library description"
          description="Maximum 200 characters"
          type="text"
          variant={"flat"}
          value={knowledgeBase?.description || ""}
          onChange={(e) => textareaOnChange(e)}
        />
      </div>
    );

    function textareaOnChange(e: any) {
      const value = e.target.value;
      if (value.length <= 500) {
        setknowledgeBase({ ...knowledgeBase, description: value });
      } else {
        toast.error("Library description limit 200 characters ");
      }
    }

    const topContent = useMemo(() => {
      return (
        <div className="mx-2">
          <div className="text-xl font-medium">{knowledgeBase?.name || "-"}</div>
          {showSaveButton && (
            <Button
              className={"absolute right-0 top-1 mr-2 flex"}
              color="primary"
              onClick={() => handleSaveLibraryInfo()}
              size="md">
              Save
            </Button>
          )}
          {editContent}
          <Divider className="my-2" />
          <div className="flex flex-col gap-4">
            <div className="flex items-end justify-between gap-3">
              <Input
                isClearable
                className="w-full sm:max-w-[44%]"
                placeholder="Search by name..."
                // startContent={<SearchIcon />}
                value={filterValue}
                onClear={() => onClear()}
                onValueChange={onSearchChange}
                startContent={<Icon icon="solar:magnifer-linear" />}
              />
              <div className="mr-2 flex gap-3">
                <Button color="primary" size="md" onClick={() => setIsUploadOpen(true)}>
                  Add New File
                </Button>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-small text-default-400">
                Total {data?.files_aggregate?.aggregate?.count} files
              </span>
              <label className="flex items-center text-small text-default-400">
                Rows per page:
                <select
                  className="bg-transparent text-small text-default-400 outline-none"
                  onChange={onRowsPerPageChange}>
                  <option value="10">10</option>
                  <option value="20">20</option>
                  <option value="100">100</option>
                </select>
              </label>
            </div>
          </div>
        </div>
      );
    }, [filterValue, onSearchChange, onRowsPerPageChange, data, knowledgeBase]);

    const bottomContent = React.useMemo(() => {
      return (
        <div className="flex items-center justify-between px-2 py-2">
          <span className="w-[30%] text-small text-default-400">
            {selectedKeys === "all" ? (
              <div className="flex">
                All items selected
                <Tooltip content="Delete selected files">
                  <Icon
                    className={"mx-1 cursor-pointer"}
                    onClick={onClickBatchDelelteIcon}
                    icon="material-symbols-light:delete-outline"
                    width={"1.5em"}
                  />
                </Tooltip>
              </div>
            ) : (
              <div className="flex">
                {selectedKeys.size} of {data?.files_aggregate?.aggregate?.count} selected
                {selectedKeys.size > 0 && (
                  <Tooltip content="Delete selected files">
                    <Icon
                      className={"mx-1 cursor-pointer"}
                      onClick={(e) => onClickBatchDelelteIcon(e)}
                      icon="material-symbols-light:delete-outline"
                      width={"1.5em"}
                    />
                  </Tooltip>
                )}
              </div>
            )}
          </span>
          <Pagination
            isCompact
            showControls
            showShadow
            color="primary"
            page={page}
            total={pages}
            onChange={setPage}
          />
          <div className="hidden w-[30%] justify-end gap-2 sm:flex">
            <Button
              isDisabled={pages === 1}
              size="sm"
              variant="flat"
              onPress={onPreviousPage}>
              Previous
            </Button>
            <Button
              isDisabled={pages === 1}
              size="sm"
              variant="flat"
              onPress={onNextPage}>
              Next
            </Button>
          </div>
        </div>
      );
    }, [selectedKeys, page, pages, data?.files_aggregate?.aggregate?.count]);

    const searchConditions: FilesListQueryVariables = useMemo(
      () => ({
        where: { name: { _like: `%${filterValue}%` }, knowledge_base_id: { _eq: id } },
        order_by: { updated_at: Order_By.DescNullsLast },
        offset: (page - 1) * rowsPerPage,
        limit: rowsPerPage,
      }),
      [rowsPerPage, page, filterValue],
    );

    useEffect(() => {
      filesQuery({ variables: searchConditions }).then((res) => {
        setLoading(false);
      });
    }, [searchConditions, refetch]);

    if (loading) {
      return (
        <div className="flex w-dvw items-center justify-center">
          <Spinner label="Loading..." />
        </div>
      );
    }

    async function onDeleteFile(ids: string[]) {
      const id = ids[0];
      deleteFileById({ variables: { id: id } }).then(async (res) => {
        toast.success(`${res?.data?.delete_files_by_pk?.name} was successfully deleted`);
        refetch();
      });
    }

    async function onBatchDeleteFile(ids: string[]) {
      batchDeleteFilesMutation({
        variables: {
          where: {
            id: { _in: ids },
          },
        },
      }).then(async () => {
        toast.success("Successfully deleted files!");
        refetch();
      });
    }

    async function onDownloadFile(
      e: React.MouseEvent<SVGSVGElement, MouseEvent>,
      item: FilesItemFragment,
    ) {
      e.stopPropagation();
      if (item?.path) {
        const match = item?.path.match("^.*?/");
        if (match) {
          const bucket = match[0].substring(0, match[0].length - 1);
          const key = item?.path.substring(match[0].length);
          getSignedUrl(bucket, key).then((res) => {
            window.open(res?.data?.data.url);
          });
        }
      } else {
        toast.error("File does not exist");
      }
    }

    function onClickDeleteIcon(
      e: React.MouseEvent<SVGSVGElement, MouseEvent>,
      item: FilesItemFragment,
    ) {
      e.stopPropagation();
      setIsModalOpen(true);
      setModalProps({ ids: [item.id], name: item?.name });
    }

    function onClickBatchDelelteIcon(e: React.MouseEvent<SVGSVGElement, MouseEvent>) {
      e.stopPropagation();
      if (selectedKeys !== "all") {
        const ids: string[] = [];
        selectedKeys.forEach((value: Key) => {
          ids.push(value.toString());
        });
        setModalProps({ ids: ids });
      }
      setIsModalOpen(true);
    }

    function onCloseUploadModal() {
      setIsUploadOpen(false);
      refetch();
    }

    return (
      <>
        {modalProps && _renderModal(modalProps)}
        <Modal isOpen={isUploadOpen} onClose={() => onCloseUploadModal()} className="p-6">
          <ModalContent>
            {/* 这里放入你要显示在 Modal 中的内容组件 */}
            <UploadZone knowledgeBaseId={knowledgeBase?.id} />
          </ModalContent>
        </Modal>
        <Table
          aria-label="Example table with custom cells, pagination and sorting"
          isHeaderSticky
          bottomContent={bottomContent}
          bottomContentPlacement="outside"
          classNames={{
            wrapper: "max-h-full",
          }}
          selectedKeys={selectedKeys}
          selectionMode="multiple"
          sortDescriptor={sortDescriptor}
          topContent={topContent}
          topContentPlacement="outside"
          onSelectionChange={setSelectedKeys}
          onSortChange={setSortDescriptor}>
          <TableHeader columns={columns}>
            {(column) => (
              <TableColumn
                key={column.uid}
                align={column.uid === "actions" ? "center" : "start"}
                allowsSorting={column.sortable}>
                {column.name}
              </TableColumn>
            )}
          </TableHeader>
          <TableBody emptyContent={"No files found"} items={data?.files || []}>
            {(item) => (
              <TableRow key={item.id}>
                <TableCell>{item?.name || "-"}</TableCell>
                <TableCell>
                  {item?.size
                    ? (item.size / (1024 * 1024)).toFixed(2).toString() + "M"
                    : "-"}
                </TableCell>
                <TableCell>{item?.status || "-"}</TableCell>
                <TableCell>{formatTime(item?.updated_at) || "-"} </TableCell>
                <TableCell className="relative flex items-center justify-between">
                  <Tooltip content="Delete">
                    <Icon
                      className={"mx-1 cursor-pointer"}
                      onClick={(e) => onClickDeleteIcon(e, item)}
                      icon="material-symbols-light:delete-outline"
                      width={"1.5em"}
                      height={"1.5em"}
                    />
                  </Tooltip>
                  <Tooltip content="Download">
                    <Icon
                      className={"mx-1 cursor-pointer"}
                      onClick={(e) => onDownloadFile(e, item)}
                      icon="material-symbols-light:cloud-download-outline"
                      width={"1.5em"}
                    />
                  </Tooltip>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </>
    );

    function _renderModal(props: ModalPropsItem) {
      return (
        <Modal isOpen={isModalOpen} hideCloseButton={true}>
          <ModalContent>
            <ModalBody>
              <div className="flex p-1 text-xl">
                <Icon
                  className={"mx-1"}
                  icon="material-symbols-light:info"
                  width={"1.5em"}
                />
                {props?.ids.length > 1
                  ? "Confirm to delete the selected files?"
                  : `Are you sure to delete ${props?.name || "the file"} ?`}
              </div>
            </ModalBody>
            <ModalFooter>
              <Button onPress={() => setIsModalOpen(false)}>NO</Button>
              <Button
                color="primary"
                onPress={() => {
                  setIsModalOpen(false);
                  props.ids.length > 1
                    ? onBatchDeleteFile(props.ids)
                    : onDeleteFile(props.ids);
                }}>
                YES
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      );
    }
  },
);
LibraryFile.displayName = "LibraryFile";
export default LibraryFile;
