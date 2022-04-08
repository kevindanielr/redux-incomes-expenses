import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filtroEmpleado'
})
export class FiltroEmpleadoPipe implements PipeTransform {

  transform(empleados: any[], termino: string): any[] {
    if (termino !== '') {
      termino = termino.toLowerCase();
      return empleados.filter( emp => {
        let nameComplete = emp?.employeeId?.employeeFirstName?.toLowerCase() + ' ' + emp?.employeeId?.employeeLastName?.toLowerCase()
        if (nameComplete.toLowerCase().includes(termino.toLowerCase())) {
          return emp;
        }
      });
    } else {
      return empleados;
    }
  }

}
