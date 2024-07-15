import { AsyncPipe } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-favorites',
  standalone: true,
  imports: [
    AsyncPipe,
    //
  ],
  templateUrl: './favorites.component.html',
})
export class FavoritesComponent {}
