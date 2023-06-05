export interface MenuItem {
  title: string;
  link?: string;
  key?: string;
  isActivated?: boolean;
  isExpanded?: boolean;
  isDisabled?: boolean;
  isHiden?: boolean;
  children?: MenuItem[];
  icon?: string;
  /**权限 */
  auth?: string;
  /**生产环境 */
  production?: boolean;
}
