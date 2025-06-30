import { useQuery } from '@tanstack/react-query';

export function useServiceTypes() {
  return useQuery({
    queryKey: ['serviceTypes'],
    queryFn: async () => {
      const res = await fetch('/api/service-types');
      if (!res.ok) throw new Error('Failed to fetch service types');
      return res.json();
    },
  });
}
