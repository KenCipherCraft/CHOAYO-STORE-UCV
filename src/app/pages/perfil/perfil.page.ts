import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonContent, IonIcon, IonButton } from '@ionic/angular/standalone';
import { Router, RouterModule } from '@angular/router'; // <-- Módulo de navegación añadido
import { addIcons } from 'ionicons';
import { personOutline, shieldCheckmarkOutline, notificationsOutline, logOutOutline, chevronForwardOutline, star } from 'ionicons/icons';
import { UsuarioService } from '../../services/usuario.service';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.page.html',
  styleUrls: ['./perfil.page.scss'],
  standalone: true,
  imports: [IonContent, IonIcon, IonButton, CommonModule, RouterModule] // <-- Añadido aquí también
})
export class PerfilPage implements OnInit {
  
  usuario: any = { nombre: '', correo: '', puntos: 0, nivel: '' };

  constructor(
    private usuarioService: UsuarioService,
    private router: Router
  ) {
    addIcons({ personOutline, shieldCheckmarkOutline, notificationsOutline, logOutOutline, chevronForwardOutline, star });
  }

  ngOnInit() {
    this.usuario = this.usuarioService.obtenerDatos();
  }

  ionViewWillEnter() {
    this.usuario = this.usuarioService.obtenerDatos();
  }

  cerrarSesion() {
    this.router.navigate(['/login']);
  }
}