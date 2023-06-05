import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ZqButtonComponent } from './zq-button.component';

describe('ZqButtonComponent', () => {
  let component: ZqButtonComponent;
  let fixture: ComponentFixture<ZqButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ZqButtonComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ZqButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
