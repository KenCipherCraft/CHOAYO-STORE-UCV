import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonContent, IonIcon } from '@ionic/angular/standalone';
import { Router, RouterModule } from '@angular/router';
import { addIcons } from 'ionicons';
import { arrowBackOutline, cameraOutline, checkmarkCircleOutline } from 'ionicons/icons';
import { UsuarioService } from '../../services/usuario.service';

@Component({
  selector: 'app-editar-perfil',
  templateUrl: './editar-perfil.page.html',
  styleUrls: ['./editar-perfil.page.scss'],
  standalone: true,
  imports: [IonContent, IonIcon, CommonModule, RouterModule]
})
export class EditarPerfilPage implements OnInit {
  
  usuario: any = { nombre: '', correo: '' };
  
  // Variables para simular que guarda los datos
  guardando: boolean = false;
  guardadoExitoso: boolean = false;

  constructor(private router: Router, private usuarioService: UsuarioService) {
    addIcons({ arrowBackOutline, cameraOutline, checkmarkCircleOutline });
  }

  ngOnInit() {
    // Cargamos los datos actuales del usuario al abrir la pantalla
    this.usuario = { ...this.usuarioService.obtenerDatos() }; 
  }

  volver() {
    this.router.navigate(['/tabs/perfil']);
  }

  simularGuardado() {
    this.guardando = true;
    
    // Simulamos un retraso de 1.5 segundos como si viajara a Internet
    setTimeout(() => {
      this.guardando = false;
      this.guardadoExitoso = true;
      
      // Regresamos al perfil después de 2 segundos de mostrar el mensaje de éxito
      setTimeout(() => {
        this.volver();
      }, 2000);
    }, 1500);
  }
}