import { ZqModalRef } from './../../shared/module/modal/modal-ref';
import { ZqFlexibleModalConfig, ZqGlobalModalConfig, ZqModalConfig, ZqBaseModalConfig } from './../../shared/module/modal/type';
import { ZqModalService } from './../../shared/module/modal/zq-modal.service';
import { Component, OnInit, TemplateRef } from '@angular/core';
import { ZqSelectDemoComponent } from '../zq-select-demo/zq-select-demo.component';

@Component({
  selector: 'zq-modal-demo',
  templateUrl: './zq-modal-demo.component.html',
  styleUrls: ['./zq-modal-demo.component.less'],
})
export class ZqModalDemoComponent implements OnInit {

  constructor(private modalService: ZqModalService) { }

  ngOnInit(): void {
    
  }
  zqComponentParams: any = {
    params: {
      options: []
    },
    title: 'fuck'
  }
  createModal(type: 'global' | string, $event?: MouseEvent) {
    let config: ZqModalConfig<any> = {}
    let ele: Element
    if (type === 'global') {
      config.offsetY = 100
      config.overlayStrategy = 'global'
    } else if (type === 'event-el'){
      Object.assign(config, {
        origin: $event,
        originType: 'event-el',
        overlayStrategy: 'flex',
      })
    } else {
      Object.assign(config, {
        origin: $event,
        originType: 'event',
        overlayStrategy: 'flex',
      })
    }
    this.modalService.open({
      ...config,
      zqOkCb: () => {
        console.log('....',this.zqComponentParams);
      },
      zqAfterClose: (componentInstance) => {
      },
      zqComponentParams: this.zqComponentParams,
      zqContent: ZqSelectDemoComponent,
      textClose: '关闭',
      textOk: '确定',
    })
  }
  createModalTemplate(type: 'global' | string, $event: MouseEvent, tmp: TemplateRef<any>) {
    let config: ZqModalConfig<any> = {}
    let ele: Element
    Object.assign(config, {
      origin: $event,
      originType: 'event-el',
      overlayStrategy: 'flex',
    })
    this.modalService.open({
      ...config,
      zqOkCb: () => {
        console.log('....',this.zqComponentParams);
      },
      zqAfterClose: (componentInstance) => {
      },
      zqComponentParams: {
        title: 'test 1'
      },
      zqContent: tmp,
      textClose: '关闭',
      textOk: '确定',
    })
  }
  clickMe(item: ZqModalRef, item2: any) {
    console.log(item,item2);
    item.onCloseModal()
  }
}
