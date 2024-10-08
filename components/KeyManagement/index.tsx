"use client";

import {
  ApiKeyFragmentFragment,
  GetApiKeysQuery,
  useCreateNewApiKeyMutation,
  useDeleteApiKeyMutation,
  useGetApiKeysQuery,
} from "@/graphql/generated/types";
import { Icon } from "@iconify/react";
import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  Tooltip,
} from "@nextui-org/react";
import crypto from "crypto";
import { useSession } from "next-auth/react";
import { useTranslations } from "next-intl";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

function generateApiKey(): string {
  const prefix = "sk-";
  const randomBytes = crypto.randomBytes(24);
  const base64 = randomBytes.toString("base64");
  const urlSafe = base64
    .replace(/[+/]/g, (m) => (m === "+" ? "-" : "_"))
    .replace(/=/g, "");
  return `${prefix}${urlSafe}`;
}

function KeyManagement() {
  const t = useTranslations();
  const session = useSession();

  const [keys, setKeys] = useState<ApiKeyFragmentFragment[]>([]);
  const { data, loading } = useGetApiKeysQuery({
    variables: {
      where: {
        creator_id: { _eq: session.data?.user?.id },
      },
    },
  });
  const [keyName, setKeyName] = useState("");
  const [createNewApiKey, { loading: createNewApiKeyLoading }] =
    useCreateNewApiKeyMutation();
  const [isCreateKeyModelOpen, setIsCreateKeyModelOpen] = useState(false);
  const [isDeleteKeyModelOpen, setIsDeleteKeyModelOpen] = useState(false);
  const [deleteApiKey] = useDeleteApiKeyMutation();
  const [deleteKeyId, setDeleteKeyId] = useState<number | null>(null);

  useEffect(() => {
    if (data) {
      setKeys(data.api_key);
    }
  }, [data]);

  const columns = [
    { name: t("NAME"), uid: "name" },
    { name: t("KEY"), uid: "key" },
    { name: t("CREATED_AT"), uid: "created_at" },
    { name: t("ACTIONS"), uid: "actions" },
  ];

  function copyToClipboard(text: string) {
    navigator.clipboard.writeText(text);
    // TODO: Add a toast notification for successful copy
  }

  function viewKey(key: string) {
    // TODO: Implement view key functionality (e.g., modal or tooltip)
  }

  const handleCreateNewApiKey = useCallback(async () => {
    const apiKey = generateApiKey();
    try {
      const result = await createNewApiKey({
        variables: {
          object: {
            name: keyName || "New Key",
            key: apiKey,
            creator_id: session.data?.user?.id,
          },
        },
      });
      setIsCreateKeyModelOpen(false);
      setKeyName("");
      setKeys([...keys, result.data?.insert_api_key_one as ApiKeyFragmentFragment]);
      toast.success(t("New API key created successfully"));
    } catch (error) {
      console.error(error);
      toast.error(t("Failed to create new API key"));
    }
  }, [keyName, createNewApiKey]);

  const handleDeleteApiKey = useCallback(
    async (keyId: number) => {
      try {
        await deleteApiKey({ variables: { id: keyId } });
        const newKeys = keys.filter((key) => key.id !== keyId);
        setKeys(newKeys);
        toast.success(t("API key deleted successfully"));
      } catch (error) {
        console.error(error);
        toast.error(t("Failed to delete API key"));
      }
      setIsDeleteKeyModelOpen(false);
      setDeleteKeyId(null);
    },
    [deleteApiKey, keys, t],
  );

  const renderCell = useCallback(
    (key: GetApiKeysQuery["api_key"][0], columnKey: React.Key) => {
      switch (columnKey) {
        case "name":
          return <p className="text-bold text-sm capitalize">{key.name}</p>;
        case "key":
          return (
            <div className="flex items-center justify-between space-x-2">
              <span>
                {key.key.slice(0, 6)}****{key.key.slice(-6)}
              </span>
              <Tooltip content="Copy key">
                <Button
                  isIconOnly
                  size="sm"
                  variant="light"
                  onPress={() => copyToClipboard(key.key)}>
                  <Icon icon="mdi:content-copy" />
                </Button>
              </Tooltip>
              {/* <Tooltip content="View key">
                <Button
                  isIconOnly
                  size="sm"
                  variant="light"
                  onPress={() => viewKey(key.key)}>
                  <Icon icon="mdi:eye" />
                </Button>
              </Tooltip> */}
            </div>
          );
        case "created_at":
          return (
            <p className="text-bold text-sm">
              {new Date(key.created_at).toLocaleString()}
            </p>
          );
        case "actions":
          return (
            <Button
              size="sm"
              color="danger"
              variant="light"
              onPress={() => {
                setDeleteKeyId(key.id);
                setIsDeleteKeyModelOpen(true);
              }}>
              {t("DELETE")}
            </Button>
          );
        default:
          return null;
      }
    },
    [t, deleteApiKey, keys],
  );

  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-4">
      <Icon icon="solar:key-minimalistic-square-3-broken" className="text-4xl" />
      <Table aria-label="API Keys Table">
        <TableHeader>
          {columns.map((column) => (
            <TableColumn key={column.uid}>{column.name}</TableColumn>
          ))}
        </TableHeader>
        <TableBody>
          {keys.map((key) => (
            <TableRow key={key.id}>
              {columns.map((column) => (
                <TableCell key={column.uid}>{renderCell(key, column.uid)}</TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Button
        onClick={() => setIsCreateKeyModelOpen(true)}
        isDisabled={createNewApiKeyLoading}
        isLoading={createNewApiKeyLoading}
        variant="light"
        startContent={<Icon icon="mdi:plus" />}>
        {t("Create New API Key")}
      </Button>
      <Modal isOpen={isCreateKeyModelOpen} onClose={() => setIsCreateKeyModelOpen(false)}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                <h2 className="text-xl font-bold">{t("Create New API Key")}</h2>
                <p className="text-sm text-gray-500">
                  {t("Enter a name for your new API key")}
                </p>
              </ModalHeader>
              <ModalBody>
                <Input
                  label={t("Key Name")}
                  placeholder={t("Enter key name")}
                  value={keyName}
                  onChange={(e) => setKeyName(e.target.value)}
                  variant="bordered"
                  labelPlacement="outside"
                  startContent={
                    <Icon
                      icon="mdi:key-outline"
                      className="pointer-events-none flex-shrink-0 text-default-400"
                    />
                  }
                />
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  {t("Cancel")}
                </Button>
                <Button
                  color="primary"
                  onPress={() => {
                    handleCreateNewApiKey();
                  }}>
                  {t("Create Key")}
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
      <Modal isOpen={isDeleteKeyModelOpen} onClose={() => setIsDeleteKeyModelOpen(false)}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                <h2 className="text-xl font-bold">{t("Delete API Key")}</h2>
                <p className="text-sm text-gray-500">
                  {t("Are you sure you want to delete this API key?")}
                </p>
              </ModalHeader>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  {t("Cancel")}
                </Button>
                <Button
                  color="primary"
                  onPress={() => {
                    if (deleteKeyId) {
                      handleDeleteApiKey(deleteKeyId);
                    }
                  }}>
                  {t("Delete Key")}
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}

export default KeyManagement;
