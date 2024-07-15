import { NgClass, NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { BadgeModule } from 'primeng/badge';
import { MenubarModule } from 'primeng/menubar';
import { NAVBAR_ITEMS } from './navbar.items';

@Component({
  standalone: true,
  selector: 'app-navbar',
  template: `
    <p-menubar [model]="items">
      <ng-template pTemplate="item" let-item let-root="root">
        <a
          pRipple
          [routerLink]="item.link"
          class="flex align-items-center p-menuitem-link">
          <span [class]="item.icon"></span>
          <span class="ml-2">{{ item.label }}</span>
          <p-badge
            *ngIf="item.badge"
            [ngClass]="{ 'ml-auto': !root, 'ml-2': root }"
            [value]="item.badge" />
          <span
            *ngIf="item.shortcut"
            class="ml-auto border-1 surface-border border-round surface-100 text-xs p-1"
            >{{ item.shortcut }}</span
          >
          <i
            *ngIf="item.items"
            [ngClass]="[
              'pi',
              root ? 'pi-angle-down ml-2' : 'pi-angle-right ml-auto',
            ]"></i>
        </a>
      </ng-template>
    </p-menubar>
  `,
  imports: [
    NgIf,
    NgClass,
    RouterModule,
    //
    MenubarModule,
    BadgeModule,
    //
  ],
})
export class NavbarComponent {
  items = NAVBAR_ITEMS;
}
