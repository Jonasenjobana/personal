import { DiServiceService } from './inject/di-service.service';
import { Component, OnInit, Injector, InjectionToken, ElementRef, Self, ViewChild } from '@angular/core';
import { DiComponentComponent } from './components/di-component/di-component.component';
export const ANIMALTOKEN = new InjectionToken<string>('This is Aniaml Token Description');
export const DiFactory = (elementRef: ElementRef) => {
  const InjectorAnimal = Injector.create({
    providers: [
      {
        provide: ANIMALTOKEN,
        useValue: '🐱'
      }
    ]
  });
  return new DiServiceService(InjectorAnimal.get(ANIMALTOKEN), elementRef);
};
@Component({
  selector: 'di-demo',
  template: `
    <p>{{ animal }}</p>
    <di-component #diComponent></di-component>
    <div style="overflow: auto; height: 400px; width: 400px; border: 1px solid #000" #scrollEl>
      <div style="height: 10000px; width: 300px; background: pink">
      </div>
    </div>
  `,
  providers: [
    // DiServiceService
    {
      provide: DiServiceService,
      useFactory: DiFactory,
      deps: [ElementRef]
    }
  ]
})
export class DiDemoComponent implements OnInit {
  animal: string = '';
  constructor(@Self() private diService_: DiServiceService, private injector: Injector) {
    console.log(this.injector.get(ElementRef),this,'==========');
    
    this.animal = this.diService_.animal;
  }
  @ViewChild('scrollEl', {static: true}) scrollEl!: ElementRef<HTMLDivElement>
  @ViewChild('diComponent', { static: false}) diComponent!: DiComponentComponent
  ngOnInit(): void {
    const el = this.scrollEl.nativeElement
    console.log(el,'===========dame');
    
    el.addEventListener('scroll', (e) => {
      e.preventDefault()
      console.log('=============scroll=============')
    })
    setTimeout(() => {
      console.log(this.diService_.animal,'===')
    }, 10000);
  }
  ngAfterViewInit() {
    console.log(this.diComponent.injector.get(ANIMALTOKEN),'this.diComponent.injector');
    
  }
}