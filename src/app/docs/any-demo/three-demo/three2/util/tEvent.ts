export class TEvent {
  eventMap: Map<string, Set<Function>> = new Map();
  onceMap: Map<string, Set<Function>> = new Map();
  readonly BASEEVENTNAME = 'BASE';
  constructor() {}
  on(event: string, callback: Function, immediate?: boolean): void;
  on(event: Function, immediate?: boolean): void;
  on<T extends string | Function>(a: T, b?: T extends string ? Function : boolean, c?: T extends string ? boolean : never) {
    const eventName = typeof a == 'string' ? a : this.BASEEVENTNAME;
    const eventCb = (typeof a == 'string' ? b : a) as Function;
    const immediate = (typeof b == 'boolean' ? b : c) as boolean;
    const eventList = this.eventMap.get(eventName);
    if (eventList) {
      let exist = eventList.has(eventCb)
      if (!exist) {
        eventList.add(eventCb);
      }
    } else {
      this.eventMap.set(eventName, new Set([eventCb]));
    }
    if (immediate) {
      eventCb();
    }
  }
  /**批量清空 */
  offAll(event?: string) {
    if (event) {
      this.eventMap.delete(event);
      this.onceMap.delete(event);
    } else {
      this.eventMap.clear();
      this.onceMap.clear();
    }
  }
  off(event: string, callback: Function): void;
  off(event: Function): void;
  off<T extends string | Function>(a: T, b?: T extends string ? Function : never) {
    let eventName = (typeof a == 'string' ? a : this.BASEEVENTNAME) as string;
    let cb = (typeof a == 'string' ? b : a) as Function;
    const eventList = this.eventMap.get(eventName);
    const eventList2 = this.onceMap.get(eventName);
    if (eventList) {
      let exist = eventList.has(cb);
      if (exist) {
        eventList.delete(cb);
      }
    }
    if (eventList2) {
      let exist = eventList2.has(cb);
      if (exist) {
        eventList2.delete(cb);
      }
    }
  }
  /**
   * 执行一次后取消
   * @param event
   * @param callback
   */
  once(event: string, callback: Function): void;
  once(event: Function): void;
  once<T extends string | Function>(a: T, b?: T extends string ? Function : never) {
    const eventName = typeof a == 'string' ? a : this.BASEEVENTNAME;
    const eventCb = (typeof a == 'string' ? b : a) as Function;
    const eventList = this.onceMap.get(eventName);
    if (eventList) {
      let exist = eventList.has(eventCb);
      if (!exist) {
        eventList.add(eventCb);
      }
    } else {
      this.onceMap.set(eventName, new Set([eventCb]));
    }
  }
  
  /**触发事件 */
  fire(eventName: string, ...args: any[]) {
    const fireEvents = this.eventMap.get(eventName) || [];
    const onceEvents = this.onceMap.get(eventName) || [];
    fireEvents.forEach(evt => {
      evt(...args);
    });
    onceEvents.forEach(evt => {
      evt(...args);
    });
    this.onceMap.delete(eventName); // 直接清空
  }
}