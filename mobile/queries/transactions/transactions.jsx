import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || "http://localhost:4000";

export const useTransactionsQuery = (userId, type) => {
  return useQuery({
    queryKey: ['transactions', userId, type],
    queryFn: async () => {
      if (!userId) throw new Error('User ID is required');
      
      const url = type 
        ? `${API_BASE_URL}/api/transactions?userId=${userId}&type=${type}`
        : `${API_BASE_URL}/api/transactions?userId=${userId}`;
      
      const res = await fetch(url);
      
      if (!res.ok) {
        throw new Error('Failed to fetch transactions');
      }
      
      const data = await res.json();
      return data;
    },
    enabled: !!userId,
  });
};

export const useAddTransactionMutation = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (transactionData) => {
      const res = await fetch(`${API_BASE_URL}/api/transactions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(transactionData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to add transaction");
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      queryClient.invalidateQueries({ queryKey: ['summary'] });
    },
  });
};
