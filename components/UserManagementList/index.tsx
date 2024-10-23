"use client";

import {
  GetUserListQuery,
  Role_Enum,
  useGetUserListQuery,
} from "@/graphql/generated/types";
import { Icon } from "@iconify/react";
import {
  Button,
  Pagination,
  Select,
  SelectItem,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  Tooltip,
} from "@nextui-org/react";
import { useTranslations } from "next-intl";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

interface UserManagementListProps {
  action: (formData: FormData) => Promise<{ success: boolean }>;
}
function UserManagementList({ action }: UserManagementListProps) {
  const t = useTranslations();
  const [page, setPage] = useState<number>(1);
  const [userList, setUserList] = useState<GetUserListQuery["users"]>([]);
  const [totalUsers, setTotalUsers] = useState<number>(0);
  const rowsPerPage = 10;

  const { data, loading, error, refetch } = useGetUserListQuery({
    variables: {
      offset: (page - 1) * rowsPerPage,
      limit: rowsPerPage,
    },
  });
  useEffect(() => {
    if (data && data.users) {
      setUserList(data.users);
    }
    if (data && data.users_aggregate) {
      setTotalUsers(data.users_aggregate.aggregate?.count || data.users.length);
    }
  }, [data]);

  const handleSaveUser = useCallback(
    async (user: GetUserListQuery["users"][0]) => {
      const formData = new FormData();
      formData.append("user_id", user.id);
      formData.append("roles", JSON.stringify(user.roles.map((role) => role.role)));

      try {
        const result = await action(formData);
        if (result.success) {
          refetch();
          toast.success(t("User roles saved successfully"));
        } else {
          toast.error(t("Error saving user roles"));
          console.error("Error saving user roles", result);
        }
      } catch (error) {
        toast.error("Error saving user roles");
      }
    },
    [action, refetch, t],
  );

  const renderCell = useCallback(
    (user: GetUserListQuery["users"][0], columnKey: React.Key) => {
      switch (columnKey) {
        case "name":
          return (
            <div className="flex flex-col">
              <p className="text-bold text-sm capitalize">{user.name}</p>
              <p className="text-bold text-tiny capitalize text-default-400">{user.id}</p>
            </div>
          );
        case "email":
          return <p className="text-bold text-sm">{user.email}</p>;
        case "roles":
          return (
            <div className="flex min-w-[260px] flex-wrap gap-1">
              <Select
                aria-label="Select roles"
                variant="flat"
                className={`w-full`}
                selectionMode="multiple"
                disableSelectorIconRotation={true}
                defaultSelectedKeys={user.roles.map((role) => role.role)}
                onChange={(e) => {
                  const roles = e.target.value.split(",");
                  setUserList((prev) => {
                    const newUserList = prev.map((user) => {
                      if (user.id === user.id) {
                        return {
                          ...user,
                          roles: roles.map((role) => ({
                            id: 0,
                            role: role as Role_Enum,
                          })),
                        };
                      }
                      return user;
                    });
                    return newUserList;
                  });
                }}>
                {Object.values(Role_Enum).map((role) => (
                  <SelectItem key={role} value={role}>
                    {role}
                  </SelectItem>
                ))}
              </Select>
            </div>
          );
        case "actions":
          return (
            <Tooltip content="Save">
              <Button
                isIconOnly
                color="secondary"
                variant="light"
                size="sm"
                onClick={() => handleSaveUser(user)}>
                <Icon icon="mdi:check" fontSize={20} />
              </Button>
            </Tooltip>
          );
        default:
          return null;
      }
    },
    [handleSaveUser],
  );

  const columns = [
    { name: t("NAME"), uid: "name" },
    { name: t("EMAIL"), uid: "email" },
    { name: t("ROLES"), uid: "roles" },
    { name: t("ACTIONS"), uid: "actions" },
  ];

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className="flex flex-col gap-4">
      <Table
        aria-label="User management table"
        bottomContent={
          <div className="flex w-full justify-center">
            <Pagination
              isCompact
              showControls
              showShadow
              color="secondary"
              page={page}
              total={Math.ceil(totalUsers / rowsPerPage)}
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
        <TableBody items={userList} emptyContent={t("No users to display")}>
          {(item) => (
            <TableRow key={item.id}>
              {(columnKey) => <TableCell>{renderCell(item, columnKey)}</TableCell>}
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}

export default UserManagementList;
