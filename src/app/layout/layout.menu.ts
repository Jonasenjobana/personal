import { MenuItem } from '../shared/model/Menu.model';

export const LAYOUT_MENU_LEFT: MenuItem[] = [
  {
    title: '首页',
    link: '/home'
  },
  // {
  //   title: '写文章',
  //   auth: '1',
  // },
  // {
  //   title: '归档',
  // },
  // {
  //   title: 'demo玩具',
  // },
];
export const LAYOUT_MENU_RIGHT: MenuItem[] = [
  {
    title: '开发组件',
    link: '/home/docs',
    production: true,
  },
  // {
  //   title: '用户',
  //   key: 'user',
  //   children: [
  //     {
  //       title: '个人设置',
  //     },
  //     {
  //       title: '退出登录',
  //     },
  //   ],
  // },
];

export const DemoList: MenuItem[] = [
  {
    title: 'Button Demo',
    link: '/home/docs/button-demo',
  },
  {
    title: 'Form Demo',
    link: '/home/docs/form-demo'
  },
  // {
  //   title: 'Select Demo',
  //   link: 'select',
  // },
  // {
  //   title: 'Checkbox Demo',
  //   link: 'checkbox',
  // },
  // {
  //   title: 'Radio Demo',
  //   link: 'radio',
  // },
  // {
  //   title: 'Table Demo',
  //   link: 'table',
  // },
  // {
  //   title: 'Pagination Demo',
  //   link: 'pagination',
  // },
];
