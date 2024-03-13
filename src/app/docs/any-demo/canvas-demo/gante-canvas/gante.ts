
export class GanteStageData {
    stages: string[] = ['1-1', '1-2', '1-3'];
    stageLength: number = 200;
    ganteHeight: number = 50;
    scrollDistance: number = 0;
    scale: number = 1;
    ganteDatas: GanteData[] = [];
    width: number
    height: number
}
export interface GanteData {
    stageRange: string[];
    color: string;
    stageName: string;
    offsetStage: number;
    colIndex: number;
    type?: string;
}