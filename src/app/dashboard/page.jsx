'use client';

import { useEffect } from 'react';

export default function CheckTokenClient() {
  useEffect(() => {
    const cookies = document.cookie;
    console.log('🍪 Cookies del navegador:', cookies);
    
    const token = cookies.split('; ').find(row => row.startsWith('token='))?.split('=')[1];
    console.log('🔑 Token JWT:', token);
  }, []);

  return null;
  
  
}
