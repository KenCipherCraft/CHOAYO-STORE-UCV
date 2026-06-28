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

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://zphglwuwiafnritkngee.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpwaGdsd3V3aWFmbnJpdGtuZ2VlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE0NjU2ODksImV4cCI6MjA5NzA0MTY4OX0.ZTKRdvjztaoWLc3zJSq3gMM2ORQ--1aFIXeHCwapPQ0';

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

