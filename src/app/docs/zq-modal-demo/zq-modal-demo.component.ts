import { ZqModalService } from './../../shared/module/modal/zq-modal.service';
import { Component, OnInit } from '@angular/core';
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
  createModal() {
    this.modalService.open({
      zqContent: ZqSelectDemoComponent
    })
  }
}
