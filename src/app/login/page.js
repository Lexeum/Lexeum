'use client';

import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from './Login.module.css';

export default function LoginModal({ onClose, onSwitch }) {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  async function handleLogin(e) {
    e.preventDefault();
    setError('');
    const res = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });
    if (res?.error) {
      setError("Credenciales incorrectas");
    } else {
      router.push('/dashboard');
    }
  }

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        {/* Imagen izquierda */}
        <div className={styles.imageSide}>
          <img src="/8304.jpg" alt="Login visual" />
        </div>

        {/* Formulario */}
        <div className={styles.formSide}>
          <button className={styles.close} onClick={onClose}>×</button>
          <span className={styles.offer}>¡Bienvenido de nuevo!</span>
          <h1 className={styles.title}>Iniciar sesión</h1>
          <p className={styles.description}>
            Accede a tu cuenta para gestionar tus casos y documentos legales con Lexum.
          </p>

          <form className={styles.form} onSubmit={handleLogin}>
            <input
              type="email"
              placeholder="Correo electrónico"
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
            <input
              type="password"
              placeholder="Contraseña"
              required
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
            <button type="submit">Ingresar</button>
          </form>

          {error && <p style={{ color: 'red', marginTop: '10px' }}>{error}</p>}

          <p className={styles.legal}>
            ¿No tienes cuenta?{' '}
            <a
              href="#"
              onClick={e => {
                e.preventDefault();
                onSwitch();
              }}
            >
              Regístrate aquí
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
