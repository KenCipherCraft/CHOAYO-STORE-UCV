import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonContent, IonIcon, IonButton, IonModal } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  checkmarkCircleOutline,
  alertCircleOutline,
  star
} from 'ionicons/icons';
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

  modalData = {
    titulo: '',
    mensaje: '',
    icono: '',
    color: ''
  };

  catalogo = [
    {
      id: 1,
      nombre: 'Café gratis',
      costo: 500,
      imagen: 'assets/recompensas/cafe.png',
      colorClass: 'cafe'
    },
    {
      id: 2,
      nombre: 'Descuento 20%',
      costo: 800,
      imagen: 'assets/recompensas/descuento.png',
      colorClass: 'bag'
    },
    {
      id: 3,
      nombre: 'Cupón S/15',
      costo: 1000,
      imagen: 'assets/recompensas/cupon.png',
      colorClass: 'ticket'
    },
    {
      id: 4,
      nombre: 'Entrada al Cine',
      costo: 1500,
      imagen: 'assets/recompensas/cine.png',
      colorClass: 'cinema'
    },
    {
      id: 5,
      nombre: 'Polo CHOAYO',
      costo: 2500,
      imagen: 'assets/recompensas/polo.png',
      colorClass: 'merch'
    }
  ];

  constructor(private usuarioService: UsuarioService) {
    addIcons({
      checkmarkCircleOutline,
      alertCircleOutline,
      star
    });
  }

  ngOnInit() {
    this.usuario = this.usuarioService.obtenerDatos();
  }

  ionViewWillEnter() {
    this.usuario = this.usuarioService.obtenerDatos();
  }

  calcularProgreso(costo: number): number {
    const puntos = this.usuario?.puntos || 0;
    const porcentaje = (puntos / costo) * 100;

    if (porcentaje > 100) {
      return 100;
    }

    return porcentaje;
  }

  confirmarCanje(item: any) {
    const exito = this.usuarioService.canjearRecompensa(
      item.costo,
      item.nombre
    );

    if (exito) {
      this.modalData = {
        titulo: '¡Canje Exitoso!',
        mensaje: `Has canjeado ${item.nombre}. Se descontaron ${item.costo} pts.`,
        icono: 'checkmark-circle-outline',
        color: 'success'
      };

      this.usuario = this.usuarioService.obtenerDatos();

    } else {
      this.modalData = {
        titulo: 'Puntos Insuficientes',
        mensaje: `Necesitas ${item.costo - this.usuario.puntos} puntos más para canjear ${item.nombre}.`,
        icono: 'alert-circle-outline',
        color: 'danger'
      };
    }

    this.isModalOpen = true;
  }

  cerrarModal() {
    this.isModalOpen = false;
  }
}