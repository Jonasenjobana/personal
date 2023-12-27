import { Component, OnInit, Injector, Host, SkipSelf, Self, Optional } from '@angular/core';
import { DiServiceService } from '../../inject/di-service.service';

@Component({
  selector: 'di-component',
  template: `<p>di-component</p>
    <di-component-child></di-component-child> `
})
export class DiComponentComponent implements OnInit {
  constructor( @Self()public injector: Injector, @Self()@Optional()  private diService_: DiServiceService) {}

  ngOnInit(): void {
    // this.injector.get(DiServiceService, '===').animal = '🐺'
    console.log(this.injector.get(DiServiceService),' ======component=========', this.diService_);
  }
}
