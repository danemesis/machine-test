import { MenuItem } from 'primeng/api';

export enum APP_NAVIGATION {
  Home = 'home',
  Favorites = 'favorites',
}

export const NAVBAR_ITEMS: MenuItem[] = [
  {
    label: 'Home',
    link: APP_NAVIGATION.Home,
    icon: 'pi pi-home',
  },
  {
    label: 'Favorites',
    link: APP_NAVIGATION.Favorites,
    icon: 'pi pi-star',
  },
];
