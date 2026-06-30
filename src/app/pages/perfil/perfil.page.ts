import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonContent, IonIcon, IonButton } from '@ionic/angular/standalone';
import { Router, RouterModule } from '@angular/router';
import { addIcons } from 'ionicons';

import {
  personOutline,
  shieldCheckmarkOutline,
  notificationsOutline,
  logOutOutline,
  chevronForwardOutline,
  star,
  logoWhatsapp,
  trophyOutline
} from 'ionicons/icons';

import { UsuarioService } from '../../services/usuario.service';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.page.html',
  styleUrls: ['./perfil.page.scss'],
  standalone: true,
  imports: [
    IonContent,
    IonIcon,
    IonButton,
    CommonModule,
    RouterModule
  ]
})
export class PerfilPage implements OnInit {

  usuario: any = {
    nombre: '',
    correo: '',
    puntos: 0,
    nivel: ''
  };

  infoNivel: any = {
    nivelActual: '',
    siguienteNivel: '',
    puntosActuales: 0,
    meta: 0,
    faltan: 0,
    progreso: 0
  };

  logros: any[] = [];

  mostrarAvatares = false;

  avatarSeleccionado: string | null =
    localStorage.getItem('avatarSeleccionado');

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
    private usuarioService: UsuarioService,
    private router: Router
  ) {

    addIcons({
      personOutline,
      shieldCheckmarkOutline,
      notificationsOutline,
      logOutOutline,
      chevronForwardOutline,
      star,
      logoWhatsapp,
      trophyOutline
    });

  }

  ngOnInit() {
    this.cargarDatosPerfil();
  }

  ionViewWillEnter() {
    this.cargarDatosPerfil();
  }

  cargarDatosPerfil() {
    this.usuario = this.usuarioService.obtenerDatos();
    this.infoNivel = this.usuarioService.obtenerInfoNivel();
    this.logros = this.usuarioService.obtenerLogros();

    this.avatarSeleccionado =
      localStorage.getItem('avatarSeleccionado');
  }

  seleccionarAvatar(avatar: string) {
    this.avatarSeleccionado = avatar;

    localStorage.setItem(
      'avatarSeleccionado',
      avatar
    );

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
      this.avatarSeleccionado =
        lector.result as string;

      localStorage.setItem(
        'avatarSeleccionado',
        this.avatarSeleccionado
      );

      this.mostrarAvatares = false;
    };

    lector.readAsDataURL(archivo);
  }

  eliminarFotoPerfil() {
    localStorage.removeItem(
      'avatarSeleccionado'
    );

    this.avatarSeleccionado = null;
  }

  abrirWhatsApp() {
    window.open(
      'https://wa.me/51900475375?text=Hola%20CHOAYO%20STORE,%20quiero%20hacer%20una%20consulta',
      '_blank'
    );
  }

  cerrarSesion() {
    this.router.navigate(['/login']);
  }

}