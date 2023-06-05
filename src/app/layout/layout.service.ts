import { MenuItem } from './../shared/model/Menu.model';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable()
export class LayoutService {
  menuSub$: Subject<MenuItem> = new Subject()
  constructor() { }
  activeMenuChange() {

  }
}
