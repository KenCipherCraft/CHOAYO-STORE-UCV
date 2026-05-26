import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonContent, IonIcon, IonButton } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { personOutline, mailOutline, shieldCheckmarkOutline, notificationsOutline, logOutOutline, chevronForwardOutline, star } from 'ionicons/icons';
import { UsuarioService } from '../../services/usuario.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.page.html',
  styleUrls: ['./perfil.page.scss'],
  standalone: true,
  imports: [IonContent, IonIcon, IonButton, CommonModule]
})
export class PerfilPage {
  
  usuario: any = { nombre: '', correo: '', puntos: 0, nivel: '' };

  constructor(
    private usuarioService: UsuarioService,
    private router: Router
  ) {
    addIcons({ personOutline, mailOutline, shieldCheckmarkOutline, notificationsOutline, logOutOutline, chevronForwardOutline, star });
  }

  ionViewWillEnter() {
    this.usuario = this.usuarioService.obtenerDatos();
  }

  cerrarSesion() {
    // Cuando conectemos PostgreSQL, aquí eliminaremos el token de sesión
    this.router.navigate(['/login']);
  }
}