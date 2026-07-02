import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonIcon, IonButton, IonModal } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  checkmarkCircleOutline,
  alertCircleOutline,
  star,
  searchOutline,
  closeOutline
} from 'ionicons/icons';
import { SupabaseService } from '../../services/supabase.service';
import { jsPDF } from 'jspdf';

@Component({
  selector: 'app-recompensas',
  templateUrl: './recompensas.page.html',
  styleUrls: ['./recompensas.page.scss'],
  standalone: true,
  imports: [
    IonContent,
    IonIcon,
    IonButton,
    IonModal,
    CommonModule,
    FormsModule
  ]
})
export class RecompensasPage implements OnInit {

  usuario: any = {
    nombre: '',
    puntos: 0
  };

  isModalOpen = false;
  isDetalleOpen = false;
  mostrarCelebracion = false;

  productoSeleccionado: any = null;

  modalData = {
    titulo: '',
    mensaje: '',
    icono: '',
    color: ''
  };

  textoBusqueda = '';
  categoriaActiva = 'Todos';

  categorias = [
    'Todos',
    'Bebidas',
    'Dulces',
    'Instantáneos',
    'Snacks',
    'Sorpresas'
  ];

  catalogo: any[] = [];
  catalogoFiltrado: any[] = [];

  constructor(private supabaseService: SupabaseService) {
    addIcons({
      checkmarkCircleOutline,
      alertCircleOutline,
      star,
      searchOutline,
      closeOutline
    });
  }

  ngOnInit() {
    this.cargarDatos();
  }

  ionViewWillEnter() {
    this.cargarDatos();
  }

  async cargarDatos() {
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

    this.catalogo = [
      {
        id: 1,
        nombre: 'Café Coreano',
        descripcion: 'Café coreano instantáneo ideal para disfrutar en casa.',
        costo: 150,
        categoria: 'Bebidas',
        existencias: 20,
        imagen: 'assets/recompensas/bebidas/Café Coreano.jpg',
        colorClass: 'bebidas'
      },
      {
        id: 2,
        nombre: 'Milkis',
        descripcion: 'Bebida coreana dulce y refrescante.',
        costo: 200,
        categoria: 'Bebidas',
        existencias: 20,
        imagen: 'assets/recompensas/bebidas/Milkis.jpg',
        colorClass: 'bebidas'
      },
      {
        id: 3,
        nombre: 'Caramelos Coreanos',
        descripcion: 'Dulces coreanos surtidos para compartir.',
        costo: 180,
        categoria: 'Dulces',
        existencias: 20,
        imagen: 'assets/recompensas/dulces/Caramelos coreanos.png',
        colorClass: 'dulces'
      },
      {
        id: 4,
        nombre: 'Gomitas Coreanas',
        descripcion: 'Gomitas coreanas de sabores frutales.',
        costo: 250,
        categoria: 'Dulces',
        existencias: 20,
        imagen: 'assets/recompensas/dulces/Gomitas Coreanas.png',
        colorClass: 'dulces'
      },
      {
        id: 5,
        nombre: 'KitKat Matcha',
        descripcion: 'Chocolate con sabor a matcha estilo asiático.',
        costo: 320,
        categoria: 'Dulces',
        existencias: 20,
        imagen: 'assets/recompensas/dulces/KitKat Matcha.jpg',
        colorClass: 'dulces'
      },
      {
        id: 6,
        nombre: 'Mochi',
        descripcion: 'Postre coreano suave y dulce.',
        costo: 350,
        categoria: 'Dulces',
        existencias: 20,
        imagen: 'assets/recompensas/dulces/mochi.jpg',
        colorClass: 'dulces'
      },
      {
        id: 7,
        nombre: 'Jin Ramen',
        descripcion: 'Ramen coreano instantáneo.',
        costo: 500,
        categoria: 'Instantáneos',
        existencias: 20,
        imagen: 'assets/recompensas/instantaneos/Jin Ramen.jpg',
        colorClass: 'instantaneos'
      },
      {
        id: 8,
        nombre: 'Ramen Samyang',
        descripcion: 'Ramen coreano picante Samyang.',
        costo: 650,
        categoria: 'Instantáneos',
        existencias: 20,
        imagen: 'assets/recompensas/instantaneos/Ramen Samyang.jpg',
        colorClass: 'instantaneos'
      },
      {
        id: 9,
        nombre: 'Shin Ramyun',
        descripcion: 'Ramen coreano clásico y picante.',
        costo: 600,
        categoria: 'Instantáneos',
        existencias: 20,
        imagen: 'assets/recompensas/instantaneos/Shin Ramyun.jpg',
        colorClass: 'instantaneos'
      },
      {
        id: 10,
        nombre: 'ChocoPie',
        descripcion: 'Snack coreano relleno de malvavisco.',
        costo: 220,
        categoria: 'Snacks',
        existencias: 20,
        imagen: 'assets/recompensas/snacks/ChocoPie.png',
        colorClass: 'snacks'
      },
      {
        id: 11,
        nombre: 'Honey Butter Chips',
        descripcion: 'Papas coreanas dulces y saladas.',
        costo: 350,
        categoria: 'Snacks',
        existencias: 20,
        imagen: 'assets/recompensas/snacks/Honey Butter Chips.png',
        colorClass: 'snacks'
      },
      {
        id: 12,
        nombre: 'Oreo Coreano',
        descripcion: 'Galletas coreanas tipo Oreo.',
        costo: 250,
        categoria: 'Snacks',
        existencias: 20,
        imagen: 'assets/recompensas/snacks/Oreo.png',
        colorClass: 'snacks'
      },
      {
        id: 13,
        nombre: 'Turtle Chips',
        descripcion: 'Snack coreano crujiente.',
        costo: 320,
        categoria: 'Snacks',
        existencias: 20,
        imagen: 'assets/recompensas/snacks/Turtle Chips.png',
        colorClass: 'snacks'
      },
      {
        id: 14,
        nombre: 'Caja Sorpresa',
        descripcion: 'Caja sorpresa con dulces coreanos variados.',
        costo: 1800,
        categoria: 'Sorpresas',
        existencias: 10,
        imagen: 'assets/recompensas/sorpresas/Caja Sorpresa.png',
        colorClass: 'sorpresas'
      },
      {
        id: 15,
        nombre: 'Cupón S/5',
        descripcion: 'Cupón de descuento para tus próximas compras.',
        costo: 600,
        categoria: 'Sorpresas',
        existencias: 50,
        imagen: 'assets/recompensas/sorpresas/Cupon 5.png',
        colorClass: 'sorpresas'
      },
      {
        id: 16,
        nombre: 'Cupón S/10',
        descripcion: 'Cupón especial de descuento para CHOAYO STORE.',
        costo: 1000,
        categoria: 'Sorpresas',
        existencias: 40,
        imagen: 'assets/recompensas/sorpresas/Cupon de 10.png',
        colorClass: 'sorpresas'
      },
      {
        id: 17,
        nombre: 'Gift Box Premium',
        descripcion: 'Caja premium con selección exclusiva de dulces coreanos.',
        costo: 2500,
        categoria: 'Sorpresas',
        existencias: 5,
        imagen: 'assets/recompensas/sorpresas/Gift Box Premium.png',
        colorClass: 'sorpresas'
      }
    ];

    this.aplicarFiltros();
  }

