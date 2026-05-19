import { Component } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonIcon, IonButton, IonButtons, IonGrid, IonRow, IonCol } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { personCircleOutline, giftOutline, scanOutline, star, starOutline } from 'ionicons/icons';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [IonHeader, IonToolbar, IonTitle, IonContent, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonIcon, IonButton, IonButtons, IonGrid, IonRow, IonCol],
})
export class HomePage {
  
  // Datos simulados del usuario logueado
  usuario = {
    nombre: 'Raul Paredes',
    puntos: 450,
    nivel: 'Oro'
  };

  constructor() {
    addIcons({ personCircleOutline, giftOutline, scanOutline, star, starOutline });
  }
}