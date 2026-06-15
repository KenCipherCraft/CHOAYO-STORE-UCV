import { Injectable } from '@angular/core';
import { supabase } from '../../environments/supabase.config';

/**
 * SERVICIO SUPABASE - GUÍA RÁPIDA PARA EL EQUIPO
 *
 * Tablas disponibles: usuarios, comercios, recompensas, puntos, historico_puntos, canjes
 *
 * Ejemplos de uso:
 * - this.supabaseService.getAll('usuarios')
 * - this.supabaseService.insertar('canjes', { usuario_id, recompensa_id, estado: 'pendiente' })
 * - this.supabaseService.actualizar('recompensas', id, { existencias: 49 })
 */
@Injectable({
  providedIn: 'root'
})
export class SupabaseService {

  // Obtener todas las recompensas activas
  async getRecompensas() {
    const { data, error } = await supabase
      .from('recompensas')
      .select('*')
      .eq('activa', true);

    if (error) {
      console.error('Error al obtener recompensas:', error);
      return [];
    }
    return data;
  }

  // Obtener todos los registros de una tabla
  async getAll(tabla: string) {
    const { data, error } = await supabase.from(tabla).select('*');
    if (error) {
      console.error(`Error al obtener ${tabla}:`, error);
      return [];
    }
    return data;
  }

  // Insertar un registro
  async insertar(tabla: string, valores: any) {
    const { data, error } = await supabase.from(tabla).insert(valores).select();
    if (error) {
      console.error(`Error al insertar en ${tabla}:`, error);
      return null;
    }
    return data;
  }

  // Actualizar un registro por su id
  async actualizar(tabla: string, id: string, valores: any) {
    const { data, error } = await supabase
      .from(tabla)
      .update(valores)
      .eq('identificacion', id)
      .select();
    if (error) {
      console.error(`Error al actualizar ${tabla}:`, error);
      return null;
    }
    return data;
  }
}