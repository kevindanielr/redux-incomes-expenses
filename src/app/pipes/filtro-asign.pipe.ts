import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filtroAsign'
})
export class FiltroAsignPipe implements PipeTransform {

  transform(asign: any[], termino: string): any[] {
    console.log(asign);
    
    if (termino !== '') {

      termino = termino.toLowerCase();
      return asign.filter( emp => {
        let nameComplete = emp.driverId.userId.userName.toLowerCase();
        if (nameComplete.toLowerCase().includes(termino.toLowerCase())) {
          return emp;
        }
      });
    } else {
      return asign;
    }
  }

}
