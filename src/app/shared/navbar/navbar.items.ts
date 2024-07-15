import { MenuItem } from 'primeng/api';

export enum APP_NAVIGATION {
  Home = 'home',
  Favorites = 'favorites',
}

export const NAVBAR_ITEMS: MenuItem[] = [
  {
    label: 'Home',
    url: APP_NAVIGATION.Home,
    icon: 'pi pi-home',
  },
  {
    label: 'Favorites',
    url: APP_NAVIGATION.Favorites,
    icon: 'pi pi-star',
  },
];
