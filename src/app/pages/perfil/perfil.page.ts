import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent,
  IonIcon,
  IonButton,
  IonToggle
} from '@ionic/angular/standalone';

import { Router, RouterModule } from '@angular/router';
import { addIcons } from 'ionicons';

import {
  personOutline,
  shieldCheckmarkOutline,
  notificationsOutline,
  logOutOutline,
  chevronForwardOutline,
  chevronDownOutline,
  star,
  logoWhatsapp,
  documentTextOutline,
  helpCircleOutline
} from 'ionicons/icons';

import { SupabaseService } from '../../services/supabase.service';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.page.html',
  styleUrls: ['./perfil.page.scss'],
  standalone: true,
  imports: [
    IonContent,
    IonIcon,
    IonButton,
    IonToggle,
    CommonModule,
    FormsModule,
    RouterModule
  ]
})
export class PerfilPage implements OnInit {

  usuario: any = {
    nombre: 'Cargando...',
    correo: '',
    puntos: 0,
    nivel: 'ORO'
  };

  mostrarAvatares = false;
  mostrarModalPassword = false;
  mostrarNotificaciones = false;

  avatarSeleccionado: string | null =
    localStorage.getItem('avatarSeleccionado');

  nuevaPassword = '';
  confirmarPassword = '';
  mensajePassword = '';

  alertas = {
    productos: true,
    promociones: true,
    premios: true
  };

  avatares: string[] = [
    'assets/avatars/Avatar J-Hope.png',
    'assets/avatars/Avatar Jennie Kim.png',
    'assets/avatars/Avatar Jisoo.png',
    'assets/avatars/Avatar Kim Namjoon.png',
    'assets/avatars/Avatar Kim Seok-Jin.png',
    'assets/avatars/Avatar Kim Tae Hyung.png',
    'assets/avatars/Avatar Rosé.png',
    'assets/avatars/Avatar Suga.png',
    'assets/avatars/Avatar_Lisa.png',
    'assets/avatars/Avatar Jungkook.png',
    'assets/avatars/Avattar Jimin.png'
  ];

  constructor(
    private supabaseService: SupabaseService,
    private router: Router
  ) {
    addIcons({
      personOutline,
      shieldCheckmarkOutline,
      notificationsOutline,
      logOutOutline,
      chevronForwardOutline,
      chevronDownOutline,
      star,
      logoWhatsapp,
      documentTextOutline,
      helpCircleOutline
    });
  }

  ngOnInit() {
    this.cargarPerfil();
    this.avatarSeleccionado = localStorage.getItem('avatarSeleccionado');

    const prefsGuardadas = localStorage.getItem('alertasChoayo');

    if (prefsGuardadas) {
      this.alertas = JSON.parse(prefsGuardadas);
    }
  }

  ionViewWillEnter() {
    this.cargarPerfil();
    this.avatarSeleccionado = localStorage.getItem('avatarSeleccionado');
  }

  async cargarPerfil() {
    try {
      const userAuth = await this.supabaseService.getUsuarioActual();

      if (!userAuth) {
        return;
      }

      const perfil = await this.supabaseService.getPerfilUsuario(userAuth.id);

      if (perfil) {
        this.usuario = {
          nombre: perfil.nombre,
          correo: perfil.correo_electronico,
          puntos: perfil.puntos_totales,
          nivel: 'ORO'
        };
      }
    } catch (error) {
      console.error('Error al cargar perfil:', error);
    }
  }

  seleccionarAvatar(avatar: string) {
    this.avatarSeleccionado = avatar;
    localStorage.setItem('avatarSeleccionado', avatar);
    this.mostrarAvatares = false;
  }

  subirFotoUsuario(event: Event) {
    const input = event.target as HTMLInputElement;

    if (!input.files || input.files.length === 0) {
      return;
    }

    const archivo = input.files[0];
    const lector = new FileReader();

    lector.onload = () => {
      this.avatarSeleccionado = lector.result as string;

      localStorage.setItem(
        'avatarSeleccionado',
        this.avatarSeleccionado
      );

      this.mostrarAvatares = false;
    };

    lector.readAsDataURL(archivo);
  }

  eliminarFotoPerfil() {
    localStorage.removeItem('avatarSeleccionado');
    this.avatarSeleccionado = null;
  }

  abrirWhatsApp() {
    window.open(
      'https://wa.me/51900475375?text=Hola%20CHOAYO%20STORE,%20quiero%20hacer%20una%20consulta',
      '_blank'
    );
  }

  async cerrarSesion() {
    try {
      await this.supabaseService.logout();
      this.router.navigate(['/login']);
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  }

  async cambiarContrasena() {
    if (!this.nuevaPassword || this.nuevaPassword.length < 8) {
      this.mensajePassword = 'La contraseña debe tener al menos 8 caracteres.';
      return;
    }

    const tieneLetrasYNumeros = /^(?=.*[A-Za-z])(?=.*\d).+$/;

    if (!tieneLetrasYNumeros.test(this.nuevaPassword)) {
      this.mensajePassword = 'La contraseña debe contener letras y números.';
      return;
    }

    if (this.nuevaPassword !== this.confirmarPassword) {
      this.mensajePassword = 'Las contraseñas no coinciden.';
      return;
    }

    this.mensajePassword = 'Actualizando...';

    const result = await this.supabaseService.actualizarPassword(
      this.nuevaPassword
    );

    if (result?.error) {
      this.mensajePassword = 'Error al actualizar. Intenta de nuevo.';
    } else {
      this.mensajePassword = '¡Contraseña actualizada con éxito!';

      setTimeout(() => {
        this.cerrarModalPassword();
      }, 2000);
    }
  }

  cerrarModalPassword() {
    this.mostrarModalPassword = false;
    this.nuevaPassword = '';
    this.confirmarPassword = '';
    this.mensajePassword = '';
  }

  guardarPreferenciasNotificaciones() {
    localStorage.setItem(
      'alertasChoayo',
      JSON.stringify(this.alertas)
    );
  }
}