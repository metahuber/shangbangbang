import type { Access, FieldAccess } from "payload";

/**
 * 权限控制
 *
 * 三种角色：
 *   super-admin   —— 你（商帮帮）。能看所有客户站点、能建新站点
 *   tenant-admin  —— 客户老板。只能看自己站点
 *   editor        —— 客户员工。只能改内容，不能改设置和账号
 *
 * 租户级的数据隔离由 multi-tenant 插件自动加 tenant 过滤，
 * 这里只处理「谁能进后台」「谁能建站点」这类粗粒度权限。
 */

type UserWithRoles = {
  roles?: string[] | null;
  tenants?: unknown[] | null;
};

export const isSuperAdmin: Access = ({ req: { user } }) =>
  Boolean((user as UserWithRoles | null)?.roles?.includes("super-admin"));

export const isSuperAdminField: FieldAccess = ({ req: { user } }) =>
  Boolean((user as UserWithRoles | null)?.roles?.includes("super-admin"));

/** 任何登录用户 */
export const authenticated: Access = ({ req: { user } }) => Boolean(user);

/** 公开读取 —— 前台需要读产品、分类、认证 */
export const anyone: Access = () => true;

/** 只有超管能改站点设置 */
export const superAdminOnly: Access = isSuperAdmin;
