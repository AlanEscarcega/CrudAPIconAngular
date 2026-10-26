import { Component } from '@angular/core';
import { Peliculas } from './peliculas/peliculas';

@Component({
  selector: 'app-root',
  imports: [Peliculas],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {

}