import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filtroBusqueda'
})
export class FiltroBusquedaPipe implements PipeTransform {

  transform(array: any[], search: string, origin: string ): any[] {

    if (search === '') {
      return array;
    } else {

      if (origin === 'MR') {
        console.log(array.filter( 
          route => 
          route?.scheduleRouteId?.routeId?.routeName?.toLowerCase().includes( search.toLowerCase() ) ||
          route?.scheduleRouteId?.routeId?.routeDestinationCity?.toLowerCase().includes( search.toLowerCase() ) ||
          route?.scheduleRouteId?.routeId?.routeDestinationPlace?.toLowerCase().includes( search.toLowerCase() ) ||
          route?.scheduleRouteId?.routeId?.routeHour?.toLowerCase().includes( search.toLowerCase() ) 
        ));
        
        return array.filter( 
          route => 
          route?.scheduleRouteId?.routeId?.routeName?.toLowerCase().includes( search.toLowerCase() ) ||
          route?.scheduleRouteId?.routeId?.routeDestinationCity?.toLowerCase().includes( search.toLowerCase() ) ||
          route?.scheduleRouteId?.routeId?.routeDestinationPlace?.toLowerCase().includes( search.toLowerCase() ) ||
          route?.scheduleRouteId?.routeId?.routeHour?.toLowerCase().includes( search.toLowerCase() ) 
        );
        
      } else {

        console.log(array.filter( 
          route => 
          route?.routeId?.routeName?.toLowerCase().includes( search.toLowerCase() ) ||
          route?.routeId?.routeDestinationCity?.toLowerCase().includes( search.toLowerCase() ) ||
          route?.routeId?.routeDestinationPlace?.toLowerCase().includes( search.toLowerCase() ) ||
          route?.routeId?.routeHour?.toLowerCase().includes( search.toLowerCase() ) 
        ));

        return array.filter( 
          route => 
          route?.routeId?.routeName?.toLowerCase().includes( search.toLowerCase() ) ||
          route?.routeId?.routeDestinationCity?.toLowerCase().includes( search.toLowerCase() ) ||
          route?.routeId?.routeDestinationPlace?.toLowerCase().includes( search.toLowerCase() ) ||
          route?.routeId?.routeHour?.toLowerCase().includes( search.toLowerCase() ) 
        );
        
      }
    } 
  }
}
