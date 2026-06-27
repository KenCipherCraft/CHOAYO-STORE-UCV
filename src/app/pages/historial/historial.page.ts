import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonContent, IonIcon, IonButton } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  funnelOutline,
  receiptOutline,
  arrowUpCircleOutline,
  giftOutline
} from 'ionicons/icons';
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
  totalGanado = 0;
  totalCanjeado = 0;

  constructor(private usuarioService: UsuarioService) {
    addIcons({
      funnelOutline,
      receiptOutline,
      arrowUpCircleOutline,
      giftOutline
    });
  }

  ngOnInit() {
    this.cargarHistorial();
  }

  ionViewWillEnter() {
    this.cargarHistorial();
  }

  cargarHistorial() {
    this.transacciones = this.usuarioService.obtenerHistorial();

    this.totalGanado = this.transacciones
      .filter(item => item.tipo === 'ingreso')
      .reduce((total, item) => total + Number(item.monto), 0);

    this.totalCanjeado = this.transacciones
      .filter(item => item.tipo !== 'ingreso')
      .reduce((total, item) => total + Number(item.monto), 0);
  }
}