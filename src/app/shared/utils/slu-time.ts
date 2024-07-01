type SLTDelay = {
    /**每个回调对应的key(禁止使用数字开头) */
    key?: string,
    /**延迟的时间 */
    time?: number,
    /**要延迟执行的回调函数 */
    cb: () => void,
    /**立即执行一次回调 */
    im?: boolean,
} | (() => void);
/**Settimeout延时操作 */
export class SLUSettimeout {
    constructor() { SLUSettimeout.key++; this.id = SLUSettimeout.key.toString(); }
    /**实例数量 */
    private id: string = '1';
    /**用于区分每次生成的实例 */
    private static key = 1;
    /**实例中的所有延时的返回id存放处 */
    private static map: { [key: string]: any } = Object.create(null);
    /**(确定不会共存冲突时使用cb 否则需要传对象申明key)time毫秒后的延时回调 
     * @param clear 默认true,会取消之前未调用的延时回调
    */
    static set cb(vl: SLTDelay) {
        let { key = 'timeout' } = typeof vl === 'function' ? {} : vl;
        clearTimeout(this.map[key]);
        if (typeof vl === 'function') {
            this.map[key] = setTimeout(() => { vl(); Reflect.deleteProperty(this.map, key) }, 0);
        } else {
            let { time, cb, im } = vl;
            im && cb();
            this.map[key] = setTimeout(() => { cb(); Reflect.deleteProperty(this.map, key) }, time || 0);
        }
    }
    /**(确定不会共存冲突时可不传值)取消 */
    static clear(key: string = 'timeout') {
        clearTimeout(SLUSettimeout.map[key]);
        Reflect.deleteProperty(SLUSettimeout.map, key)
    }
    /**设置延时(只有回调函数则延时为0) */
    public set cb(vl: SLTDelay) {
        let key = typeof vl === 'function' ? 'timeout' : vl.key || 'timeout';
        key = this.id + key;
        if (typeof vl === 'function') {
            SLUSettimeout.cb = { cb: vl, key };
        } else {
            vl.key = key;
            SLUSettimeout.cb = vl;
        }
    }
    /**清除本实例对象存放的所有的延时 
     * @param 指定的延时回调
    */
    public clear(key?: string) {
        let map = SLUSettimeout.map;
        if (!key) {
            /**清除所有本实例的延迟操作 */
            for (const key in map) {
                if (Object.prototype.hasOwnProperty.call(map, key)) {
                    /**用于确认是本实例的延时 */
                    if (key.startsWith(this.id)) SLUSettimeout.clear(key)
                }
            }
        }
        SLUSettimeout.clear(this.id + key)
    }
}
/**setInterval类 */
export class UtilSetInterval {
    static id: { [key: string]: any } = Object.create(null);
    /**实例中的所有延时的返回id存放处 */
    private map: { [key: string]: any } = Object.create(null);
    /**(确定不会共存冲突时使用)0毫秒后的延时回调(会先调用一次) */
    static set cb(v: SLTDelay) {
        if (typeof v === 'function') {
            clearInterval(this.id['interval']);
            this.id['interval'] = setInterval(v, 3000);
        } else {
            let { time, cb, im, key = 'interval' } = v;
            clearInterval(this.id[key])
            im && cb();
            this.id[key] = setInterval(cb, time || 3000);
        }
    }
    /**(确定不会共存冲突时使用)取消 */
    static cancel(key: string = 'interval') { clearInterval(this.id[key]) }
    /**设置延时(只有回调函数则延时为0) */
    set set(v: SLTDelay) {
        if (typeof v === 'function') {
            clearInterval(this.map['key']);
            this.map['key'] = setInterval(v, 3000);
        } else {
            let { time, cb, key = 'interval' } = v;
            clearInterval(this.map[key]);
            this.map[key] = setInterval(cb, time || 0);
        }
    }
    /**清除实例对象存放的所有的延时 */
    public clear() {
        let map = this.map;
        for (const key in map) {
            if (Object.prototype.hasOwnProperty.call(map, key)) {
                const id = map[key];
                clearInterval(id);
            }
        }
    }
    public clearByKey(key: string = 'interval') {
        clearInterval(this.map[key]);
    }
}

export const UtilTime = {

}