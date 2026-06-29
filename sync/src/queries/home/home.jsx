import { useQuery } from '@tanstack/react-query';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

export const useSummaryQuery = (userId) => {
  return useQuery({
    queryKey: ['summary', userId],
    queryFn: async () => {
      if (!userId) throw new Error('User ID is required');
      
      const res = await fetch(`${API_BASE_URL}/api/summary/totals?userId=${userId}`);
      
      if (!res.ok) {
        throw new Error('Failed to fetch summary');
      }
      
      const data = await res.json();
      return data;
    },
    enabled: !!userId,
  });
};