  cambiarCategoria(categoria: string) {
    this.categoriaActiva = categoria;
    this.aplicarFiltros();
  }

  aplicarFiltros() {
    let lista = [...this.catalogo];

    if (this.categoriaActiva !== 'Todos') {
      lista = lista.filter(item => item.categoria === this.categoriaActiva);
    }

    if (this.textoBusqueda.trim() !== '') {
      const texto = this.textoBusqueda.toLowerCase().trim();

      lista = lista.filter(item =>
        item.nombre.toLowerCase().includes(texto) ||
        item.descripcion.toLowerCase().includes(texto) ||
        item.categoria.toLowerCase().includes(texto)
      );
    }

    this.catalogoFiltrado = lista;
  }

  limpiarBusqueda() {
    this.textoBusqueda = '';
    this.aplicarFiltros();
  }

  calcularProgreso(costo: number): number {
    if (!costo || !this.usuario.puntos) return 0;

    const progreso = (this.usuario.puntos / costo) * 100;
    return Math.min(progreso, 100);
  }

  abrirDetalle(item: any) {
    this.productoSeleccionado = item;
    this.isDetalleOpen = true;
  }

  cerrarDetalle() {
    this.isDetalleOpen = false;
    this.productoSeleccionado = null;
  }

  canjearDesdeDetalle() {
    if (!this.productoSeleccionado) return;

    const item = this.productoSeleccionado;
    this.cerrarDetalle();
    this.confirmarCanje(item);
  }

  mostrarConfeti() {
    this.mostrarCelebracion = true;

    setTimeout(() => {
      this.mostrarCelebracion = false;
    }, 1800);
  }

