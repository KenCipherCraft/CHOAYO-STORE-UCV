import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonContent, IonIcon } from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { addIcons } from 'ionicons';

import {
  mapOutline,
  lockClosedOutline,
  playOutline
} from 'ionicons/icons';

@Component({
  selector: 'app-juego',
  templateUrl: './juego.page.html',
  styleUrls: ['./juego.page.scss'],
  standalone: true,
  imports: [IonContent, IonIcon, CommonModule]
})
export class JuegoPage {

  nivelMaximoDesbloqueado = 1;

  niveles = [
    { numero: 1, ruta: '/tabs/nivel1', desbloqueado: true, estrellas: 0, x: 50, y: 88 },
    { numero: 2, ruta: '/tabs/nivel2', desbloqueado: false, estrellas: 0, x: 35, y: 76 },
    { numero: 3, ruta: '/tabs/nivel3', desbloqueado: false, estrellas: 0, x: 63, y: 64 },
    { numero: 4, ruta: '', desbloqueado: false, estrellas: 0, x: 38, y: 52 },
    { numero: 5, ruta: '', desbloqueado: false, estrellas: 0, x: 66, y: 40 },
    { numero: 6, ruta: '', desbloqueado: false, estrellas: 0, x: 42, y: 28 },
    { numero: 7, ruta: '', desbloqueado: false, estrellas: 0, x: 64, y: 16 },
    { numero: 8, ruta: '', desbloqueado: false, estrellas: 0, x: 47, y: 7 }
  ];

  constructor(private router: Router) {
    addIcons({
      mapOutline,
      lockClosedOutline,
      playOutline
    });
  }

  abrirNivel(nivel: any) {
    if (!nivel.desbloqueado || !nivel.ruta) {
      return;
    }

    this.router.navigate([nivel.ruta]);
  }

}