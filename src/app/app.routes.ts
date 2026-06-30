import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () =>
      import('./pages/login/login.page').then((m) => m.LoginPage),
  },
  {
    path: 'register',
    loadComponent: () =>
      import('./pages/register/register.page').then((m) => m.RegisterPage),
  },
  {
    path: 'tabs',
    loadComponent: () =>
      import('./tabs/tabs.page').then((m) => m.TabsPage),
    children: [
      {
        path: 'home',
        loadComponent: () =>
          import('./home/home.page').then((m) => m.HomePage),
      },
      {
        path: 'recompensas',
        loadComponent: () =>
          import('./pages/recompensas/recompensas.page').then((m) => m.RecompensasPage),
      },
      {
        path: 'escanear',
        loadComponent: () =>
          import('./pages/scan/scan.page').then((m) => m.ScanPage),
      },
      {
        path: 'historial',
        loadComponent: () =>
          import('./pages/historial/historial.page').then((m) => m.HistorialPage),
      },
      {
  path: 'juego',
  loadComponent: () =>
    import('./pages/juego/juego.page').then((m) => m.JuegoPage),
},
{
  path: 'nivel1',
  loadComponent: () =>
    import('./pages/nivel1/nivel1.page').then((m) => m.Nivel1Page),
},

{
  path: 'perfil',
  loadComponent: () =>
    import('./pages/perfil/perfil.page').then((m) => m.PerfilPage),
},
      {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full',
      }
    ]
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: 'editar-perfil',
    loadComponent: () =>
      import('./pages/editar-perfil/editar-perfil.page').then((m) => m.EditarPerfilPage),
  },
];