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

// 1. Quitamos UsuarioService y traemos el real:
import { SupabaseService } from '../../services/supabase.service';
import { Router, RouterModule } from '@angular/router';

@Component({
  
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
    private supabaseService: SupabaseService, // 2. Inyectamos Supabase
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

  // 3. Volvemos la función asíncrona para que espere a la base de datos
  async simularEscaneo() {
    // Genera entre 100 y 500 puntos aleatorios
    this.puntosGanados = Math.floor(Math.random() * (500 - 100 + 1) + 100);

    try {
      // A. Obtener el usuario actual
      const userAuth = await this.supabaseService.getUsuarioActual();
      if (!userAuth) return;

      // B. Obtener los puntos que tiene actualmente en la BD
      const perfil = await this.supabaseService.getPerfilUsuario(userAuth.id);
      if (!perfil) return;

      // C. Calculamos el nuevo total
      const nuevosPuntos = perfil.puntos_totales + this.puntosGanados;

      // D. Guardamos el nuevo total en la tabla 'usuarios'
      await this.supabaseService.actualizar('usuarios', userAuth.id, {
        puntos_totales: nuevosPuntos
      });

      // E. Guardamos el movimiento en 'historico_puntos'
      await this.supabaseService.insertar('historico_puntos', {
        usuario_id: userAuth.id,
        tipo: 'ganado', // Para que el Historial lo pinte de verde
        puntos: this.puntosGanados,
        descripcion: 'Escaneo de código QR en tienda'
      });

      // F. Abrimos el modal de éxito de tu HTML
      this.isModalOpen = true;

    } catch (error) {
      console.error('Error al guardar los puntos en Supabase:', error);
    }
  }

  cerrarYVolver() {
    this.isModalOpen = false;

    setTimeout(() => {
      this.router.navigate(['/tabs/home']);
    }, 300);
  }
}