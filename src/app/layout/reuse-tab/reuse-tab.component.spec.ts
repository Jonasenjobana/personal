import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReuseTabComponent } from './reuse-tab.component';

describe('ReuseTabComponent', () => {
  let component: ReuseTabComponent;
  let fixture: ComponentFixture<ReuseTabComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReuseTabComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReuseTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
