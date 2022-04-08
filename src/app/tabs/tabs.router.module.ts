import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: '',
    component: TabsPage,
    children: [
      // /app/ redirect
      {
        path: '',
        redirectTo: 'routes',
        pathMatch: 'full'
      },
      {
        path: 'routes',
        children: [
          {
            path: '',
            loadChildren: () => import('../route/listing/route-listing.module').then(m => m.RouteListingPageModule)
          },
          {
            path: 'travel/:productId',
            loadChildren: () => import('../route/details/route-details.module').then(m => m.RouteDetailsPageModule)
          }
          
        ]
      },
      {
        path: 'my-route',
        children: [
          {
            path: '',
            loadChildren: () => import('../route/listing/route-listing.module').then(m => m.RouteListingPageModule)
          },
          {
            path: 'travel/:productId',
            loadChildren: () => import('../route/details/route-details.module').then(m => m.RouteDetailsPageModule)
          }
        ]
      },
      {
        path: 'alert',
        children: [
          {
            path: '',
            loadChildren: () => import('../notifications/notifications.module').then(m => m.NotificationsPageModule)
          }
        ]
      }
    ]
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule],
  providers: [ ]
})
export class TabsPageRoutingModule {}
