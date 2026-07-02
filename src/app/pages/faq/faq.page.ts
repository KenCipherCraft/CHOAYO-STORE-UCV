import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonContent, IonIcon } from '@ionic/angular/standalone';
import { RouterModule } from '@angular/router';
import { addIcons } from 'ionicons';
import {
  chevronDownOutline,
  helpCircleOutline
} from 'ionicons/icons';

@Component({
  selector: 'app-faq',
  templateUrl: './faq.page.html',
  styleUrls: ['./faq.page.scss'],
  standalone: true,
  imports: [
    IonContent,
    IonIcon,
    CommonModule,
    RouterModule
  ]
})
export class FaqPage {

  preguntas = [
    {
      abierta: true,
      pregunta: '¿Cómo acumulo puntos?',
      respuesta: 'Acumulas puntos realizando compras en CHOAYO STORE. Por cada compra registrada, los puntos se agregan automáticamente.'
    },
   
    {
      abierta: false,
      pregunta: '¿Cómo canjeo mis puntos?',
      respuesta: 'Ingresa a Recompensas y selecciona el premio que deseas.'
    },
    {
      abierta: false,
      pregunta: '¿Cómo funcionan los cupones?',
      respuesta: 'Los cupones se pueden utilizar en promociones específicas dentro de CHOAYO STORE.'
    },
    {
      abierta: false,
      pregunta: '¿Los puntos vencen?',
      respuesta: 'Actualmente los puntos no tienen fecha de vencimiento.'
    }
  ];

  constructor() {
    addIcons({
      chevronDownOutline,
      helpCircleOutline
    });
  }

  abrir(item: any) {
    item.abierta = !item.abierta;
  }

}