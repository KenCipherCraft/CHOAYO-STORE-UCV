import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonContent, IonIcon, IonButton } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  funnelOutline,
  receiptOutline,
  arrowUpCircleOutline,
  giftOutline
} from 'ionicons/icons';
import { SupabaseService } from '../../services/supabase.service';
import { supabase } from '../../../environments/supabase.config'; // Asegúrate que la ruta sea correcta

@Component({
  selector: 'app-historial',
  templateUrl: './historial.page.html',
  styleUrls: ['./historial.page.scss'],
  standalone: true,
  imports: [IonContent, IonIcon, IonButton, CommonModule]
})
export class HistorialPage implements OnInit {

  transacciones: any[] = [];
  totalGanado = 0;
  totalCanjeado = 0;

  constructor(private supabaseService: SupabaseService) {
    addIcons({
      funnelOutline,
      receiptOutline,
      arrowUpCircleOutline,
      giftOutline
    });
  }

  ngOnInit() {
    this.cargarHistorial();
  }

  ionViewWillEnter() {
    this.cargarHistorial();
  }

  async cargarHistorial() {
    // 1. Obtener usuario logueado
    const userAuth = await this.supabaseService.getUsuarioActual();
    if (!userAuth) return;

    try {
      // 2. Traer todos los movimientos de este usuario desde Supabase
      // OJO: Si tu columna de fecha se llama 'created_at', cambia 'fecha' por 'created_at' aquí abajo
      const { data, error } = await supabase
        .from('historico_puntos')
        .select('*')
        .eq('usuario_id', userAuth.id)
        .order('fecha', { ascending: false }); 

      if (error) throw error;

      if (data) {
        // 3. Mapeamos los datos de la BD para que encajen EXACTAMENTE con lo que espera tu HTML
        this.transacciones = data.map((dbItem: any) => {
          
          // Adaptamos los nombres de la base de datos a los que usa tu HTML
          const tipoAdaptado = dbItem.tipo === 'ganado' ? 'ingreso' : 'gasto';
          
          // Los canjes están en negativo en la BD, usamos Math.abs para pasarlos a positivo
          // porque tu HTML ya se encarga de ponerles el signo '-'
          const montoAbsoluto = Math.abs(dbItem.puntos);

          // Formateamos la fecha a formato local (Día/Mes/Año)
          // Si tu columna es 'created_at', cambia dbItem.fecha por dbItem.created_at
          const fechaStr = dbItem.fecha ? new Date(dbItem.fecha).toLocaleDateString() : 'Fecha no disp.';

          return {
            tipo: tipoAdaptado,
            monto: montoAbsoluto,
            descripcion: dbItem.descripcion,
            fecha: fechaStr
          };
        });

        // 4. Calcular los totales para las tarjetas de arriba (código original tuyo)
        this.totalGanado = this.transacciones
          .filter(item => item.tipo === 'ingreso')
          .reduce((total, item) => total + Number(item.monto), 0);

        this.totalCanjeado = this.transacciones
          .filter(item => item.tipo !== 'ingreso')
          .reduce((total, item) => total + Number(item.monto), 0);
      }
    } catch (error) {
      console.error('Error al cargar el historial desde Supabase:', error);
    }
  }
}