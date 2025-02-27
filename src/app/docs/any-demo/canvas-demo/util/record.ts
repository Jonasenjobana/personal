
/** canvas 录制工具类 可录制轨迹生成视频 */
export class SLUCanvasRecord {
    ctx: CanvasRenderingContext2D;
    option: SLUCanvasRecordOption;
    stream: MediaStream;
    recorder: MediaRecorder;
    frames: Blob[] = [];
    constructor(option: SLUCanvasRecordOption) {
        this.option = option;
        this.init();
    }
    init() {
        const that = this, {option} = that ,{ctx, frameRate} = option;
        that.ctx = ctx;
        that.stream = ctx.canvas.captureStream(frameRate);
        that.recorder = new MediaRecorder(this.stream);
        that.recorder.ondataavailable = (event) => {
            that.frames.push(event.data);
        }
    }
    start() {
        this.recorder.start();
    }
    pause() {
        this.recorder.pause();
    }
    resume() {
        this.recorder.resume();
    }
    stop() {
        this.recorder.stop();
        this.download();
    }
    download() {
        const that = this, {option, frames} = that, {fileName = 'test'} =option;
        const blob = new Blob(frames, { 'type' : 'video/mp4' });
        const url = URL.createObjectURL(blob);
        that.downFile(url, fileName);
        that.frames = [];
    }
    downFile(url: string, name?: string): void {
        const aLink = document.createElement("a");
        aLink.setAttribute("href", url);
        if (!name) {
            let names = url.split('\\') || [];
            name = names[names.length - 1];
        }
        aLink.setAttribute("download", `${name}`);
        aLink.click();
        aLink.remove();
    }
}
export interface SLUCanvasRecordOption {
    ctx: CanvasRenderingContext2D
    // 录制帧率
    frameRate: number
    fileName?: string
}