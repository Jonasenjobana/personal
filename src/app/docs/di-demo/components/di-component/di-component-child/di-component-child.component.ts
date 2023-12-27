import { Component, OnInit, Injector } from '@angular/core';
import { DiServiceService } from '../../../inject/di-service.service';

@Component({
  selector: 'di-component-child',
  template: `
    <p>di-component-child</p>
  `
})
export class DiComponentChildComponent implements OnInit {

  constructor(private injector: Injector) { }

  ngOnInit(): void {
    // console.log(this.injector.get(DiServiceService, 'fuck'));
    
  }

}
