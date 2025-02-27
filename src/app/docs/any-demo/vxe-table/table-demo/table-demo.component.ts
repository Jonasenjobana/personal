import { Component, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { CodeNetData, Organize, WareHouses } from './net';
import { VxeData, VxeGridColumn, VxeGridConfig } from '../vxe-model';
import html2Canvas from "html2canvas";
@Component({
  selector: 'table-demo',
  templateUrl: './table-demo.component.html',
  styleUrls: ['./table-demo.component.less']
})
export class TableDemoComponent {
  @ViewChild('rowtemp') rowtemp: any
  hidden: boolean = true
  constructor() {

  }
  data: any[] = [
    { id: '123', name: '张三', 'age': 18, 'address': '北京市朝阳区', 'sex': '男', num: '1', date: '2024-02-21', role:'管理' },
    { id: '4544', name: '里斯', 'age': 22, 'address': '北京市朝阳区' }, 
  ]
  data2: any[] = [
    { id: 10000, parentId: null, name: 'Test1', type: 'mp3', size: 1024, date: '2020-08-01' },
    { id: 10050, parentId: null, name: 'Test2', type: 'mp4', size: 0, date: '2021-04-01' },
    { id: 24300, parentId: 10050, name: 'Test3', type: 'avi', size: 1024, date: '2020-03-01' },
    { id: 20045, parentId: 24300, name: 'Test4', type: 'html', size: 600, date: '2021-04-01' },
    { id: 10053, parentId: 24300, name: 'Test5', type: 'avi', size: 0, date: '2021-04-01' },
    { id: 24330, parentId: 10053, name: 'Test6', type: 'txt', size: 25, date: '2021-10-01' },
    { id: 21011, parentId: 10053, name: 'Test7', type: 'pdf', size: 512, date: '2020-01-01' },
    { id: 22200, parentId: 10053, name: 'Test8', type: 'js', size: 1024, date: '2021-06-01' },
    { id: 23666, parentId: null, name: 'Test9', type: 'xlsx', size: 2048, date: '2020-11-01' },
    { id: 23677, parentId: 23666, name: 'Test10', type: 'js', size: 1024, date: '2021-06-01' },
    { id: 23671, parentId: 23677, name: 'Test11', type: 'js', size: 1024, date: '2021-06-01' },
    { id: 23672, parentId: 23677, name: 'Test12', type: 'js', size: 1024, date: '2021-06-01' },
    { id: 23688, parentId: 23666, name: 'Test13', type: 'js', size: 1024, date: '2021-06-01' },
    { id: 23681, parentId: 23688, name: 'Test14', type: 'js', size: 1024, date: '2021-06-01' },
    { id: 23682, parentId: 23688, name: 'Test15', type: 'js', size: 1024, date: '2021-06-01' },
    { id: 24555, parentId: null, name: 'Test16', type: 'avi', size: 224, date: '2020-10-01' },
    { id: 24566, parentId: 24555, name: 'Test17', type: 'js', size: 1024, date: '2021-06-01' },
    { id: 24577, parentId: 24555, name: 'Test18', type: 'js', size: 1024, date: '2021-06-01' }
  ]
  data3: any[] = [];
  data4 = []
  shows: boolean[] = [true, true, true, true, true, true, true,];
  gridConfig: VxeGridConfig = {
    columns: [
      { type: 'seq' },
      { title: '测试', field: 'aidsName' },
      { title: 'test', children: [
        { title: '测试', field: 'aidsName', width: 300, slot: {
          rowName: 'asd'
        } },
      ]}
    ],
    data: [{
      aidsName: 'sss'
    }]
  }
  data5: any = []
  data6: any = Organize
  expandCb = (row: VxeData) => {
    return true
  }
  expandCb2 = (row) => {
    return true
  }
  ngAfterViewInit() {
    setTimeout(() => {
      this.hidden = false
    }, 6000);
    setTimeout(() => {
      new Array(600).fill(1).forEach(() => {
        this.data.push({ id: '123', name: '张三', 'age': 18, 'address': '北京市朝阳区', 'sex': '男', num: '1', date: '2024-02-21', role:'管理' })
      })
      this.data = [...this.data]

    }, 3000);
    setTimeout(() => {
      this.data3 = [];
      for (let i = 0; i < 600; i++) {
        let data: any = {
          id: i,
          collectionTime: 'detail' + i,
          aidsName: '站点' + (100 - i),
          ifAlarm: ((Math.random() + 0.5) | 0).toString(),
          ifBind: ((Math.random() + 0.5) | 0).toString(),
          ifMark: i % 3 == 0 ? 'success' : i % 3 == 1 ? 'defeated' : 'asdasd',
          commModeCode: '北斗',
          functionCode: ((Math.random() * 3 + 0.5) | 0).toString(),
        };
        if (i % 10 == 0) {
          let c: any[] = [];
          for (let j = 0; j < 3; j++) {
            c.push({
              id: j,
              collectionTime: 'children' + j,
              aidsName: 100 - i + '站点children' + j,
              ifAlarm: ((Math.random() + 0.5) | 0).toString(),
              ifBind: ((Math.random() + 0.5) | 0).toString(),
              ifMark: j % 3 == 0 ? 'success' : j % 3 == 1 ? 'defeated' : 'asdasd',
              commModeCode: '北斗',
              functionCode: ((Math.random() * 3 + 0.5) | 0).toString(),
            });
          }
          data.children = c;
          data._showChild = true;
        }
        this.data3.push(data);
      }
    }, 2000);
    setTimeout(() => {
      this.handleCode(CodeNetData);
      this.data4 = CodeNetData;
      console.log(this.data4,'===')
    }, 2000);
    this.gridConfig = {
      columns: [
        { type: 'seq', width: 50 },
        { title: '测试', field: 'aidsName', slot: {
          rowName: 'asd'
        }  },
      ],
      data: [{
        aidsName: 'sss'
      }]
    }
    this.handledata5([WareHouses])
    setTimeout(() => {
    this.data5 = [WareHouses]
      console.log(this.data5)
    });
  }
  handledata5(arr) {
    arr.forEach(el => {
      this.handledata5(el.children);
      el.children.unshift(...el.warehouseList);
    })
  }
  handleCode(data: any[]) {
    data.forEach(el => {
      if (el.menuType == '3') {
        el._operate = el.children.map(child => {
          child._parent = el;
          return child
        });
        el.children = [];
      } else {
        this.handleCode(el.children)
      }
    })
  }
  checkChange($event) {
    console.log($event)
  }
  onCheckChange($event) {
    console.log('外部',$event)
  }
  onButtonClick(row, col) {
    console.log(row, col);
    row.age = 100;
    console.log(this.data)
  }
  onSubmit(form: NgForm) {
    console.log(form)
  }
  checkOperateCode(item,col) {
    if (!item) return;
    const {_parent} = item
    if (item.ifCheck && _parent) _parent.ifCheck = true;
    this.checkOperateCode(_parent, col)
  }
  checkParentCode(item, ifCheck: boolean) {
    if (ifCheck) return;
    const {children, _operate} = item;
    const iteral = children && children.length > 0 ? children : _operate;
    iteral?.forEach(child => {
      child.ifCheck = ifCheck;
      this.checkParentCode(child, ifCheck)
    })
  }
  clickSetting() {

  }
  inGrid: CustomVxeGridConfig = {
    columns: [
      { type: 'seq', width: 50 },
      { title: '测试', field: 'aidsName', customType: 'dot', slot: {rowName: 'dot'}},
      { title: '测试1', field: 'aidsName1', customType: 'link', slot: {rowName: 'link'}},
      { title: '测试2', field: 'aidsName2', customType: 'battery', slot: {rowName: 'battery'}},
      { title: '测试3', field: 'aidsName3', customType: 'crud', slot: {rowName: 'crud'}},
      { title: '测试4', field: 'aidsName4', customType: 'code-btn', slot: {rowName: 'code-btn'}},
    ],
    data: [{
      aidsName: 'sss',
      aidsName1: '1',
      aidsName2: 'ss2s',
      aidsName3: '3',
      aidsName4: '4'
    },{
      aidsName: 'wwwwsss',
      aidsName1: 'wwww',
      aidsName2: 'wwwss2s',
      aidsName3: 'www3',
      aidsName4: 'www4'
    }]
  }
  async getScreenShot() {
    await html2Canvas(document.querySelector('#table')).then((canvas) => {
      var imgData = canvas.toDataURL('image/png').replace('image/png', 'image/octet-stream');
      const a = document.createElement('a');
      a.href = imgData;
      a.download = `123.png`;
      const event = new MouseEvent('click', {
        bubbles: true,
        cancelable: false,
        view: window,
        detail: 0,
        screenX: 0,
        screenY: 0,
        clientX: 0,
        clientY: 0,
        ctrlKey: false,
        altKey: false,
        shiftKey: false,
        metaKey: false,
        button: 0,
        relatedTarget: null,
      });
      a.dispatchEvent(event);
    });
  }
}
interface CustomVxeGridConfig extends VxeGridConfig {
  columns: Partial<CustomVxeGridColumn>[]
}
interface CustomVxeGridColumn extends VxeGridColumn {
  // 定义自定义模板
  customType: 'dot' | 'crud' | 'link' | 'battery' | 'code-btn'
  children: Partial<CustomVxeGridColumn>[]
}