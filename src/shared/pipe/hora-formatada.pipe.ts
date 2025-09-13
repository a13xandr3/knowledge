import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'horaFormatada'
})
export class HoraFormatadaPipe implements PipeTransform {

  transform(value: number): string {
    if ( value == null ) return '00.00';
    return value.toFixed(2).padStart(5, '0');
  }

}
