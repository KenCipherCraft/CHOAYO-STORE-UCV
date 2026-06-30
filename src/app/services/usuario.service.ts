import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  private datosUsuario = {
    nombre: 'Raul Paredes',
    correo: 'raparedesmo@ucvirtual.edu.pe',
    puntos: 250,
    nivel: 'Bronce'
  };

  private historialTransacciones = [
    {
      tipo: 'ingreso',
      monto: 250,
      descripcion: 'Bono de bienvenida',
      fecha: 'Hoy'
    }
  ];

  private retoDiario = {
    titulo: 'Reto del día',
    descripcion: 'Escanea 2 compras hoy',
    meta: 2,
    progreso: 0,
    recompensa: 80,
    completado: false
  };

  constructor() {
    this.actualizarNivel();
  }

  obtenerDatos() {
    this.actualizarNivel();
    return this.datosUsuario;
  }

  obtenerHistorial() {
    return this.historialTransacciones;
  }

  obtenerRetoDiario() {
    return this.retoDiario;
  }

  canjearRecompensa(costo: number, nombreItem: string): boolean {
    if (this.datosUsuario.puntos >= costo) {
      this.datosUsuario.puntos -= costo;

      this.historialTransacciones.unshift({
        tipo: 'gasto',
        monto: costo,
        descripcion: nombreItem,
        fecha: 'Hoy'
      });

      this.actualizarNivel();
      return true;
    }

    return false;
  }

  sumarPuntos(cantidad: number) {
    this.datosUsuario.puntos += cantidad;

    this.historialTransacciones.unshift({
      tipo: 'ingreso',
      monto: cantidad,
      descripcion: 'Compra en Tienda',
      fecha: 'Hoy'
    });

    this.avanzarRetoDiario();
    this.actualizarNivel();
  }

  avanzarRetoDiario() {
    if (this.retoDiario.completado) {
      return;
    }

    this.retoDiario.progreso++;

    if (this.retoDiario.progreso >= this.retoDiario.meta) {
      this.retoDiario.progreso = this.retoDiario.meta;
      this.retoDiario.completado = true;

      this.datosUsuario.puntos += this.retoDiario.recompensa;

      this.historialTransacciones.unshift({
        tipo: 'ingreso',
        monto: this.retoDiario.recompensa,
        descripcion: 'Recompensa por reto diario',
        fecha: 'Hoy'
      });
    }
  }

  actualizarNivel() {
    const puntos = this.datosUsuario.puntos;

    if (puntos >= 2000) {
      this.datosUsuario.nivel = 'Platino';
    } else if (puntos >= 1000) {
      this.datosUsuario.nivel = 'Oro';
    } else if (puntos >= 500) {
      this.datosUsuario.nivel = 'Plata';
    } else {
      this.datosUsuario.nivel = 'Bronce';
    }
  }

  obtenerInfoNivel() {
    const puntos = this.datosUsuario.puntos;

    if (puntos < 500) {
      return {
        nivelActual: 'Bronce',
        siguienteNivel: 'Plata',
        puntosActuales: puntos,
        meta: 500,
        faltan: 500 - puntos,
        progreso: (puntos / 500) * 100
      };
    }

    if (puntos < 1000) {
      return {
        nivelActual: 'Plata',
        siguienteNivel: 'Oro',
        puntosActuales: puntos,
        meta: 1000,
        faltan: 1000 - puntos,
        progreso: ((puntos - 500) / 500) * 100
      };
    }

    if (puntos < 2000) {
      return {
        nivelActual: 'Oro',
        siguienteNivel: 'Platino',
        puntosActuales: puntos,
        meta: 2000,
        faltan: 2000 - puntos,
        progreso: ((puntos - 1000) / 1000) * 100
      };
    }

    return {
      nivelActual: 'Platino',
      siguienteNivel: 'Máximo nivel',
      puntosActuales: puntos,
      meta: puntos,
      faltan: 0,
      progreso: 100
    };
  }

  obtenerLogros() {
    const puntos = this.datosUsuario.puntos;

    const cantidadCompras = this.historialTransacciones.filter(
      transaccion => transaccion.tipo === 'ingreso'
    ).length;

    const cantidadCanjes = this.historialTransacciones.filter(
      transaccion => transaccion.tipo === 'gasto'
    ).length;

    return [
      {
        titulo: 'Primera compra',
        descripcion: 'Realizaste tu primera compra.',
        icono: '🛍️',
        desbloqueado: cantidadCompras >= 1
      },
      {
        titulo: 'Primer canje',
        descripcion: 'Canjeaste una recompensa.',
        icono: '🎁',
        desbloqueado: cantidadCanjes >= 1
      },
      {
        titulo: 'Cliente Plata',
        descripcion: 'Alcanzaste 500 puntos.',
        icono: '🥈',
        desbloqueado: puntos >= 500
      },
      {
        titulo: 'Cliente Oro',
        descripcion: 'Alcanzaste 1000 puntos.',
        icono: '🥇',
        desbloqueado: puntos >= 1000
      },
      {
        titulo: 'Cliente Platino',
        descripcion: 'Alcanzaste 2000 puntos.',
        icono: '💎',
        desbloqueado: puntos >= 2000
      },
      {
        titulo: 'Comprador frecuente',
        descripcion: 'Realizaste 10 compras.',
        icono: '🔥',
        desbloqueado: cantidadCompras >= 10
      }
    ];
  }

}