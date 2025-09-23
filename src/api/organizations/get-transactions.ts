import { api } from "../client"

export interface TransactionsResponse {
  id: number;
  description: string;
  amount: string; 
  transaction_type: 'income' | 'expense';
  date: string;
  organization_id: number;
  goal_id: number | null;
  created_at: string;
  updated_at: string;
}

export async function getTransactions(organizationId: number): Promise<TransactionsResponse[]> {

  const result = await api.get(`/organizations/${organizationId}/transactions`)

  return result.data
}