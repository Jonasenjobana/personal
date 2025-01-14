export class SlEvent {
  constructor(public key: string = 'BASE') {}
  private all: Map<string, SlEventItem[]> = new Map();
  private childEvents: Map<string, SlEvent[]> = new Map();
  public forzen: boolean = false;
  // 关联子事件
  connect(child: SlEvent) {
    this.childEvents.set(child.key, this.childEvents.get(child.key)?.concat(child) || [child]);
  }
  // 分发所有同名事件 包括子事件
  /**
   *
   * @param key
   * @param args
   */
  dispatch(key: string | [string, string], ...args) {
    let triggerKey, pubName;
    if (Array.isArray(key)) {
      triggerKey = key[0];
      pubName = key[1];
    } else {
      triggerKey = key;
    }
    if (pubName) {
      this.childEvents.get(pubName)?.forEach(item => item.dispatch(key, ...args));
    } else {
      this.childEvents.forEach(item => item.forEach(child => child.dispatch(key, ...args)));
    }
    this.trigger(triggerKey, ...args);
  }
  // 注册
  on(key: string, cb) {
    this.all.set(key, this.all.get(key)?.concat({ key, cb }) || [{ key, cb }]);
  }
  // 注销
  off(key: string, cb) {
    let cbs = this.all.get(key);
    if (cb) {
      for (let i = 0; i < cbs.length; i++) {
        let item = cbs[i];
        if (item.cb == cb) {
          cbs.splice(i, 1);
        }
      }
    } else {
      this.all.delete(key);
    }
  }
  // 触发当前事件
  trigger(key: string, ...args) {
    this.all.get(key)?.forEach(item => item.cb(...args));
  }
  // 清除
  clear() {
    this.all.clear();
    this.childEvents.clear();
  }
}
export interface SlEventItem {
  key: string;
  cb: (...args) => void;
}
