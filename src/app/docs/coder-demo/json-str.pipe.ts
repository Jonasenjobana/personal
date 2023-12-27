import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'jsonStr'
})
export class JsonStrPipe implements PipeTransform {

  transform(value: unknown, ...args: unknown[]): unknown {
    return JSON.stringify(value);
  }

}
