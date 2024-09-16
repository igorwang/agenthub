"use server";

import { auth } from "@/auth";
import {
  DeleteUserRolesDocument,
  DeleteUserRolesMutationVariables,
  InsertUserRolesDocument,
  InsertUserRolesMutation,
  InsertUserRolesMutationVariables,
  Role_Enum,
} from "@/graphql/generated/types";
import { performMutation } from "@/lib/apolloRequest";

export async function updateUserRoles(formData: FormData) {
  const session = await auth();
  const user_id = formData.get("user_id") as string;
  const roles = JSON.parse(formData.get("roles") as string) as string[];

  //   delete all roles
  const deleteVariables: DeleteUserRolesMutationVariables = {
    where: { user_id: { _eq: user_id } },
  };

  await performMutation(DeleteUserRolesDocument, {
    where: {
      user_id: { _eq: user_id },
    },
  });

  //   insert new roles
  const insertVariables: InsertUserRolesMutationVariables = {
    objects: roles.map((role) => ({
      user_id: user_id,
      role: role as Role_Enum,
    })),
  };
  const result: InsertUserRolesMutation = await performMutation(
    InsertUserRolesDocument,
    insertVariables,
  );
  return { success: true };
}
