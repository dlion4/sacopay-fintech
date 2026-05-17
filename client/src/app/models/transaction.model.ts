// src/app/models/transaction.model.ts
export interface Transaction {
  id: string;
  reference: string;
  amount: number;
  date: string;
  status: string;
}

export interface TransactionStats {
  totalCount: number;
  totalAmount: number;
}

export type TransactionTab = 'all' | 'pending' | 'disputed';