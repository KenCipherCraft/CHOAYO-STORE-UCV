import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonIcon, IonButton } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  funnelOutline,
  receiptOutline,
  arrowUpCircleOutline,
  giftOutline,
  searchOutline,
  closeOutline,
  swapVerticalOutline
} from 'ionicons/icons';
import { SupabaseService } from '../../services/supabase.service';
import { supabase } from '../../../environments/supabase.config';

@Component({
  selector: 'app-historial',
  templateUrl: './historial.page.html',
  styleUrls: ['./historial.page.scss'],
  standalone: true,
  imports: [IonContent, IonIcon, IonButton, CommonModule, FormsModule]
})
export class HistorialPage implements OnInit {

  transacciones: any[] = [];
  transaccionesFiltradas: any[] = [];

  totalGanado = 0;
  totalCanjeado = 0;

  filtroActivo: 'todos' | 'ganados' | 'canjeados' = 'todos';
  textoBusqueda = '';
  mostrarFiltros = false;
  ordenActual: 'reciente' | 'antiguo' | 'mayor' | 'menor' = 'reciente';

  constructor(private supabaseService: SupabaseService) {
    addIcons({
      funnelOutline,
      receiptOutline,
      arrowUpCircleOutline,
      giftOutline,
      searchOutline,
      closeOutline,
      swapVerticalOutline
    });
  }

  ngOnInit() {
    this.cargarHistorial();
  }

  ionViewWillEnter() {
    this.cargarHistorial();
  }

  async cargarHistorial() {
    const userAuth = await this.supabaseService.getUsuarioActual();
    if (!userAuth) return;

    try {
      const { data, error } = await supabase
        .from('historico_puntos')
        .select('*')
        .eq('usuario_id', userAuth.id)
        .order('fecha', { ascending: false });

      if (error) throw error;

      if (data) {
        this.transacciones = data.map((dbItem: any) => {
          const tipoAdaptado = dbItem.tipo === 'ganado' ? 'ingreso' : 'gasto';
          const montoAbsoluto = Math.abs(dbItem.puntos);
          const fechaOriginal = dbItem.fecha || dbItem.created_at;
          const fechaStr = fechaOriginal
            ? new Date(fechaOriginal).toLocaleDateString()
            : 'Fecha no disp.';

          return {
            tipo: tipoAdaptado,
            monto: montoAbsoluto,
            descripcion: dbItem.descripcion,
            fecha: fechaStr,
            fechaOrden: fechaOriginal ? new Date(fechaOriginal).getTime() : 0
          };
        });

        this.totalGanado = this.transacciones
          .filter(item => item.tipo === 'ingreso')
          .reduce((total, item) => total + Number(item.monto), 0);

        this.totalCanjeado = this.transacciones
          .filter(item => item.tipo !== 'ingreso')
          .reduce((total, item) => total + Number(item.monto), 0);

        this.aplicarFiltros();
      }
    } catch (error) {
      console.error('Error al cargar el historial desde Supabase:', error);
    }
  }

  cambiarFiltro(filtro: 'todos' | 'ganados' | 'canjeados') {
    this.filtroActivo = filtro;
    this.aplicarFiltros();
  }

  aplicarFiltros() {
    let lista = [...this.transacciones];

    if (this.filtroActivo === 'ganados') {
      lista = lista.filter(item => item.tipo === 'ingreso');
    }

    if (this.filtroActivo === 'canjeados') {
      lista = lista.filter(item => item.tipo !== 'ingreso');
    }

    if (this.textoBusqueda.trim() !== '') {
      const texto = this.textoBusqueda.toLowerCase().trim();

      lista = lista.filter(item =>
        item.descripcion?.toLowerCase().includes(texto) ||
        item.fecha?.toLowerCase().includes(texto)
      );
    }

    if (this.ordenActual === 'reciente') {
      lista.sort((a, b) => b.fechaOrden - a.fechaOrden);
    }

    if (this.ordenActual === 'antiguo') {
      lista.sort((a, b) => a.fechaOrden - b.fechaOrden);
    }

    if (this.ordenActual === 'mayor') {
      lista.sort((a, b) => b.monto - a.monto);
    }

    if (this.ordenActual === 'menor') {
      lista.sort((a, b) => a.monto - b.monto);
    }

    this.transaccionesFiltradas = lista;
  }

  limpiarBusqueda() {
    this.textoBusqueda = '';
    this.aplicarFiltros();
  }

  seleccionarOrden(orden: 'reciente' | 'antiguo' | 'mayor' | 'menor') {
    this.ordenActual = orden;
    this.mostrarFiltros = false;
    this.aplicarFiltros();
  }
}