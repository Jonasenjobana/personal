import { copyDeep } from './../shared/utils/common.util';
import { filter, Subject, takeUntil } from 'rxjs';
import { DemoList } from './../layout/layout.menu';
import { MenuItem } from './../shared/model/Menu.model';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { Component, Inject, OnDestroy, OnInit } from '@angular/core';

@Component({
  selector: 'app-docs',
  templateUrl: './docs.component.html',
  styleUrls: ['./docs.component.less'],
})
export class DocsComponent implements OnInit, OnDestroy {
  demoList: MenuItem[] = [];
  destroy$: Subject<void> = new Subject();
  constructor(private router: Router, private activatedRoute: ActivatedRoute, @Inject('CONST_VALUE') private cost: string) {
    this.demoList = copyDeep(DemoList);
    this.router.events
      .pipe(
        filter((event: any) => event instanceof NavigationEnd),
        takeUntil(this.destroy$)
      )
      .subscribe((event) => {
        const { url } = event;
        const active = this.demoList.find((demo) => demo.link === url);
        this.activeItem(active);
      });
  }

  ngOnInit(): void {}
  activeItem(item: MenuItem | undefined) {
    if (!item) return;
    this.demoList.forEach((el) => (el.isActivated = false));
    item.isActivated = true;
    this.router.navigateByUrl(item.link!);
  }
  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
