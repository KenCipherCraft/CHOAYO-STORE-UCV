import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonContent, IonIcon } from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { addIcons } from 'ionicons';

import {
  arrowBackOutline,
  arrowForwardOutline,
  arrowUpOutline,
  refreshOutline,
  trophyOutline,
  heart,
  star
} from 'ionicons/icons';

import { UsuarioService } from '../../services/usuario.service';

@Component({
  selector: 'app-nivel1',
  templateUrl: './nivel1.page.html',
  styleUrls: ['./nivel1.page.scss'],
  standalone: true,
  imports: [IonContent, IonIcon, CommonModule]
})
export class Nivel1Page {

  jugando = true;
  terminado = false;
  gano = false;

  puntos = 0;
  premio = 0;
  vidas = 3;

  jugadorX = 8;
  jugadorY = 0;
  saltando = false;

  mensaje = 'Recoge estrellas y llega a la bandera.';

  estrellas = [
    { x: 25, tomada: false },
    { x: 50, tomada: false },
    { x: 72, tomada: false }
  ];

  obstaculos = [
    { x: 38 },
    { x: 63 }
  ];

  metaX = 90;

  constructor(
    private router: Router,
    private usuarioService: UsuarioService
  ) {
    addIcons({
      arrowBackOutline,
      arrowForwardOutline,
      arrowUpOutline,
      refreshOutline,
      trophyOutline,
      heart,
      star
    });
  }

  avanzar() {
    if (!this.jugando || this.terminado) {
      return;
    }

    this.jugadorX += 5;

    if (this.jugadorX > 94) {
      this.jugadorX = 94;
    }

    this.verificarEstrellas();
    this.verificarObstaculos();
    this.verificarMeta();
  }

  saltar() {
    if (!this.jugando || this.saltando || this.terminado) {
      return;
    }

    this.saltando = true;
    this.jugadorY = 28;

    setTimeout(() => {
      this.jugadorY = 0;
      this.saltando = false;

      this.verificarObstaculos();
      this.verificarMeta();
    }, 620);
  }

  verificarEstrellas() {
    this.estrellas.forEach(estrella => {
      const distancia = Math.abs(this.jugadorX - estrella.x);

      if (!estrella.tomada && distancia <= 4) {
        estrella.tomada = true;
        this.puntos += 10;
      }
    });
  }

  verificarObstaculos() {
    this.obstaculos.forEach(obstaculo => {
      const distancia = Math.abs(this.jugadorX - obstaculo.x);

      if (distancia <= 3 && this.jugadorY < 16) {
        this.perderVida();
      }
    });
  }

  perderVida() {
    this.vidas--;

    if (this.vidas <= 0) {
      this.perder();
      return;
    }

    this.mensaje = '¡Cuidado! Perdiste una vida.';
    this.jugadorX = Math.max(8, this.jugadorX - 10);
  }

  verificarMeta() {
    if (this.jugadorX >= this.metaX) {
      this.ganar();
    }
  }

  ganar() {
    this.jugando = false;
    this.terminado = true;
    this.gano = true;

    this.premio = 50 + this.puntos + (this.vidas * 10);

    this.usuarioService.sumarPuntos(this.premio);

    this.mensaje = `¡Nivel completado! Ganaste ${this.premio} puntos.`;
  }

  perder() {
    this.jugando = false;
    this.terminado = true;
    this.gano = false;

    this.mensaje = 'Perdiste todas tus vidas. Intenta nuevamente.';
  }

  reiniciar() {
    this.jugando = true;
    this.terminado = false;
    this.gano = false;

    this.puntos = 0;
    this.premio = 0;
    this.vidas = 3;

    this.jugadorX = 8;
    this.jugadorY = 0;
    this.saltando = false;

    this.estrellas = [
      { x: 25, tomada: false },
      { x: 50, tomada: false },
      { x: 72, tomada: false }
    ];

    this.mensaje = 'Recoge estrellas y llega a la bandera.';
  }

  volverMapa() {
    this.router.navigate(['/tabs/juego']);
  }

}