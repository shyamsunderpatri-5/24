import { useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';

export function useRealtime(table: string, onUpdate: (payload: any) => void) {
  useEffect(() => {
    const supabase = createClient();
    const channel = supabase.channel(`public:${table}`)
      .on('postgres_changes', { event: '*', schema: 'public', table }, payload => {
        onUpdate(payload);
      })
      .subscribe();
      
    return () => {
      supabase.removeChannel(channel);
    };
  }, [table, onUpdate]);
}
