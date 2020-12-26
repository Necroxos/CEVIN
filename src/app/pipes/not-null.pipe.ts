import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'notNull'
})
export class NotNullPipe implements PipeTransform {

  transform(value: any, ...args: any[]): any {
    return value ? value : '-';
  }

}
