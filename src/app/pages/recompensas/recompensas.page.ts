import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonContent, IonIcon, IonButton, IonModal } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { checkmarkCircleOutline, alertCircleOutline, star } from 'ionicons/icons'; // Enlazado 'star'
import { SupabaseService } from '../../services/supabase.service';

@Component({
  selector: 'app-recompensas',
  templateUrl: './recompensas.page.html',
  styleUrls: ['./recompensas.page.scss'],
  standalone: true,
  imports: [IonContent, IonIcon, IonButton, IonModal, CommonModule]
})
export class RecompensasPage implements OnInit {

  // Cambiado a 'puntos' para que haga match perfecto con tu HTML
  usuario: any = { nombre: '', puntos: 0 }; 
  isModalOpen = false;
  modalData = { titulo: '', mensaje: '', icono: '', color: '' };
  catalogo: any[] = [];

  constructor(private supabaseService: SupabaseService) {
    // Registramos los 3 íconos que usa tu HTML
    addIcons({ checkmarkCircleOutline, alertCircleOutline, star });
  }

  ngOnInit() {
    this.cargarDatos();
  }

  ionViewWillEnter() {
    this.cargarDatos();
  }

  async cargarDatos() {
    // 1. Obtener usuario logueado de Supabase
    const userAuth = await this.supabaseService.getUsuarioActual();
    if (userAuth) {
      const perfil = await this.supabaseService.getPerfilUsuario(userAuth.id);
      if (perfil) {
        this.usuario = {
          nombre: perfil.nombre,
          puntos: perfil.puntos_totales // Mapeamos puntos_totales de la BD a 'puntos' del HTML
        };
      }
    }

    // 2. Cargar recompensas desde Supabase
    const data = await this.supabaseService.getRecompensas();
    this.catalogo = data.map((item: any) => ({
      id: item.identificacion || item.id, // Por si acaso se llama id o identificacion
      nombre: item.nombre,
      descripcion: item.descripcion,
      costo: item.puntos_necesarios || item.costo,
      existencias: item.existencias,
      imagen: item.imagen || 'assets/recompensas/default.png',
      colorClass: item.color_class || 'cafe'
    }));
  }

  // Función matemática para que tu barra de progreso se pinte correctamente
  calcularProgreso(costo: number): number {
    if (!costo || !this.usuario.puntos) return 0;
    const progreso = (this.usuario.puntos / costo) * 100;
    return Math.min(progreso, 100); // Evita que la barra se pase del 100%
  }

  async confirmarCanje(item: any) {
    // 1. Verificar puntos suficientes (usando la variable 'puntos' de tu HTML)
    if (this.usuario.puntos < item.costo) {
      this.modalData = {
        titulo: 'Puntos Insuficientes',
        mensaje: `Necesitas ${item.costo - this.usuario.puntos} puntos más para canjear ${item.nombre}.`,
        icono: 'alert-circle-outline',
        color: 'danger'
      };
      this.isModalOpen = true;
      return;
    }

    // 2. Verificar existencias de la recompensa
    if (item.existencias <= 0) {
      this.modalData = {
        titulo: 'Sin existencias',
        mensaje: `Lo sentimos, ${item.nombre} está agotado por ahora.`,
        icono: 'alert-circle-outline',
        color: 'danger'
      };
      this.isModalOpen = true;
      return;
    }

    // 3. Obtener el usuario autenticado
    const userAuth = await this.supabaseService.getUsuarioActual();
    if (!userAuth) return;

    // Calculamos cómo quedará el saldo (para la vista y la BD)
    const nuevosPuntos = this.usuario.puntos - item.costo;

    try {
      // --- INICIO DE TRANSACCIONES CON SUPABASE ---

      // A. Descontar puntos en la tabla 'usuarios' 
      // (Aquí usamos 'puntos_totales' porque así se llama tu columna real en la BD)
      await this.supabaseService.actualizar('usuarios', userAuth.id, {
        puntos_totales: nuevosPuntos 
      });

      // B. Registrar el canje en la tabla 'canjes'
      await this.supabaseService.insertar('canjes', {
        usuario_id: userAuth.id,
        recompensa_id: item.id, // Tu mapeo previo ya guardó aquí la 'identificacion'
        estado: 'completado'
      });

      // C. Registrar el movimiento en 'historico_puntos'
      await this.supabaseService.insertar('historico_puntos', {
        usuario_id: userAuth.id,
        tipo: 'canjeado',
        puntos: -item.costo,
        descripcion: `Canje: ${item.nombre}`
      });

      // D. Restar 1 a las existencias en la tabla 'recompensas'
      await this.supabaseService.actualizar('recompensas', item.id, {
        existencias: item.existencias - 1
      });

      // --- FIN DE TRANSACCIONES ---

      // 4. Actualizar la vista local para que el HTML cambie al instante
      this.usuario.puntos = nuevosPuntos;

      // 5. Mostrar modal de éxito
      this.modalData = {
        titulo: '¡Canje Exitoso!',
        mensaje: `Has canjeado ${item.nombre}. Se descontaron ${item.costo} pts.`,
        icono: 'checkmark-circle-outline',
        color: 'success'
      };
      this.isModalOpen = true;

      // 6. Recargar catálogo para actualizar visualmente las existencias
      await this.cargarDatos();
      

    } catch (error) {
      // Por si falla el internet o algo en Supabase durante el proceso
      console.error('Error durante el canje:', error);
      this.modalData = {
        titulo: 'Error',
        mensaje: 'Hubo un problema al procesar el canje. Inténtalo de nuevo.',
        icono: 'alert-circle-outline',
        color: 'danger'
      };
      this.isModalOpen = true;
    }
    
  }
  cerrarModal() {
    this.isModalOpen = false; // O el nombre de la variable que uses para abrir el modal
  }
}