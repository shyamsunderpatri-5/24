import { useState, useEffect } from 'react';

export function useInventory(businessId: string) {
  const [inventory, setInventory] = useState([]);
  
  useEffect(() => {
    fetch('/api/inventory').then(res => res.json()).then(setInventory);
  }, [businessId]);
  
  return { inventory };
}
