import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonContent, IonIcon, IonButton } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { notificationsOutline, star, cafeOutline, bagOutline, ticketOutline, giftOutline } from 'ionicons/icons';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [IonContent, IonIcon, IonButton, CommonModule],
})
export class HomePage {
  
  // Datos del usuario (simulados por ahora)
  usuario = {
    nombre: 'Raul',
    puntos: 1250
  };

  constructor() {
    // Registramos todos los iconos que usa el diseño
    addIcons({ notificationsOutline, star, cafeOutline, bagOutline, ticketOutline, giftOutline });
  }
}