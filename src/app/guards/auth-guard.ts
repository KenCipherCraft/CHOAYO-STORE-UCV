import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { SupabaseService } from '../services/supabase.service';

export const authGuard: CanActivateFn = async () => {
  const supabaseService = inject(SupabaseService);
  const router = inject(Router);

  const session = await supabaseService.getSession();

  if (session) {
    return true; // tiene sesión activa → puede entrar
  } else {
    router.navigate(['/login']);
    return false; // no tiene sesión → manda al login
  }
};