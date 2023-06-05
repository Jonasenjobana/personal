import { LayoutService } from './layout.service';
import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter, map } from 'rxjs';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.less'],
  providers: [
    LayoutService
  ]
})
export class LayoutComponent implements OnInit {

  constructor(private Slayout: LayoutService, private router: Router) { 
    // 记录路由
    // router.events.pipe(filter((event: any) => {
    //   return event instanceof NavigationEnd
    // }),
    //   map(event => {

    //   })
    // )
    Slayout.menuSub$.subscribe((item) => {
      item.isActivated = true
    })
  }

  ngOnInit(): void {
  }

}
