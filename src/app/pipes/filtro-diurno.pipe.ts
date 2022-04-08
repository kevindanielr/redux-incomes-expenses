import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filtroDiurno'
})
export class filtroDiurnoPipe implements PipeTransform {

  transform(diurno: any[], termino: string): any[] {
    // console.log(diurno);
    
    if (termino !== '') {
      termino = termino.toLowerCase();      
      return diurno.filter( req => ( req?.from?.toLowerCase()?.includes(termino) || req?.to?.toLowerCase()?.includes(termino) || req?.routeId?.routeName?.toLowerCase()?.includes(termino) ));
    } else {
      return diurno;
    }
  }

}
