// components/LogoutButton.jsx
'use client';
import { signOut } from "next-auth/react";
import { FaSignOutAlt } from 'react-icons/fa';

export default function LogoutButton() {
  return (
    <button onClick={() => signOut({ callbackUrl: '/' })} style={{ cursor: 'pointer', background: 'none', border: 'none', color: 'inherit' }}>
      <FaSignOutAlt /> Cerrar sesión
    </button>
  );
}
