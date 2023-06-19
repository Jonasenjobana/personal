import { ZqModalService } from './../modal/zq-modal.service';
import { Injectable } from '@angular/core';

@Injectable()
export class ZqMessageService {

  constructor(private modalService: ZqModalService) { }
}
