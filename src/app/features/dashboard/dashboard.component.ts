import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { BankService } from 'src/app/core/services/bank.service';
import { AccountResponse } from 'src/app/core/models/account.model';
import { MessageService } from 'primeng/api';

import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { SkeletonModule } from 'primeng/skeleton';
import { SelectButtonModule } from 'primeng/selectbutton';
import { TagModule } from 'primeng/tag';
import { TooltipModule } from 'primeng/tooltip';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    CardModule,
    InputTextModule,
    ButtonModule,
    SkeletonModule,
    SelectButtonModule,
    TagModule,
    TooltipModule,
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent implements OnInit {
  private bankService = inject(BankService);
  private route = inject(ActivatedRoute);
  private msg = inject(MessageService);

  accounts = signal<AccountResponse[]>([]);
  loading = signal(false);

  // DATOS REALES: Inicializan vacíos
  searchText = '';
  searchType = signal('CLIENTE');

  searchOptions = [
    { label: 'Por Cliente (Nombre/DNI)', value: 'CLIENTE' },
    { label: 'Por ID Cuenta', value: 'CUENTA' },
  ];

  today = new Date();

  ngOnInit() {
    // Solo buscamos si la URL trae un parámetro (ej: al volver de crear cuenta)
    this.route.queryParams.subscribe((params) => {
      if (params['id']) {
        this.searchText = params['id'];
        // Si viene ID de cuenta, forzamos tipo CUENTA
        this.searchType.set('CUENTA');
        this.search();
      }
    });
  }

  clearSearch() {
    this.searchText = '';
    this.accounts.set([]);
    this.loading.set(false);
    this.msg.clear(); // limpia mensajes del toast
    // Si quisieras, también podrías resetear el tipo:
    // this.searchType.set('CLIENTE');
  }

  search() {
    if (!this.searchText.trim()) return;

    this.loading.set(true);
    this.accounts.set([]); // Limpiar resultados anteriores

    if (this.searchType() === 'CLIENTE') {
      // Búsqueda inteligente por Cliente (Devuelve Lista)
      this.bankService.getAccountsByClient(this.searchText).subscribe({
        next: (data) => {
          this.accounts.set(data);
          this.loading.set(false);
          if (data.length === 0)
            this.msg.add({
              severity: 'info',
              summary: 'Sin resultados',
              detail: 'No se encontraron cuentas asociadas.',
            });
        },
        error: () => this.handleError(),
      });
    } else {
      // Búsqueda exacta por ID de Cuenta (Devuelve Objeto -> Convertimos a Lista)
      this.bankService.getAccount(this.searchText).subscribe({
        next: (data) => {
          this.accounts.set([data]);
          this.loading.set(false);
        },
        error: () => this.handleError(),
      });
    }
  }

  handleError() {
    this.loading.set(false);
    this.msg.add({
      severity: 'error',
      summary: 'Error',
      detail: 'No se encontraron resultados.',
    });
  }
}
