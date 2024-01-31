import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable()
export class BaseTableService<T, S extends BaseSearch> {
  constructor(private http_: HttpClient) {}
  url: string = '';
  currentPage: number = 1;
  search?: S
  ifPage: boolean = true;
  /**选中缓存 */
  cached: T[] = [];
  page: Page<T> = new Page()
  getList() {
    this.http_.post<Page<T> | T[]>(this.url, {
      params: this.search
    }).subscribe(res => {
      if (this.ifPage) {
        this.page = res as Page<T>
      } else {
        this.page = {
          result: res as T[],
          currentPage: this.search?.currentPage || 1,
          pageRecord: this.search?.pageRecord || 15,
          recordCount: (res as T[]).length
        }
      }
    })
  }
  /**上一页 */
  prePage() {}
  /**下一页 */
  nextPage() {}
  /**第i页 */
  toPage(index: number) {}
  /**选中行 */
  selectedRow(index: number) {}
}
export class BaseSearch {
  ifPage: boolean = true
  currentPage: number = 1
  pageRecord: number = 15
}
export class Page<T = any> {
  result: T[] = []
  currentPage: number = 1
  pageRecord: number = 15
  recordCount!: number
}