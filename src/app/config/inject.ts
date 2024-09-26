import { InjectionToken } from '@angular/core';
import { CESIUM_TOKEN } from '../docs/any-demo/cesium/config/token';

export const CESIUM_ACCESS_TOKEN = new InjectionToken<string>('CESIUM_ACCESS_TOKEN', {
  providedIn: 'root',

  factory: () => {
    // console.log(environment.production)
    // 根据环境打包，不同环境下的cesium token
    return CESIUM_TOKEN.ACCESS_TOKEN;
  }
});
