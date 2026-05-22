import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login.page').then((m) => m.LoginPage),
  },
  {
    path: 'register',
    loadComponent: () => import('./pages/register/register.page').then((m) => m.RegisterPage),
  },
  {
    path: 'tabs',
    loadComponent: () => import('./pages/tabs/tabs.page').then((m) => m.TabsPage),
    children: [
      {
        path: 'home',
        loadComponent: () => import('./home/home.page').then((m) => m.HomePage),
      },
      {
        path: 'recompensas',
        loadComponent: () => import('./home/home.page').then((m) => m.HomePage),
      },
      {
        // ACTUALIZAMOS ESTA RUTA HACIA EL NUEVO ESCÁNER
        path: 'escanear',
        loadComponent: () => import('./pages/scan/scan.page').then((m) => m.ScanPage),
      },
      {
        path: 'historial',
        loadComponent: () => import('./pages/historial/historial.page').then((m) => m.HistorialPage),
      },
      {
        path: 'perfil',
        loadComponent: () => import('./home/home.page').then((m) => m.HomePage),
      },
      {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full'
      }
    ]
  },
  {
    // Redirigir el antiguo acceso directo al nuevo sistema de pestañas
    path: 'home',
    redirectTo: 'tabs/home',
    pathMatch: 'full'
  }
];