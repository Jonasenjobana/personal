import { copyDeep } from 'src/app/shared/utils/common.util';
import { ZqSelectOption } from './../../types/types'
import { ConnectedOverlayPositionChange } from '@angular/cdk/overlay'
import { Component, OnInit, ViewChild, ElementRef, Input, SimpleChanges, Output, EventEmitter } from '@angular/core'
import { ZqSelectType } from '../../types/types'
@Component({
    selector: 'zq-select',
    template: `
        <div
            class="zq-select-wraper"
            [ngClass]="{ 'zq-select-active': isOpen }"
            cdkOverlayOrigin
            #triggerOrigin="cdkOverlayOrigin"
            (click)="openSelect()"
        >
            <div class="zq-select-input">
            <input zq-input type="text" [ngModel]="searchValue" (ngModelChange)="onSearchValueChange($event)" (blur)="onSearchInputBlur()">
                <!-- <span *ngFor="let item of selectedItem" [title]="item.label">
                    {{ item.label }}
                </span>
                <span *ngIf="!selectedItem.length" style="color: #00000087;">{{zqPlacement}}</span>
                <div class="select-clear" (click)="clearSelect($event)">
                    X
                </div> -->
            </div>
        </div>
        <ng-template
            cdkConnectedOverlay
            [cdkConnectedOverlayOrigin]="triggerOrigin"
            [cdkConnectedOverlayOpen]="isOpen"
            [cdkConnectedOverlayWidth]="trigerWidth"
            [cdkConnectedOverlayFlexibleDimensions]="true"
            (overlayOutsideClick)="outSideClick()"
            (positionChange)="onPositionChange($event)"
        >
            <ng-container [ngSwitch]="selectType">
                <ng-container *ngSwitchDefault>
                    <zq-select-panel [inOptions]="inOptionSnap" (selectChange)="onSelectChange($event)"></zq-select-panel>
                </ng-container>
            </ng-container>
        </ng-template>
    `,
    host: {
        class: 'zq-select',
    },
})
export class ZqSelectComponent implements OnInit {
    trigerWidth!: number
    isOpen: boolean = false
    triggerElement!: HTMLDivElement
    searchValue: string = ''
    selectedItem: ZqSelectOption[] = []
    inOptionSnap: ZqSelectOption[] = []
    @Input() zqPlacement: string = '请选择选项'
    @Input() selectType: ZqSelectType = null
    @Input() inView: boolean = false
    @Input() inMulti: boolean = false
    @Input() inSearch: boolean = false
    @Input() zqOptions: ZqSelectOption[] = []
    @Output() selectChange: EventEmitter<ZqSelectOption[]> = new EventEmitter()
    @ViewChild('triggerOrigin', { static: true, read: ElementRef })
    triggerOrigin!: ElementRef<HTMLDivElement>
    constructor() {}
    outSideClick() {
        this.isOpen = false
      }
    ngOnInit(): void {
        this.triggerElement = this.triggerOrigin.nativeElement
        this.updateTrigerSize()
    }
    ngOnChanges(changes: SimpleChanges) {
        const { zqOptions } = changes
        if (zqOptions) {
            this.inOptionSnap = copyDeep(this.zqOptions)
        }
    }
    updateTrigerSize() {
        if (!this.triggerElement) return
        const { width } = this.triggerElement.getBoundingClientRect()
        this.trigerWidth = width
    }
    openSelect() {
        this.updateTrigerSize()
        this.isOpen = !this.isOpen
    }
    onPositionChange($event: ConnectedOverlayPositionChange) {
        console.log('trigerWidth', this.trigerWidth)
    }
    onSelectChange(item: ZqSelectOption[]) {
        this.selectedItem = item
        this.searchValue = item[0].label  
        this.isOpen = false
        this.selectChange.emit(item)
    }
    onClearSelect($event: Event) {
        $event.stopPropagation()
        this.selectedItem = []
        this.selectChange.emit([])
    }
    onSearchValueChange($event: string) {
        console.log($event,'?')
        this.inOptionSnap = this.zqOptions.filter(el => el.label.includes($event) || $event === '')
        this.searchValue = $event
    }
    onSearchInputBlur() {
        if (this.inOptionSnap.findIndex(el => el.label === this.searchValue) === -1) {
            this.searchValue = '' 
        }
    }
}
