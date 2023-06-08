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
                <span *ngFor="let item of selectedItem">
                    {{ item.title }}
                </span>
                <div class="select-clear" (click)="clearSelect($event)">
                    X
                </div>
            </div>
        </div>
        <ng-template
            cdkConnectedOverlay
            [cdkConnectedOverlayOrigin]="triggerOrigin"
            [cdkConnectedOverlayOpen]="isOpen"
            [cdkConnectedOverlayWidth]="trigerWidth"
            [cdkConnectedOverlayFlexibleDimensions]="true"
            (positionChange)="onPositionChange($event)"
        >
            <ng-container [ngSwitch]="selectType">
                <ng-container *ngSwitchDefault>
                    <zq-select-panel [inOptions]="zqOptions" (selectChange)="onSelectChange($event)"></zq-select-panel>
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
    @Input() selectType: ZqSelectType = null
    @Input() zqOptions: ZqSelectOption[] = []
    @Output() selectChange: EventEmitter<ZqSelectOption[]> = new EventEmitter()
    @ViewChild('triggerOrigin', { static: true, read: ElementRef })
    triggerOrigin!: ElementRef<HTMLDivElement>
    selectedItem: ZqSelectOption[] = []
    constructor() {}

    ngOnInit(): void {
        this.triggerElement = this.triggerOrigin.nativeElement
        this.updateTrigerSize()
    }
    ngOnChanges(changes: SimpleChanges) {}
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
        this.isOpen = false
        this.selectChange.emit(item)
    }
    clearSelect($event: Event) {
        $event.stopPropagation()
        this.selectedItem = []
        this.selectChange.emit([])
    }
}
