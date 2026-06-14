import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  
  private datosUsuario = {
    nombre: 'Raul Paredes',
    correo: 'raparedesmo@ucvirtual.edu.pe',
    puntos: 250,
    nivel: 'Oro'
  };

  // NUEVO: Arreglo para guardar el historial de movimientos
  private historialTransacciones = [
    { tipo: 'ingreso', monto: 250, descripcion: 'Bono de bienvenida', fecha: 'Hoy' }
  ];

  constructor() { }

  obtenerDatos() {
    return this.datosUsuario;
  }

  // Devuelve la lista completa de transacciones
  obtenerHistorial() {
    return this.historialTransacciones;
  }

  // Actualizamos la función para recibir también el nombre del ítem
  canjearRecompensa(costo: number, nombreItem: string): boolean {
    if (this.datosUsuario.puntos >= costo) {
      this.datosUsuario.puntos -= costo;
      
      // Guardamos el gasto en el historial (unshift lo pone de primero en la lista)
      this.historialTransacciones.unshift({
        tipo: 'gasto',
        monto: costo,
        descripcion: nombreItem,
        fecha: 'Hoy'
      });
      
      return true;
    } else {
      return false;
    }
  }

  sumarPuntos(cantidad: number) {
    this.datosUsuario.puntos += cantidad;
    
    // Guardamos el ingreso en el historial
    this.historialTransacciones.unshift({
      tipo: 'ingreso',
      monto: cantidad,
      descripcion: 'Compra en Tienda',
      fecha: 'Hoy'
    });
  }
}