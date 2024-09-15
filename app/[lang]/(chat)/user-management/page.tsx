import { auth } from "@/auth";
import { Unauthorized } from "@/components/ui/unauthorized";
import UserManagementList from "@/components/UserManagementList";
import { updateUserRoles } from "@/lib/actions/userActions";

export default async function UserManagement() {
  const session = await auth();
  const userRoles = session?.user?.roles;
  const isAdmin = userRoles?.includes("admin");
  if (!isAdmin) {
    return <Unauthorized />;
  }

  return (
    <div className="flex h-full w-full flex-col gap-4">
      <div className="flex items-center gap-2">
        <div className="p-2 text-xl font-bold">User Management</div>
      </div>

      <div className="mx-auto max-w-7xl p-4">
        <UserManagementList action={updateUserRoles} />
      </div>
    </div>
  );
}
