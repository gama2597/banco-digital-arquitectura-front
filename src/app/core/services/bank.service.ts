import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AccountResponse, CreateAccountRequest, TransferRequest } from '../models/account.model';

@Injectable({ providedIn: 'root' })
export class BankService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;

  // Busca una cuenta específica por ID
  getAccount(id: string): Observable<AccountResponse> {
    return this.http.get<AccountResponse>(`${this.apiUrl}/${id}`);
  }

  // Busca todas las cuentas asociadas a un criterio de cliente (Nombre, DNI, ID)
  getAccountsByClient(criteria: string): Observable<AccountResponse[]> {
    return this.http.get<AccountResponse[]>(`${this.apiUrl}/by-client/${criteria}`);
  }

  createAccount(data: CreateAccountRequest): Observable<AccountResponse> {
    return this.http.post<AccountResponse>(this.apiUrl, data);
  }

  transfer(data: TransferRequest): Observable<any> {
    return this.http.post(`${this.apiUrl}/transfer`, data);
  }
}
