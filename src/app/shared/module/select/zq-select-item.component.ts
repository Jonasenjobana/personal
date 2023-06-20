import { Component, Input, OnInit, SimpleChanges } from '@angular/core';

@Component({
  selector: 'zq-select-item',
  template: `
    <div class="select-item" [class.item-checked]="isChecked">
      {{label}}
    </div>
    <span zqIcon="check" *ngIf="isChecked"></span>
  `,
  host: {
    class: 'zq-select-item'
  }
})
export class ZqSelectItemComponent implements OnInit {
  @Input() label: any
  @Input() listOfSelected!: any[]
  @Input() value: any
  isChecked: boolean = false
  constructor() { }
  ngOnChanges(changes: SimpleChanges) {
    const { value, listOfSelected } = changes
    if (value || listOfSelected) {
      this.isChecked = this.listOfSelected.findIndex(el => el.value === this.value) >= 0
      // console.log(this.isChecked, this.listOfSelected, this.value);
    }
  }
  ngOnInit(): void {
    // console.log(this.listOfSelected,'listOfSelected');
  }

}
