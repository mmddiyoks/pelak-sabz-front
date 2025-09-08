import { UserStore } from "@/models/User";

export function hasPermission(
  user: UserStore,
  permissionName: string
): boolean {
  return (
    user?.permissions?.some(
      (item: { name: string }) => item.name === permissionName
    ) ?? false
  );
}

export function hasLogin(user: UserStore): boolean {
  return Boolean(user?.roles?.length && user.roles.length >= 1);
}
