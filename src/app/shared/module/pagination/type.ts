/*
 * @Author: linzequan 839860904@qq.com
 * @Date: 2023-06-12 14:55:38
 * @LastEditors: linzequan 839860904@qq.com
 * @LastEditTime: 2023-06-13 14:42:47
 * @FilePath: \personal\src\app\shared\module\pagination\type.ts
 * @Description: 
 * 
 * Copyright (c) 2023 by ${git_name_email}, All Rights Reserved. 
 */

export class PaginationOption {
    pageRecord: number = 0
    pageCount: number = 0
    currentPage: number = 1
    pageSize: 15 | 20 | 50 = 15
}