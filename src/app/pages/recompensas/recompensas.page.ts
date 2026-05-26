import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonContent, IonIcon, IonButton, IonModal } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { cafeOutline, bagOutline, ticketOutline, filmOutline, shirtOutline, checkmarkCircleOutline, alertCircleOutline } from 'ionicons/icons';
import { UsuarioService } from '../../services/usuario.service';

@Component({
  selector: 'app-recompensas',
  templateUrl: './recompensas.page.html',
  styleUrls: ['./recompensas.page.scss'],
  standalone: true,
  imports: [IonContent, IonIcon, IonButton, IonModal, CommonModule]
})
export class RecompensasPage implements OnInit {
  
  usuario: any = { nombre: '', puntos: 0 };
  isModalOpen = false;
  modalData = { titulo: '', mensaje: '', icono: '', color: '' };

  // Nuestro catálogo de recompensas simulando una Base de Datos
  catalogo = [
    { id: 1, nombre: 'Café gratis', costo: 500, icono: 'cafe-outline', colorClass: 'cafe' },
    { id: 2, nombre: 'Descuento 20%', costo: 800, icono: 'bag-outline', colorClass: 'bag' },
    { id: 3, nombre: 'Cupón S/15', costo: 1000, icono: 'ticket-outline', colorClass: 'ticket' },
    { id: 4, nombre: 'Entrada al Cine', costo: 1500, icono: 'film-outline', colorClass: 'cinema' },
    { id: 5, nombre: 'Polo CHOAYO', costo: 2500, icono: 'shirt-outline', colorClass: 'merch' }
  ];

  constructor(private usuarioService: UsuarioService) {
    addIcons({ cafeOutline, bagOutline, ticketOutline, filmOutline, shirtOutline, checkmarkCircleOutline, alertCircleOutline });
  }

  ngOnInit() {
    this.usuario = this.usuarioService.obtenerDatos();
  }

  ionViewWillEnter() {
    this.usuario = this.usuarioService.obtenerDatos();
  }

  procesarCanje(nombreItem: string, costo: number) {
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