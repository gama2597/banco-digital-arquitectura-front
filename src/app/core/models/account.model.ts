export interface AccountResponse {
  id: string;
  numeroCuenta: string;
  clienteId: string;
  saldo: number;
  estado: string;
}

export interface CreateAccountRequest {
  clientId: string;
  initialBalance: number;
}

export interface TransferRequest {
  sourceAccountId: string;
  targetAccountNumber: string;
  amount: number;
  description: string;
}
