import { Routes } from '@angular/router';
import { APP_NAVIGATION } from './shared/navbar/navbar.items';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: APP_NAVIGATION.Home,
  },
  {
    path: APP_NAVIGATION.Home,
    loadComponent: () =>
      import('./pages/home/home.component').then(comp => comp.HomeComponent),
  },
  {
    path: APP_NAVIGATION.Favorites,
    loadComponent: () =>
      import('./pages/home/home.component').then(comp => comp.HomeComponent),
  },
];
