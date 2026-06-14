import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonContent, IonIcon, IonButton } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { funnelOutline } from 'ionicons/icons';
import { UsuarioService } from '../../services/usuario.service';

@Component({
  selector: 'app-historial',
  templateUrl: './historial.page.html',
  styleUrls: ['./historial.page.scss'],
  standalone: true,
  imports: [IonContent, IonIcon, IonButton, CommonModule]
})
export class HistorialPage implements OnInit {

  transacciones: any[] = [];

  constructor(private usuarioService: UsuarioService) {
    addIcons({ funnelOutline });
  }

  // ionViewWillEnter asegura que la lista se recargue cada vez que entras a la pestaña
  ionViewWillEnter() {
    this.transacciones = this.usuarioService.obtenerHistorial();
  }

  ngOnInit() {
  }
}