import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { BankService } from 'src/app/core/services/bank.service';
import { MessageService } from 'primeng/api';

import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-create-account',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    CardModule,
    InputTextModule,
    InputNumberModule,
    ButtonModule,
  ],
  templateUrl: './create-account.component.html',
})
export class CreateAccountComponent {
  private bankService = inject(BankService);
  private router = inject(Router);
  private msg = inject(MessageService);

  loading = signal(false);
  data = { clientId: '', initialBalance: 0 };

  save() {
    if (!this.data.clientId || this.data.initialBalance < 0) {
      this.msg.add({
        severity: 'warn',
        summary: 'Datos inválidos',
        detail: 'Ingrese Cliente ID y saldo positivo.',
      });
      return;
    }

    this.loading.set(true);

    this.bankService.createAccount(this.data).subscribe({
      next: (res) => {
        this.msg.add({
          severity: 'success',
          summary: 'Cuenta Creada',
          detail: `Número: ${res.numeroCuenta}`,
        });
        // Redirige al dashboard buscando el ID de la NUEVA cuenta
        this.router.navigate(['/dashboard'], { queryParams: { id: res.id } });
      },
      error: (err) => {
        this.msg.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudo crear la cuenta. Verifique el Cliente.',
        });
        this.loading.set(false);
      },
    });
  }
}
