import { useState, useEffect } from 'react';

export function useConversations(businessId: string) {
  const [conversations, setConversations] = useState([]);
  
  useEffect(() => {
    fetch('/api/conversations').then(res => res.json()).then(setConversations);
  }, [businessId]);
  
  return { conversations };
}
