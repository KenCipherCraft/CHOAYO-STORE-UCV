import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonContent, IonIcon, IonButton, IonModal } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { scanOutline, flashOutline, closeOutline, checkmarkCircleOutline } from 'ionicons/icons';
import { UsuarioService } from '../../services/usuario.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-scan',
  templateUrl: './scan.page.html',
  styleUrls: ['./scan.page.scss'],
  standalone: true,
  imports: [IonContent, IonIcon, IonButton, IonModal, CommonModule]
})
export class ScanPage {
  
  isModalOpen = false;
  puntosGanados = 0;

  constructor(
    private usuarioService: UsuarioService,
    private router: Router
  ) {
    addIcons({ scanOutline, flashOutline, closeOutline, checkmarkCircleOutline });
  }

  // Simula la lectura de un código de boleta
  simularEscaneo() {
    // Genera una recompensa aleatoria entre 100 y 500 puntos
    this.puntosGanados = Math.floor(Math.random() * (500 - 100 + 1) + 100); 
    this.usuarioService.sumarPuntos(this.puntosGanados);
    this.isModalOpen = true; // Abre el modal de éxito
  }

  // Cierra la ventana emergente y te devuelve al inicio para ver tu nuevo saldo
  cerrarYVolver() {
    this.isModalOpen = false;
    // Pequeño retardo para que la animación del modal termine antes de viajar
    setTimeout(() => {
      this.router.navigate(['/tabs/home']);
    }, 300);
  }
}