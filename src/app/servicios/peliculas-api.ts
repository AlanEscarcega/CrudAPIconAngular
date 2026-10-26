import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Pelicula {
  id?: number;
  titulo: string;
  director: string;
  anio: number;
  genero: string;
}

@Injectable({ providedIn: 'root' })
export class PeliculasApi {
  private http = inject(HttpClient);
  private url = 'http://localhost:3000/peliculas';

  obtener(): Observable<Pelicula[]> {
    return this.http.get<Pelicula[]>(this.url);
  }


  agregar(pelicula: Pelicula): Observable<Pelicula> {
    return this.http.post<Pelicula>(this.url, pelicula);
  }

  actualizar(id: number, pelicula: Pelicula): Observable<Pelicula> {
    return this.http.put<Pelicula>(`${this.url}/${id}`, pelicula);
  }

  eliminar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.url}/${id}`);
  }
}