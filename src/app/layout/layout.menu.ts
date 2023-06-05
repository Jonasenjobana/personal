import { MenuItem } from "../shared/model/Menu.model";

export const LAYOUT_MENU_LEFT: MenuItem[] = [
    {
        title: '首页',
        link: '/home',
    },
    {
        title: '写文章',
        auth: '1'
    },
    {
        title: '归档',
    },
    {
        title: '作品集',
    }
]
export const LAYOUT_MENU_RIGHT: MenuItem[] = [
    {
        title: '开发组件',
        link: '/home/docs',
        production: true
    },
    {
        title: '用户',
        key: 'user',
        children: [
            {
                title: '个人设置',
            },
            {
                title: '退出登录',
            },
        ]
    }
]