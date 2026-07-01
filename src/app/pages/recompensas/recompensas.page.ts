import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonContent, IonIcon, IonButton, IonModal } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { checkmarkCircleOutline, alertCircleOutline, star } from 'ionicons/icons'; // Enlazado 'star'
import { SupabaseService } from '../../services/supabase.service';
import { jsPDF } from 'jspdf';

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
          puntos: perfil.puntos_totales 
        };
      }
    }

    // 2. Cargar recompensas desde Supabase
    const data = await this.supabaseService.getRecompensas();
    this.catalogo = data.map((item: any) => {
      // Guardamos el ID real de la base de datos
      const idRecompensa = item.identificacion || item.id;

      return {
        id: idRecompensa,
        nombre: item.nombre,
        descripcion: item.descripcion,
        costo: item.puntos_necesarios || item.costo,
        existencias: item.existencias,
        
        // === ASIGNACIÓN LOCAL DIRECTA POR CÓDIGO ===
        imagen: this.obtenerRutaLocalImagen(item.nombre),
        
        colorClass: item.color_class || 'cafe'
      };
    });
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
      // 4. Actualizar la vista local para que el HTML cambie al instante
      this.usuario.puntos = nuevosPuntos;

      // === INSERTA ESTA LÍNEA AQUÍ PARA DISPARAR EL PDF ===
      this.generarComprobantePDF(item);

      // 5. Mostrar modal de éxito
      this.modalData = {
        titulo: '¡Canje Exitoso!',
        mensaje: `Has canjeado ${item.nombre}. Se descontaron ${item.costo} pts.`,
        icono: 'checkmark-circle-outline',
        color: 'success'
      };
      this.isModalOpen = true;

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
  obtenerRutaLocalImagen(nombreRecompensa: string): string {
    if (!nombreRecompensa) return 'assets/recompensas/cafe.png';

    // 1. Convertimos a minúsculas, quitamos espacios y removemos acentos automáticamente
    const nombreLimpio = nombreRecompensa
      .toLowerCase()
      .normalize("NFD") // Separa las letras de los acentos (ej: "é" se convierte en "e" + "´")
      .replace(/[\u0300-\u036f]/g, "") // Elimina los acentos flotantes
      .trim();

    // 2. Emparejamiento dinámico inteligente según tus archivos reales:
    if (nombreLimpio.includes('descuento')) {
      return 'assets/recompensas/descuento.png'; // Hace match con descuento.png
    }
    if (nombreLimpio.includes('cupon') || nombreLimpio.includes('s/')) {
      return 'assets/recompensas/cupon.png'; // Hace match con cupon.png
    }
    if (nombreLimpio.includes('cafe')) {
      return 'assets/recompensas/cafe.png'; // Hace match con cafe.png
    }
    if (nombreLimpio.includes('cine') || nombreLimpio.includes('entrada')) {
      return 'assets/recompensas/cine.png'; // Hace match con cine.png
    }
    if (nombreLimpio.includes('polo') || nombreLimpio.includes('camiseta')) {
      return 'assets/recompensas/polo.png'; // Hace match con polo.png
    }

    // Si agregan algo totalmente nuevo (ej: "Llavero"), usa una imagen genérica mientras tanto
    return 'assets/recompensas/cafe.png'; 
  }
  generarComprobantePDF(item: any) {
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: [80, 150] // Formato tipo ticket de boleta móvil (80mm x 150mm)
    });

    // --- DISEÑO Y ESTILOS ---
    // Fondo de encabezado Morado / Azul institucional
    doc.setFillColor(99, 102, 241); 
    doc.rect(0, 0, 80, 30, 'F');

    // Texto del encabezado (Blanco)
    doc.setTextColor(255, 255, 255);
    doc.setFont('Helvetica', 'bold');
    doc.setFontSize(16);
    doc.text('CHOAYO STORE', 40, 12, { align: 'center' });
    
    doc.setFont('Helvetica', 'normal');
    doc.setFontSize(9);
    doc.text('¡Canje Exitoso!', 40, 18, { align: 'center' });
    doc.text('LoyalApp Fidelización', 40, 23, { align: 'center' });

    // Cuerpo del Ticket (Texto Oscuro)
    doc.setTextColor(40, 40, 40);
    
    // Fecha y hora del sistema
    const fechaActual = new Date().toLocaleString('es-PE', { timeZone: 'America/Lima' });
    doc.setFontSize(8);
    doc.text(`Fecha: ${fechaActual}`, 6, 38);
    doc.text(`Cliente: ${this.usuario?.nombre || 'Usuario LoyalApp'}`, 6, 43);

    // Línea divisoria decorativa
    doc.setDrawColor(200, 200, 200);
    doc.setLineWidth(0.3);
    doc.line(5, 48, 75, 48);

    // Detalles del Premio Canjeado
    doc.setFont('Helvetica', 'bold');
    doc.setFontSize(11);
    doc.text('DETALLE DEL CANJE', 6, 56);

    doc.setFont('Helvetica', 'normal');
    doc.setFontSize(10);
    doc.text(`Premio:`, 6, 65);
    doc.setFont('Helvetica', 'bold');
    doc.text(`${item.nombre}`, 25, 65); // Muestra el nombre de la recompensa

    doc.setFont('Helvetica', 'normal');
    doc.text(`Costo:`, 6, 73);
    doc.setFont('Helvetica', 'bold');
    doc.setTextColor(239, 68, 68); // Color rojo/alerta para el descuento de puntos
    doc.text(`-${item.costo} puntos`, 25, 73);

    doc.setTextColor(40, 40, 40);
    doc.setFont('Helvetica', 'normal');
    doc.text(`Saldo restante:`, 6, 81);
    doc.text(`${this.usuario.puntos} pts`, 32, 81);

    // Línea divisoria inferior
    doc.setDrawColor(200, 200, 200);
    doc.line(5, 88, 75, 88);

    // Mensaje legal / Instrucciones de la Tienda
    doc.setFont('Helvetica', 'oblique');
    doc.setFontSize(8);
    doc.setTextColor(100, 100, 100);
    
    // Texto multilínea automatizado para que no se desborde del ticket
    const instrucciones = doc.splitTextToSize(
      'Muestra este código QR o comprobante digital en caja para reclamar tu premio físico en tienda. Válido por 30 días.', 
      68
    );
    doc.text(instrucciones, 6, 96);

    // Código de Validación Único simulado para control de la tienda
    const codigoValidacion = 'CHY-' + Math.floor(100000 + Math.random() * 900000);
    doc.setFont('Helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(99, 102, 241);
    doc.text(`CÓDIGO: ${codigoValidacion}`, 40, 125, { align: 'center' });

    // Pie de página estético
    doc.setFont('Helvetica', 'normal');
    doc.setFontSize(7);
    doc.setTextColor(150, 150, 150);
    doc.text('Gracias por tu preferencia', 40, 142, { align: 'center' });

    // --- DESCARGA AUTOMÁTICA ---
    // Limpiamos el nombre del archivo para guardarlo
    const nombreArchivo = `Comprobante_${item.nombre.replace(/\s+/g, '_')}.pdf`;
    doc.save(nombreArchivo);
  }
}