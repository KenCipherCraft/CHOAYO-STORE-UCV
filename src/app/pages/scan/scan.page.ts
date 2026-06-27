import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonContent, IonIcon, IonButton, IonModal } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  scanOutline,
  flashOutline,
  closeOutline,
  checkmarkCircleOutline,
  qrCodeOutline,
  bulbOutline
} from 'ionicons/icons';
import { UsuarioService } from '../../services/usuario.service';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-scan',
  templateUrl: './scan.page.html',
  styleUrls: ['./scan.page.scss'],
  standalone: true,
  imports: [
    IonContent,
    IonIcon,
    IonButton,
    IonModal,
    CommonModule,
    RouterModule
  ]
})
export class ScanPage {

  isModalOpen = false;
  puntosGanados = 0;

  constructor(
    private usuarioService: UsuarioService,
    private router: Router
  ) {
    addIcons({
      scanOutline,
      flashOutline,
      closeOutline,
      checkmarkCircleOutline,
      qrCodeOutline,
      bulbOutline
    });
  }

  simularEscaneo() {
    this.puntosGanados = Math.floor(Math.random() * (500 - 100 + 1) + 100);
    this.usuarioService.sumarPuntos(this.puntosGanados);
    this.isModalOpen = true;
  }

  cerrarYVolver() {
    this.isModalOpen = false;

    setTimeout(() => {
      this.router.navigate(['/tabs/home']);
    }, 300);
  }
}