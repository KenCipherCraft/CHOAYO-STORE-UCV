import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonContent, IonIcon, IonButton, IonModal } from '@ionic/angular/standalone';
import { Router, RouterModule } from '@angular/router';
import { addIcons } from 'ionicons';
import { notificationsOutline, star, cafeOutline, bagOutline, ticketOutline, giftOutline, checkmarkCircleOutline, alertCircleOutline } from 'ionicons/icons';
import { UsuarioService } from '../services/usuario.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [IonContent, IonIcon, IonButton, IonModal, CommonModule, RouterModule],
})
export class HomePage implements OnInit {
  
  usuario: any;
  isModalOpen = false;
  modalData = { titulo: '', mensaje: '', icono: '', color: '' };
  
  // Variables para el Dashboard
  transaccionesRecientes: any[] = [];
  destacadas = [
    { nombre: 'Café gratis', costo: 500, imagen: 'assets/recompensas/cafe.png' },
    { nombre: 'Descuento 20%', costo: 800, imagen: 'assets/recompensas/descuento.png' },
    { nombre: 'Cupón S/15', costo: 1000, imagen: 'assets/recompensas/cupon.png' }
  ];

  constructor(private usuarioService: UsuarioService, private router: Router) {
    addIcons({ notificationsOutline, star, cafeOutline, bagOutline, ticketOutline, giftOutline, checkmarkCircleOutline, alertCircleOutline });
  }

  ngOnInit() {
    this.cargarDatos();
  }

  ionViewWillEnter() {
    this.cargarDatos();
  }

  cargarDatos() {
    this.usuario = this.usuarioService.obtenerDatos();
    const historialCompleto = this.usuarioService.obtenerHistorial();
    this.transaccionesRecientes = historialCompleto.slice(0, 3);
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
    this.cargarDatos(); // Actualizamos la vista al instante
  }

  cerrarModal() {
    this.isModalOpen = false;
  }

  irARecompensas() {
    this.router.navigate(['/tabs/recompensas']);
  }
}