import { Router } from '@angular/router';
import { LAYOUT_MENU_LEFT, LAYOUT_MENU_RIGHT } from './../layout.menu';
import { ZqCommonUtils } from './../../shared/utils/common.util';
import { MenuItem } from './../../shared/model/Menu.model';
import { Component, Input, OnInit } from '@angular/core';
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.less']
})
export class HeaderComponent implements OnInit {
  menuLeft: MenuItem[] = []
  menuRight: MenuItem[] = []
  constructor(private router: Router) {

  }

  ngOnInit(): void {
    this.initMenus()
  }

  initMenus() {
    this.menuLeft = LAYOUT_MENU_LEFT
    this.menuRight = LAYOUT_MENU_RIGHT
  }
  
  activeChange(item: MenuItem) {
    this.menuLeft.forEach(el => el.isActivated = false)
    this.menuRight.forEach(el => el.isActivated = false)
    item.isActivated = true
    this.router.navigateByUrl(item.link!)
  }

  childClick(item: MenuItem, parent: MenuItem) {
    this.initMenus()
  }
}
