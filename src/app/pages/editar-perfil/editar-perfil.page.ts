import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // <-- IMPORTANTE para capturar los textos
import { IonContent, IonIcon } from '@ionic/angular/standalone';
import { Router, RouterModule } from '@angular/router';
import { addIcons } from 'ionicons';
import { arrowBackOutline, cameraOutline, checkmarkCircleOutline } from 'ionicons/icons';

// Traemos a Supabase
import { SupabaseService } from '../../services/supabase.service';

@Component({
  selector: 'app-editar-perfil',
  templateUrl: './editar-perfil.page.html',
  styleUrls: ['./editar-perfil.page.scss'],
  standalone: true,
  // No olvides agregar FormsModule en los imports
  imports: [IonContent, IonIcon, CommonModule, RouterModule, FormsModule]
})
export class EditarPerfilPage implements OnInit {
  
  usuario: any = { nombre: '', correo: '', telefono: '' };
  userAuthId: string = ''; // Para saber a quién actualizar
  
  guardando: boolean = false;
  guardadoExitoso: boolean = false;

  constructor(
    private router: Router, 
    private supabaseService: SupabaseService // Inyectamos servicio real
  ) {
    addIcons({ arrowBackOutline, cameraOutline, checkmarkCircleOutline });
  }

  ngOnInit() {
    this.cargarDatos();
  }

  async cargarDatos() {
    // 1. Obtenemos el usuario autenticado
    const userAuth = await this.supabaseService.getUsuarioActual();
    if (userAuth) {
      this.userAuthId = userAuth.id;
      
      // 2. Traemos su información de la tabla
      const perfil = await this.supabaseService.getPerfilUsuario(userAuth.id);
      if (perfil) {
        this.usuario = {
          nombre: perfil.nombre || '',
          correo: perfil.correo_electronico || '',
          telefono: perfil.telefono || '' // Asumiendo que tienes esta columna en BD
        };
      }
    }
  }

  volver() {
    this.router.navigate(['/tabs/perfil']);
  }

  async guardarCambios() {
    if (!this.userAuthId) return;

    this.guardando = true;
    
    try {
      // 3. Enviamos los nuevos datos a Supabase
      await this.supabaseService.actualizar('usuarios', this.userAuthId, {
        nombre: this.usuario.nombre,
        telefono: this.usuario.telefono
      });

      // 4. Mantenemos tu genial animación de éxito
      this.guardando = false;
      this.guardadoExitoso = true;
      
      setTimeout(() => {
        this.volver();
      }, 2000);

    } catch (error) {
      console.error('Error al guardar el perfil:', error);
      this.guardando = false;
    }
  }
}