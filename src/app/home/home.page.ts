import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonContent, IonIcon, IonButton, IonModal } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { notificationsOutline, star, cafeOutline, bagOutline, ticketOutline, giftOutline, checkmarkCircleOutline, alertCircleOutline } from 'ionicons/icons';
import { UsuarioService } from '../services/usuario.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [IonContent, IonIcon, IonButton, IonModal, CommonModule],
})
export class HomePage implements OnInit {
  
  usuario: any;
  isModalOpen = false;
  modalData = { titulo: '', mensaje: '', icono: '', color: '' };

  constructor(private usuarioService: UsuarioService) {
    addIcons({ notificationsOutline, star, cafeOutline, bagOutline, ticketOutline, giftOutline, checkmarkCircleOutline, alertCircleOutline });
  }

  ngOnInit() {
    this.usuario = this.usuarioService.obtenerDatos();
  }

  procesarCanje(nombreItem: string, costo: number) {
    // Ahora le pasamos también el nombreItem al servicio
    const exito = this.usuarioService.canjearRecompensa(costo, nombreItem);
    
    if (exito) {
      this.modalData = {
        titulo: '¡Canje Exitoso!',
        mensaje: `Has obtenido tu <b>${nombreItem}</b>. ¡Disfrútalo!`,
        icono: 'checkmark-circle-outline',
        color: 'success-color'
      };
    } else {
      this.modalData = {
        titulo: 'Puntos insuficientes',
        mensaje: `Necesitas <b>${costo} pts</b> para este beneficio. ¡Sigue sumando!`,
        icono: 'alert-circle-outline',
        color: 'error-color'
      };
    }
    this.isModalOpen = true;
  }

  cerrarModal() {
    this.isModalOpen = false;
  }
}