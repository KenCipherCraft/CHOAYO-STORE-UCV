import { Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

export const routes: Routes = [
  {
    path: 'tabs',
    component: TabsPage,
    children: [
      {
        path: 'home',
        loadComponent: () =>
          import('../home/home.page').then((m) => m.HomePage),
      },
      {
        path: 'recompensas',
        loadComponent: () =>
          import('../pages/recompensas/recompensas.page').then((m) => m.RecompensasPage),
      },
      {
        path: 'escanear',
        loadComponent: () =>
          import('../pages/scan/scan.page').then((m) => m.ScanPage),
      },
      {
  path: 'juego',
  loadComponent: () =>
    import('../pages/juego/juego.page').then((m) => m.JuegoPage),
},
      {
        path: 'perfil',
        loadComponent: () =>
          import('../pages/perfil/perfil.page').then((m) => m.PerfilPage),
      },
      {
        path: '',
        redirectTo: '/tabs/home',
        pathMatch: 'full',
      },
    ],
  },
  {
    path: '',
    redirectTo: '/tabs/home',
    pathMatch: 'full',
  },
];