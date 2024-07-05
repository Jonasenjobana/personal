import { Directive, Optional, ViewChild } from "@angular/core"
import { BigScreenComponent } from "./big-screen.component"

export interface BigScreenConfig {
    id: string
    name: string
    component: any
    top: number
    left: number
    width: number
    height: number
    zIndex: number
    foldAnime: 'ltr' | 'rtl' | 'btt' | 'ttb'
    ifFold: boolean
    ifBorder: boolean
    ifFixed: boolean
    ifHidden: boolean
    draggable: boolean
}
/**不同状态表示不同位置 */
export interface PositionStatus {
    posStatus: string, // 自定义状态
    position: {
        top?: number
        left?: number
        bottom?: number
        right?: number
    }
    animeTime?: number // 到当前状态的动画时间
}
@Directive()
export abstract class ScreenContent {
    /**获取外部的组件 */
    constructor(@Optional() protected screen?: BigScreenComponent) {

    }
}