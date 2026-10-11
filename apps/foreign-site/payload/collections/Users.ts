import type { CollectionConfig } from "payload";
import { isSuperAdmin } from "../access";

/**
 * 后台账号
 *
 * 商帮帮自己用超管账号；
 * 每个客户开一个 tenant-admin 账号，只能看到自己的站点。
 */
export const Users: CollectionConfig = {
  slug: "users",
  labels: { singular: "后台账号", plural: "后台账号" },
  auth: true,
  admin: {
    useAsTitle: "email",
    defaultColumns: ["name", "email", "roles"],
    group: "系统",
  },
  fields: [
    {
      name: "name",
      type: "text",
      label: "姓名",
    },
    {
      name: "roles",
      type: "select",
      label: "角色",
      hasMany: true,
      required: true,
      defaultValue: ["tenant-admin"],
      options: [
        { label: "超级管理员（商帮帮）", value: "super-admin" },
        { label: "客户管理员（老板）", value: "tenant-admin" },
        { label: "客户编辑（员工）", value: "editor" },
      ],
      admin: {
        description:
          "超级管理员能看所有站点；客户账号只能看自己被分配的站点。",
      },
      access: {
        // 只有超管能给别人改角色
        update: ({ req: { user } }) =>
          Boolean(
            (user as { roles?: string[] } | null)?.roles?.includes(
              "super-admin",
            ),
          ),
      },
    },
    // 注意：multi-tenant 插件会自动往这里加一个 tenants 数组字段
    // （用户能访问哪些站点）
  ],
  access: {
    // 只有超管能新建账号；自己可以读自己
    create: isSuperAdmin,
    delete: isSuperAdmin,
    read: ({ req: { user } }) => {
      if (!user) return false;
      if (
        (user as { roles?: string[] }).roles?.includes("super-admin")
      ) {
        return true;
      }
      return { id: { equals: user.id } };
    },
    update: ({ req: { user } }) => {
      if (!user) return false;
      if (
        (user as { roles?: string[] }).roles?.includes("super-admin")
      ) {
        return true;
      }
      return { id: { equals: user.id } };
    },
  },
};
