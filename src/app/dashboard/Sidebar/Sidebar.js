'use client';
import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './Sidebar.module.css';
import {
  FiMenu,
  FiHome,
  FiUser,
  FiFileText,
  FiCalendar,
  FiBriefcase, // Cambiamos FiBookOpen por FiBriefcase para un ícono de "Casos"
  FiSearch,
  FiMessageSquare,
  FiSettings,
  FiLogOut,
  FiFolder, // Nuevo ícono para Documentos
} from 'react-icons/fi';


export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();

  const toggleSidebar = () => setCollapsed(!collapsed);

  return (
    <aside className={`${styles.sidebar} ${collapsed ? styles.collapsed : ''}`}>
      {/* TOP */}
      <div className={styles.topSection}>
        {!collapsed && <h1 className={styles.logo}>LEXEUM</h1>}
        <button className={styles.toggleBtn} onClick={toggleSidebar}>
          <FiMenu />
        </button>
      </div>

      {/* MENÚ PRINCIPAL */}
      <nav className={styles.menu}>
        {/* Sección: General */}
        {!collapsed && <div className={styles.menuSectionTitle}>General</div>}
        <Link href="/dashboard" passHref>
          <div className={`${styles.item} ${pathname === '/dashboard' ? styles.active : ''}`}>
            <FiHome/>
            <span>Inicio</span>
          </div>
        </Link>

        {/* Sección: Clientes y Casos */}
        {!collapsed && <div className={styles.menuSectionTitle}>Clientes y Casos</div>}
        <Link href="/dashboard/casos" passHref>
          <div className={`${styles.item} ${pathname.startsWith('/dashboard/casos') ? styles.active : ''}`}>
            <FiBriefcase /> {/* Ícono de maletín para "Casos" */}
            <span>Casos</span>
          </div>
        </Link>

        <Link href="/dashboard/clientes" passHref>
          <div className={`${styles.item} ${pathname.startsWith('/dashboard/clientes') ? styles.active : ''}`}>
            <FiUser />
            <span>Clientes</span>
          </div>
        </Link>

        {/* Sección: Documentos y Calendario */}
        {!collapsed && <div className={styles.menuSectionTitle}>Documentos</div>}
        <Link href="/dashboard/contratos" passHref>
          <div className={`${styles.item} ${pathname.startsWith('/dashboard/contratos') ? styles.active : ''}`}>
            <FiFileText />
            <span>Contratos</span>
          </div>
        </Link>

        <Link href="/dashboard/documentos" passHref>
          <div className={`${styles.item} ${pathname.startsWith('/dashboard/documentos') ? styles.active : ''}`}>
            <FiFolder /> {/* Ícono de carpeta para "Documentos" */}
            <span>Documentos</span>
          </div>
        </Link>
         <Link href="/dashboard/calendario" passHref>
          <div className={`${styles.item} ${pathname.startsWith('/dashboard/calendario') ? styles.active : ''}`}>
            <FiCalendar />
            <span>Calendario</span>
          </div>
        </Link>


        {/* Sección: Herramientas de IA */}
        {!collapsed && <div className={styles.menuSectionTitle}>Herramientas IA</div>}
        <Link href="/dashboard/legalresearch" passHref>
          <div className={`${styles.item} ${pathname.startsWith('/dashboard/legalresearch') ? styles.active : ''}`}>
            <FiSearch />
            <span>Legal Research</span>
          </div>
        </Link>

        <Link href="/dashboard/asistente-ia" passHref>
          <div className={`${styles.item} ${pathname.startsWith('/dashboard/asistente-ia') ? styles.active : ''}`}>
            <FiMessageSquare />
            <span>Asistente Legal IA</span>
          </div>
        </Link>
      </nav>

      {/* CONFIGURACIÓN Y PERFIL */}
      <div className={styles.bottom}>
        <Link href="/dashboard/configuracion" passHref>
          <div className={`${styles.item} ${pathname.startsWith('/dashboard/configuracion') ? styles.active : ''}`}>
            <FiSettings />
            {!collapsed && <span>Configuración</span>}
          </div>
        </Link>
        <Link href="/dashboard/perfil" passHref>
          <div className={`${styles.item} ${pathname.startsWith('/dashboard/perfil') ? styles.active : ''}`}>
            <FiUser />
            {!collapsed && <span>Mi Perfil</span>}
          </div>
        </Link>
        <div className={`${styles.item} ${styles.logoutItem}`} onClick={() => alert('Cerrar sesión')}>
          <FiLogOut />
          {!collapsed && <span>Cerrar sesión</span>}
        </div>
      </div>
    </aside>
  );
}