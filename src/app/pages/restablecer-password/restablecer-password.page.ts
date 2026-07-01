import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonIcon } from '@ionic/angular/standalone';
import { Router, RouterModule } from '@angular/router';
import { addIcons } from 'ionicons';
import { lockClosedOutline } from 'ionicons/icons';
import { SupabaseService } from '../../services/supabase.service';

@Component({
  selector: 'app-restablecer-password',
  templateUrl: './restablecer-password.page.html',
  styleUrls: ['./restablecer-password.page.scss'],
  standalone: true,
  imports: [IonContent, IonIcon, CommonModule, RouterModule, FormsModule]
})
export class RestablecerPasswordPage implements OnInit {

  nuevaPassword: string = '';
  confirmarPassword: string = '';
  mensaje: string = '';
  cargando: boolean = false;
  exito: boolean = false;

  constructor(
    private supabaseService: SupabaseService,
    private router: Router
  ) {
    addIcons({ lockClosedOutline });
  }

  ngOnInit() {
    // Supabase detecta automáticamente el token de recuperación en la URL
    // (detectSessionInUrl: true por defecto) y crea una sesión temporal.
  }

  async guardarNuevaPassword() {
    this.mensaje = '';

    if (this.nuevaPassword.length < 6) {
      this.mensaje = 'La contraseña debe tener al menos 6 caracteres.';
      return;
    }
    if (this.nuevaPassword !== this.confirmarPassword) {
      this.mensaje = 'Las contraseñas no coinciden.';
      return;
    }

    this.cargando = true;
    const resultado = await this.supabaseService.actualizarPassword(this.nuevaPassword);
    this.cargando = false;

    if (resultado.error) {
      this.mensaje = 'El enlace expiró o no es válido. Solicita uno nuevo desde el login.';
    } else {
      this.exito = true;
      this.mensaje = '¡Contraseña actualizada! Redirigiendo al login...';
      setTimeout(() => {
        this.router.navigate(['/login']);
      }, 2500);
    }
  }
}