  async confirmarCanje(item: any) {
    if (this.usuario.puntos < item.costo) {
      this.modalData = {
        titulo: 'Puntos insuficientes',
        mensaje: `Necesitas ${item.costo - this.usuario.puntos} puntos más para canjear ${item.nombre}.`,
        icono: 'alert-circle-outline',
        color: 'danger'
      };

      this.isModalOpen = true;
      return;
    }

    if (item.existencias <= 0) {
      this.modalData = {
        titulo: 'Sin existencias',
        mensaje: `${item.nombre} está agotado por ahora.`,
        icono: 'alert-circle-outline',
        color: 'danger'
      };

      this.isModalOpen = true;
      return;
    }

    const userAuth = await this.supabaseService.getUsuarioActual();

    if (!userAuth) {
      return;
    }

    const nuevosPuntos = this.usuario.puntos - item.costo;

    try {
      await this.supabaseService.actualizar('usuarios', userAuth.id, {
        puntos_totales: nuevosPuntos
      });

      await this.supabaseService.insertar('canjes', {
        usuario_id: userAuth.id,
        recompensa_id: item.id,
        estado: 'completado'
      });

      await this.supabaseService.insertar('historico_puntos', {
        usuario_id: userAuth.id,
        tipo: 'canjeado',
        puntos: -item.costo,
        descripcion: `Canje: ${item.nombre}`
      });

      this.usuario.puntos = nuevosPuntos;
      item.existencias = item.existencias - 1;

      this.generarComprobantePDF(item);
      this.mostrarConfeti();

      this.modalData = {
        titulo: '¡Canje exitoso!',
        mensaje: `Has canjeado ${item.nombre}. Se descontaron ${item.costo} puntos.`,
        icono: 'checkmark-circle-outline',
        color: 'success'
      };

      this.isModalOpen = true;
      this.aplicarFiltros();

    } catch (error) {
      console.error('Error durante el canje:', error);

      this.modalData = {
        titulo: 'Error',
        mensaje: 'Hubo un problema al procesar el canje. Inténtalo nuevamente.',
        icono: 'alert-circle-outline',
        color: 'danger'
      };

      this.isModalOpen = true;
    }
  }

  cerrarModal() {
    this.isModalOpen = false;
  }

  generarComprobantePDF(item: any) {
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: [80, 150]
    });

    doc.setFillColor(108, 99, 255);
    doc.rect(0, 0, 80, 32, 'F');

    doc.setTextColor(255, 255, 255);
    doc.setFont('Helvetica', 'bold');
    doc.setFontSize(16);
    doc.text('CHOAYO STORE', 40, 12, { align: 'center' });

    doc.setFontSize(9);
    doc.text('Comprobante de Canje', 40, 20, { align: 'center' });
    doc.text('Dulces Coreanos', 40, 25, { align: 'center' });

    const fechaActual = new Date().toLocaleString('es-PE', {
      timeZone: 'America/Lima'
    });

    doc.setTextColor(40, 40, 40);
    doc.setFontSize(8);
    doc.text(`Fecha: ${fechaActual}`, 6, 40);
    doc.text(`Cliente: ${this.usuario?.nombre || 'Cliente CHOAYO'}`, 6, 46);

    doc.setDrawColor(210, 210, 210);
    doc.line(5, 52, 75, 52);

    doc.setFont('Helvetica', 'bold');
    doc.setFontSize(11);
    doc.text('DETALLE DEL CANJE', 6, 61);

    doc.setFont('Helvetica', 'normal');
    doc.setFontSize(10);
    doc.text('Premio:', 6, 70);

    doc.setFont('Helvetica', 'bold');
    doc.text(item.nombre, 25, 70);

    doc.setFont('Helvetica', 'normal');
    doc.text('Costo:', 6, 78);

    doc.setFont('Helvetica', 'bold');
    doc.setTextColor(235, 68, 90);
    doc.text(`-${item.costo} puntos`, 25, 78);

    doc.setTextColor(40, 40, 40);
    doc.setFont('Helvetica', 'normal');
    doc.text('Saldo:', 6, 86);
    doc.text(`${this.usuario.puntos} pts`, 25, 86);

    doc.line(5, 92, 75, 92);

    doc.setFont('Helvetica', 'oblique');
    doc.setFontSize(8);
    doc.setTextColor(100, 100, 100);

    const instrucciones = doc.splitTextToSize(
      'Muestra este comprobante en caja para validar tu premio físico. Válido por 30 días.',
      68
    );

    doc.text(instrucciones, 6, 101);

    const codigoValidacion =
      'CHY-' + Math.floor(100000 + Math.random() * 900000);

    doc.setFont('Helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(108, 99, 255);
    doc.text(`CÓDIGO: ${codigoValidacion}`, 40, 126, { align: 'center' });

    doc.setFont('Helvetica', 'normal');
    doc.setFontSize(7);
    doc.setTextColor(150, 150, 150);
    doc.text('Gracias por elegir CHOAYO STORE', 40, 142, { align: 'center' });

    const nombreArchivo = `Comprobante_${item.nombre.replace(/\s+/g, '_')}.pdf`;
    doc.save(nombreArchivo);
  }
}