import { Router } from '@angular/router';
import { LAYOUT_MENU_LEFT, LAYOUT_MENU_RIGHT } from './../layout.menu';
import { ZqCommonUtils } from './../../shared/utils/common.util';
import { MenuItem } from './../../shared/model/Menu.model';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.less']
})
export class HeaderComponent implements OnInit {
  @Input() menuLeft: MenuItem[] = []
  @Input() menuRight: MenuItem[] = []
  @Output('onMenuChange') menuChange: EventEmitter<MenuItem> = new EventEmitter()
  constructor(private router: Router) {

  }

  ngOnInit(): void {
    this.initMenus()
  }

  initMenus() {
  }
  
  activeChange(item: MenuItem) {
    this.menuChange.emit(item)
  }

  childClick(item: MenuItem, parent: MenuItem) {
    this.initMenus()
  }
}
