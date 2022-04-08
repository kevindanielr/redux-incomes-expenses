import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UsuarioAuthGuard } from './guard/usuario-auth.guard';
import { ProfileComponent } from './route/create/profile.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'getting-started',
    pathMatch: 'full',
  },
  {
    path: 'getting-started',
    loadChildren: () => import('./getting-started/getting-started.module').then(m => m.GettingStartedPageModule)
  },
  {
    path: 'auth/signup',
    loadChildren: () => import('./signup/signup.module').then( m => m.SignupPageModule),
  },
  {
    path: 'auth',
    redirectTo: 'auth/login',
    pathMatch: 'full'
  },
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then(m => m.HomePageModule),
    canActivate: [UsuarioAuthGuard],
  },
  {
    path: 'auth/login',
    loadChildren: () => import('./login/login.module').then(m => m.LoginPageModule),
  },
  {
    path: 'app',
    loadChildren: () => import('./tabs/tabs.module').then(m => m.TabsPageModule),
    canActivate: [UsuarioAuthGuard],
  },
  {
    path: 'page-not-found',
    loadChildren: () => import('./page-not-found/page-not-found.module').then(m => m.PageNotFoundModule),
    canActivate: [UsuarioAuthGuard],
  },
  {
    path: 'listing-request-diurno',
    loadChildren: () => import('./route/listing-request-diurno/listing-request-diurno.module').then( m => m.ListingRequestDiurnoPageModule),
    canActivate: [UsuarioAuthGuard],
  },
  {
    path: 'listing-express',
    loadChildren: () => import('./route/listing-express/listing-express.module').then( m => m.ListingExpressPageModule),
  },
  {
    path: 'find-employee',
    loadChildren: () => import('./route/find-employee/find-employee.module').then( m => m.FindEmployeePageModule),
    canActivate: [UsuarioAuthGuard],
  },
  {
    path: 'profile',
    loadChildren: () => import('./route/create/profile.module').then( m => m.ProfilePageModule),
    canActivate: [UsuarioAuthGuard],
  },
  {
    path: '**',
    redirectTo: 'page-not-found'
  },
  {
    path: 'form-find',
    loadChildren: () => import('./route/form-find/form-find.module').then( m => m.FormFindPageModule)
  },
  {
    path: 'form-equipment',
    loadChildren: () => import('./route/form-equipment/form-equipment.module').then( m => m.FormEquipmentPageModule)
  },  {
    path: 'search-asign',
    loadChildren: () => import('./route/search-asign/search-asign.module').then( m => m.SearchAsignPageModule)
  },

  
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      // This value is required for server-side rendering to work.
      initialNavigation: 'enabled',
      scrollPositionRestoration: 'enabled',
      anchorScrolling: 'enabled'
    })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
