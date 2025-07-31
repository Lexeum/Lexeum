'use client';
import { useState, useCallback } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './Navbar.module.css';
import { useSession, signOut } from 'next-auth/react';

// Importá los modales
import LoginModal from '../../login/page';
import RegisterModal from '../../register/page';

export default function Navbar() {
  const { data: session } = useSession();
  const [menuOpen, setMenuOpen] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const pathname = usePathname();

  const toggleMenu = useCallback(() => {
    setMenuOpen((prev) => !prev);
  }, []);

  const closeMenu = useCallback(() => {
    setMenuOpen(false);
  }, []);

  const handleShowLogin = useCallback(() => {
    closeMenu();
    setShowLogin(true);
  }, [closeMenu]);

  const handleShowRegister = useCallback(() => {
    closeMenu();
    setShowRegister(true);
  }, [closeMenu]);

  const handleCloseLogin = useCallback(() => setShowLogin(false), []);
  const handleCloseRegister = useCallback(() => setShowRegister(false), []);

  const handleSwitchToRegister = useCallback(() => {
    setShowLogin(false);
    setShowRegister(true);
  }, []);

  const handleSwitchToLogin = useCallback(() => {
    setShowRegister(false);
    setShowLogin(true);
  }, []);

  return (
    <>
      <header className={styles.navbar}>
        <Link href="/" className={styles.logo} onClick={closeMenu}>
          <img src="/Recurso 20.svg" alt="Logo LEXEUM" className={styles.logoImg} />
          LEXEUM
        </Link>

        <div className={`${styles.menuToggle} ${menuOpen ? styles.open : ''}`} onClick={toggleMenu}>
          <span></span>
          <span></span>
          <span></span>
        </div>

        <div className={`${styles.menu} ${menuOpen ? styles.open : ''}`}>
          <nav className={styles.mainNav}>
            <Link href="/" className={pathname === '/' ? styles.active : ''} onClick={closeMenu}>
              Inicio
            </Link>
            <Link href="/soluciones" className={pathname === '/soluciones' ? styles.active : ''} onClick={closeMenu}>
              Soluciones
            </Link>
            <Link href="/precios" className={pathname === '/precios' ? styles.active : ''} onClick={closeMenu}>
              Precios
            </Link>
            <Link href="/recursos" className={pathname === '/recursos' ? styles.active : ''} onClick={closeMenu}>
              Recursos
            </Link>
            <Link href="/contacto" className={pathname === '/contacto' ? styles.active : ''} onClick={closeMenu}>
              Contacto
            </Link>
          </nav>
          {session?.user ? (
            <div className={styles.authButtons}>
              <Link href="/dashboard" className={styles.register}>
                Ir al Dashboard
              </Link>
              <button
                className={styles.login}
                onClick={() => signOut()}
              >
                Salir
              </button>
            </div>
          ) : (
            <div className={styles.authButtons}>
              <button
                className={styles.login}
                onClick={handleShowLogin}
              >
                Acceso
              </button>
              <button
                className={styles.register}
                onClick={handleShowRegister}
              >
                Inscribirse
              </button>
            </div>
          )}



        </div>
      </header>

      {/* MODALES */}
      {showLogin && (
        <LoginModal
          onClose={handleCloseLogin}
          onSwitch={handleSwitchToRegister}
        />
      )}

      {showRegister && (
        <RegisterModal
          onClose={handleCloseRegister}
          onSwitch={handleSwitchToLogin}
        />
      )}
    </>
  );
}
