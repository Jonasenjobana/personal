import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-docs',
  templateUrl: './docs.component.html',
  styleUrls: ['./docs.component.less']
})
export class DocsComponent implements OnInit {
  demoList: DemoItem[] = [
    {
      title: 'Button Demo',
      path: 'button'
    },
    {
      title: 'Select Demo',
      path: 'select'
    },
    {
      title: 'Checkbox Demo',
      path: 'checkbox'
    },
    {
      title: 'Radio Demo',
      path: 'radio'
    },
    {
      title: 'Table Demo',
      path: 'table'
    },
    {
      title: 'Pagination Demo',
      path: 'pagination'
    },
  ]
  constructor() { }

  ngOnInit(): void {
  }
  activeItem(item: DemoItem) {
    this.demoList.forEach(el => el.isActivated = false)
    item.isActivated = true
  }
}
interface DemoItem {
  title: string
  path: string
  isActivated?: boolean
}