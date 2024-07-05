import { Component, ComponentRef, Input, Optional } from '@angular/core';
import { uniqueId } from 'lodash';

@Component({
  selector: 'dynamic-component',
  templateUrl: './dynamic-component.component.html',
  styleUrls: ['./dynamic-component.component.less']
})
export class DynamicComponent {
  @Input() config: DynamicComponentConfig
  constructor(@Optional() public dyLayer: DynamicComponent) {
    
  }
}
export interface DynamicComponentConfig<T = any> {
  title?: string;
  component: ComponentRef<T>;
  inputData?: any;
  position?: Partial<DynamicPosition>;
  height: number;
  width: number;
  animeTime?: number
  positionStatus?: Map<string, Partial<DynamicPosition>> // 'A' => 'B' Map['A'] => Map['B']
}
export interface DynamicPosition {
  left: number, top: number, right: number, bottom: number, width: number, height: number, animeTime?: number
}