import { Component, inject, OnInit, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Pelicula, PeliculasApi } from '../servicios/peliculas-api';

@Component({
  selector: 'app-peliculas',
  imports: [ReactiveFormsModule],
  templateUrl: './peliculas.html',
  styleUrl: './peliculas.css'
})
export class Peliculas implements OnInit {
  private api = inject(PeliculasApi);

  peliculas = signal<Pelicula[]>([]);
  cargando = signal(true);
  editandoId = signal<number | null>(null);
  mensaje = signal<{ texto: string; tipo: 'exito' | 'error' } | null>(null);

  formulario = new FormGroup({
    titulo: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.minLength(2)] }),
    director: new FormControl('', { nonNullable: true, validators: Validators.required }),
    anio: new FormControl<number | null>(null, [Validators.required, Validators.min(1888), Validators.max(2100)]),
    genero: new FormControl('', { nonNullable: true, validators: Validators.required })
  });

  ngOnInit() {
    this.cargar();
  }

  mostrarError(campo: 'titulo' | 'director' | 'anio' | 'genero') {
    const control = this.formulario.controls[campo];
    return control.invalid && (control.touched || control.dirty);
  }

  // Aviso temporal de exito o error
  avisar(texto: string, tipo: 'exito' | 'error') {
    this.mensaje.set({ texto, tipo });
    setTimeout(() => this.mensaje.set(null), 3500);
  }

  // GET
  cargar() {
    this.cargando.set(true);
    this.api.obtener().subscribe({
      next: (datos) => {
        this.peliculas.set(datos);
        this.cargando.set(false);
      },
      error: () => {
        this.cargando.set(false);
        this.avisar('No se pudieron cargar las películas.', 'error');
      }
    });
  }

  // POST o PUT, segun si hay una pelicula en edicion
  guardar() {
    if (this.formulario.invalid) {
      this.formulario.markAllAsTouched();
      return;
    }

    const pelicula = this.formulario.getRawValue() as Pelicula;
    const id = this.editandoId();

    if (id === null) {
      this.api.agregar(pelicula).subscribe({
        next: () => this.terminar('Película agregada correctamente.'),
        error: () => this.avisar('Error al agregar la película.', 'error')
      });
    } else {
      this.api.actualizar(id, pelicula).subscribe({
        next: () => this.terminar('Película actualizada correctamente.'),
        error: () => this.avisar('Error al actualizar la película.', 'error')
      });
    }
  }

  editar(pelicula: Pelicula) {
    this.editandoId.set(pelicula.id!);
    this.formulario.patchValue(pelicula);
  }

  cancelar() {
    this.editandoId.set(null);
    this.formulario.reset();
  }

  eliminar(pelicula: Pelicula) {
    if (!confirm(`¿Eliminar "${pelicula.titulo}"?`)) return;

    this.api.eliminar(pelicula.id!).subscribe({
      next: () => {
        this.avisar('Película eliminada correctamente.', 'exito');
        this.cargar();
      },
      error: () => this.avisar('Error al eliminar la película.', 'error')
    });
  }

  // Limpia el formulario y recarga la lista tras guardar
  private terminar(texto: string) {
    this.avisar(texto, 'exito');
    this.cancelar();
    this.cargar();
  }
}