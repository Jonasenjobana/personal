
export class GanteOption {
    showPrecentage: number = 1; // 默认场景显示 1 为显示完整的甘特 0.3 为显示完整甘特图的百分之30
    scale: number = 1; // 缩放比例 0-4 仅改变长度
    scrollOffsetX: number = 0;
    barWidth: number = 100; 
    barHeight: number = 40;
    lineRowTotal: number = 5;
    rowHeight: number  = 36;
    colorGroup: string[] = ['#873bf4'];
    colData: string[] = ['一月','二月','三月','四月','五月','六月','七月','八月','九月','十月','十一月','十二月'];
}
export interface GanteData {
    stageRange: string[];
    color: string;
    stageName: string;
    offsetStage: number;
    colIndex: number;
    type?: string;
}