import { Component, Input, QueryList, SimpleChanges, ViewChildren } from '@angular/core';
import { FormControl } from '@angular/forms';
import {
  Subscription,
} from 'rxjs';
@Component({
  selector: 'input-range-tmp',
  templateUrl: './input-range-tmp.component.html',
  styleUrls: ['./input-range-tmp.component.less']
})
export class InputRangeTmpComponent {
  @Input() inType: string = '~';
  @Input() inModel: any;
  @Input() inKeys: RangeKey = { value1: 'value1', value2: 'value2', type: '~' };
  @Input() inRange: [number, number] = [0, 100]
  @Input() inputType: 'number' | 'text' = 'number';
  @ViewChildren('ngModel') set ngModelGroup(value: QueryList<FormControl>) {
    let modelValids = new Array(value.length).fill(true);
    this.modelGroup = value.map((ngModel, index) => {
      this.sub$.add(
        ngModel.statusChanges?.subscribe(status => {
          modelValids[index] = status == 'VALID';
          this.rangeValid = modelValids.some(el => el);
        })
      );
      return ngModel;
    });
  }
  modelGroup: FormControl[] = [];
  model: any = {
    value1: '',
    value2: '',
    type: ''
  };
  sub$: Subscription = new Subscription();
  rangeValid: boolean = true;
  constructor() {}
  ngOnChanges(changes: SimpleChanges) {
    const { inModel, inKeys, inRange } = changes;
    if (inModel || inKeys) {
      this.initModel();
    }
  }
  initModel() {
    if (this.inModel && this.inKeys) {
      Object.keys(this.inKeys).forEach(key => {
        this.model[key] = this.inModel[this.inKeys[key as keyof RangeKey]];
      });
    }
  }
  ngAfterViewInit() {
    console.log(this.ngModelGroup?.toArray()[0]);
  }
  ngOnDestroy() {
    this.sub$.unsubscribe();
  }
}
type RangeKey = { value1: string; value2: string; type: string };
