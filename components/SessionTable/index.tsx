"use client";

import { Conversation } from "@/components/Conversation";
import SessionTableSkeleton from "@/components/SessionTable/session-table-skeleton";
import {
  GetAllSessionsQuery,
  Order_By,
  useGetAllSessionsQuery,
} from "@/graphql/generated/types";
import { selectSession } from "@/lib/features/chatListSlice";
import { AppDispatch } from "@/lib/store";
import { Icon } from "@iconify/react";
import {
  Button,
  Chip,
  Pagination,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  Tooltip,
  User,
} from "@nextui-org/react";
import { useTranslations } from "next-intl";
import React, { useCallback, useEffect, useState } from "react";
import Drawer from "react-modern-drawer";
import "react-modern-drawer/dist/index.css";
import { useDispatch } from "react-redux";

interface SessionTableProps {
  agentId: string;
}

export default function SessionTable({ agentId }: SessionTableProps) {
  const dispatch: AppDispatch = useDispatch();
  const t = useTranslations();
  const [page, setPage] = useState<number>(1);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [sessionList, setSessionList] = useState<GetAllSessionsQuery["topic_history"]>(
    [],
  );

  const rowsPerPage = 10;

  const { data, loading, error } = useGetAllSessionsQuery({
    variables: {
      where: { agent_id: { _eq: agentId } },
      order_by: { updated_at: Order_By.Desc },
      offset: (page - 1) * rowsPerPage,
      limit: rowsPerPage,
    },
  });

  useEffect(() => {
    console.log("data", data);
    if (data && data.topic_history) {
      setSessionList(data.topic_history);
    }
  }, [data]);

  const handelView = (sessionId: string) => {
    dispatch(selectSession(sessionId));

    setIsOpen(true);
  };

  const handleToggleDrawer = () => {
    dispatch(selectSession(null));
    setIsOpen(false);
  };

  const sessionCount = data?.topic_history_aggregate.aggregate?.count || 0;

  const columns = [
    { name: t("TITLE"), uid: "title" },
    { name: t("UPDATE TIME"), uid: "updateTime" },
    { name: t("USER"), uid: "user" },
    { name: t("MESSAGE COUNT"), uid: "messageCount" },
    { name: t("ACTIONS"), uid: "actions" },
  ];

  const renderCell = useCallback(
    (session: GetAllSessionsQuery["topic_history"][0], columnKey: React.Key) => {
      switch (columnKey) {
        case "title":
          return (
            <div className="flex flex-col">
              <p className="text-bold text-sm capitalize">{session.title}</p>
              <p className="text-bold text-tiny capitalize text-default-400">
                {session.id}
              </p>
            </div>
          );
        case "updateTime":
          return (
            <p className="text-bold text-sm">
              {new Date(session.updated_at).toLocaleString()}
            </p>
          );
        case "user":
          return (
            <User
              avatarProps={{
                radius: "full",
                size: "sm",
                src: session.user?.image || undefined,
              }}
              name={session.user?.name || "Unknown"}
            />
          );
        case "messageCount":
          return (
            <Chip size="sm" variant="flat">
              {session.messages_aggregate.aggregate?.count || 0}
            </Chip>
          );
        case "actions":
          return (
            <div className="flex items-center justify-center gap-2">
              <Tooltip content={t("View Messages")}>
                <Button
                  isIconOnly
                  size="sm"
                  variant="light"
                  onClick={() => handelView(session.id)}>
                  <Icon icon="lets-icons:view" className="text-lg" />
                </Button>
              </Tooltip>
            </div>
          );
        default:
          return null;
      }
    },
    [],
  );

  if (loading) return <SessionTableSkeleton />;
  if (error) return <p>Error: {error.message}</p>;
  return (
    <div>
      <Table
        aria-label="Session table"
        bottomContent={
          <div className="flex w-full justify-center">
            <Pagination
              isCompact
              showControls
              showShadow
              color="secondary"
              page={page}
              total={Math.ceil(sessionCount / rowsPerPage)}
              onChange={(page) => setPage(page)}
            />
          </div>
        }
        classNames={{
          wrapper: "min-h-[200px]",
        }}>
        <TableHeader columns={columns}>
          {(column) => (
            <TableColumn key={column.uid} align="center">
              {column.name}
            </TableColumn>
          )}
        </TableHeader>
        <TableBody items={sessionList} emptyContent={t("No sessions to display")}>
          {(item) => (
            <TableRow key={item.id}>
              {(columnKey) => <TableCell>{renderCell(item, columnKey)}</TableCell>}
            </TableRow>
          )}
        </TableBody>
      </Table>
      <Drawer open={isOpen} direction="right" size={768} onClose={handleToggleDrawer}>
        <Conversation
          agentId={agentId}
          hiddenHeader={true}
          isTestMode={false}
          hiddenInput={true}
        />
      </Drawer>
    </div>
  );
}
