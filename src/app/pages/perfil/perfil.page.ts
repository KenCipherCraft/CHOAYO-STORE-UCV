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
  logoWhatsapp
} from 'ionicons/icons';

// 1. Cambiamos el servicio local por el real de Supabase
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
    CommonModule,
    RouterModule
  ]
})
export class PerfilPage implements OnInit {

  // Inicializamos con valores por defecto mientras carga
  usuario: any = {
    nombre: 'Cargando...',
    correo: '',
    puntos: 0,
    nivel: 'ORO'
  };

  mostrarAvatares = false;
  avatarSeleccionado: string | null = localStorage.getItem('avatarSeleccionado');

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
    private supabaseService: SupabaseService, // 2. Inyectamos Supabase
    private router: Router
  ) {
    addIcons({
      personOutline,
      shieldCheckmarkOutline,
      notificationsOutline,
      logOutOutline,
      chevronForwardOutline,
      star,
      logoWhatsapp
    });
  }

  ngOnInit() {
    this.cargarPerfil();
    this.avatarSeleccionado = localStorage.getItem('avatarSeleccionado');
  }

  ionViewWillEnter() {
    this.cargarPerfil();
    this.avatarSeleccionado = localStorage.getItem('avatarSeleccionado');
  }

  // 3. Método para jalar los datos reales de Supabase
  async cargarPerfil() {
    try {
      const userAuth = await this.supabaseService.getUsuarioActual();
      if (!userAuth) return;

      const perfil = await this.supabaseService.getPerfilUsuario(userAuth.id);
      
      if (perfil) {
        // Mapeamos los nombres de la BD a los nombres que tu HTML ya usa
        this.usuario = {
          nombre: perfil.nombre,
          correo: perfil.correo_electronico, // BD -> HTML
          puntos: perfil.puntos_totales,     // BD -> HTML
          nivel: 'ORO' // Puedes añadir lógica de niveles a la BD en el futuro
        };
      }
    } catch (error) {
      console.error('Error al cargar perfil:', error);
    }
  }

  // Los métodos de avatares se mantienen intactos usando localStorage
  seleccionarAvatar(avatar: string) {
    this.avatarSeleccionado = avatar;
    localStorage.setItem('avatarSeleccionado', avatar);
    this.mostrarAvatares = false;
  }

  subirFotoUsuario(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;

    const archivo = input.files[0];
    const lector = new FileReader();

    lector.onload = () => {
      this.avatarSeleccionado = lector.result as string;
      localStorage.setItem('avatarSeleccionado', this.avatarSeleccionado);
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

  // 4. Cierre de sesión real conectado a Supabase
  async cerrarSesion() {
    try {
      await this.supabaseService.logout(); // Destruye la sesión en la BD/Caché
      this.router.navigate(['/login']);    // Redirige a la pantalla de ingreso
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  }
}