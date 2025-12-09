import { Routes } from '@angular/router';
import { MainLayoutComponent } from './layout/main-layout/main-layout.component';

export const routes: Routes = [
  {
    path: '',
    component: MainLayoutComponent, // El Layout envuelve a los hijos
    children: [
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./features/dashboard/dashboard.component').then(
            (m) => m.DashboardComponent
          ),
        title: 'Banco - Inicio',
      },
      {
        path: 'create',
        loadComponent: () =>
          import('./features/create-account/create-account.component').then(
            (m) => m.CreateAccountComponent
          ),
        title: 'Banco - Apertura',
      },
      {
        path: 'transfer',
        loadComponent: () =>
          import('./features/transfer/transfer.component').then(
            (m) => m.TransferComponent
          ),
        title: 'Banco - Transferir',
      },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
    ],
  },
  { path: '**', redirectTo: 'dashboard' },
];
