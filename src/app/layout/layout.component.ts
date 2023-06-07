import { LayoutService } from './layout.service';
import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router, ActivatedRoute } from '@angular/router';
import { filter, map } from 'rxjs';
import { MenuItem } from '../shared/model/Menu.model';
import { LAYOUT_MENU_LEFT, LAYOUT_MENU_RIGHT } from './layout.menu';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.less'],
  providers: [
    LayoutService
  ]
})
export class LayoutComponent implements OnInit {
  menuLeft: MenuItem[] = LAYOUT_MENU_LEFT
  menuRight: MenuItem[] = LAYOUT_MENU_RIGHT
  constructor(private Slayout: LayoutService, private router: Router, private activeRouter: ActivatedRoute) { 
    router.events.pipe(filter((event: any) => event instanceof NavigationEnd)).subscribe(event => {
      const { url } = event as NavigationEnd
      const item = this.menuLeft.find(el => url.includes(el.link!)) || this.menuRight.find(el => url.includes(el.link!))
      
      this.menuChange(item)
    })
  }

  ngOnInit(): void {
  }
  menuChange(item: MenuItem | undefined) {
    if (!item) return
    this.menuLeft.forEach(el => el.isActivated = false)
    this.menuRight.forEach(el => el.isActivated = false)
    item.isActivated = true
    this.router.navigateByUrl(item.link!)
  }
}
