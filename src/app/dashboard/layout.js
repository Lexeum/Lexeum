'use client';

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

import Sidebar from './Sidebar/Sidebar'; // Asegúrate de que este componente exista
import Navbar from '../components/Navbar/Navbar'; // Asegúrate de que este componente exista

export default function DashboardLayout({ children }) {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  if (status === 'loading') return <div>Cargando...</div>;
  if (!session) return <div>No autorizado</div>; // Mejor feedback

  async function handleLogout() {
    await fetch('/api/logout', { method: 'POST' });
    router.push('/'); // Redirige al inicio o login
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <Navbar />
        <main style={{ flexGrow: 1, backgroundColor: '#f9fafb' }}>
          {children}
        </main>
      </div>
    </div>
  );
}
