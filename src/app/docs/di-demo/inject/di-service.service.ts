import { Inject, Injectable, Optional, ElementRef } from '@angular/core';
import { ANIMALTOKEN } from '../di-demo.component';
@Injectable()
export class DiServiceService {
  animal = '🐕'
  constructor(@Optional() @Inject(ANIMALTOKEN) injectAnimal: string, @Optional() elementRef: ElementRef) {
    if (injectAnimal) {
      this.animal = injectAnimal
      console.log('animal');
    }
    console.log('init service', elementRef);
  }

}
