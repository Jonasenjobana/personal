export class TEvent {
  eventMap: Map<string, Function[]> = new Map();
  onceMap: Map<string, Function[]> = new Map();
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
      let idx = eventList.indexOf(eventCb);
      if (idx == -1) {
        eventList.push(eventCb);
      }
    } else {
      this.eventMap.set(eventName, [eventCb]);
    }
    if (immediate) {
      eventCb();
    }
  }
  off(event: string, callback: Function): void;
  off(event: Function): void;
  off<T extends string | Function>(event: T, callback?: T extends string | string[] ? Function : never) {
    let eventName = typeof event == 'string' ? event : this.BASEEVENTNAME;
    const eventList = this.eventMap.get(eventName);
    const eventList2 = this.onceMap.get(eventName);
    if (eventList) {
      let idx = eventList.indexOf(callback);
      if (idx !== -1) {
        eventList.splice(idx, 1);
      }
    }
    if (eventList2) {
      let idx = eventList2.indexOf(callback);
      if (idx !== -1) {
        eventList2.splice(idx, 1);
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
      let idx = eventList.indexOf(eventCb);
      if (idx == -1) {
        eventList.push(eventCb);
      }
    } else {
      this.onceMap.set(eventName, [eventCb]);
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
    onceEvents.forEach(evt => {
      this.off(eventName, evt);
    });
  }
}