import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute, RouterLink } from '@angular/router'; // IMPORTANTE: ActivatedRoute
import { BankService } from 'src/app/core/services/bank.service';
import { MessageService } from 'primeng/api';
import { TransferRequest } from 'src/app/core/models/account.model';

import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { ButtonModule } from 'primeng/button';
import { InputTextareaModule } from 'primeng/inputtextarea';

@Component({
  selector: 'app-transfer',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    CardModule,
    InputTextModule,
    InputNumberModule,
    ButtonModule,
    InputTextareaModule,
  ],
  templateUrl: './transfer.component.html',
})
export class TransferComponent implements OnInit {
  private bankService = inject(BankService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private msg = inject(MessageService);

  loading = signal(false);

  // DATOS REALES: Vacíos por defecto
  data: TransferRequest = {
    sourceAccountId: '',
    targetAccountNumber: '',
    amount: 0,
    description: '',
  };

  ngOnInit() {
    // Si la URL tiene ?from=CTA001, pre-llenamos el origen.
    // Si no, queda vacío para que el usuario escriba.
    this.route.queryParams.subscribe((params) => {
      if (params['from']) {
        this.data.sourceAccountId = params['from'];
      }
    });
  }

  send() {
    // Validamos todo
    if (
      !this.data.sourceAccountId ||
      !this.data.targetAccountNumber ||
      this.data.amount <= 0
    ) {
      this.msg.add({
        severity: 'warn',
        summary: 'Atención',
        detail: 'Complete todos los campos obligatorios.',
      });
      return;
    }

    this.loading.set(true);

    this.bankService.transfer(this.data).subscribe({
      next: () => {
        // Notificación persistente gracias al Layout
        this.msg.add({
          severity: 'success',
          summary: 'Transferencia Exitosa',
          detail: 'Fondos enviados correctamente.',
          life: 3000,
        });

        // Redirección inmediata al Dashboard buscando la cuenta de origen para ver el nuevo saldo
        this.router.navigate(['/dashboard'], {
          queryParams: { id: this.data.sourceAccountId },
        });
      },
      error: (err) => {
        const detail = err.error?.detail || 'Ocurrió un error inesperado.';
        this.msg.add({
          severity: 'error',
          summary: 'Error de Transacción',
          detail: detail,
        });
        this.loading.set(false);
      },
    });
  }
}
