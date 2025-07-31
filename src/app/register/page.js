'use client';
import { useState } from 'react';
import { signIn } from "next-auth/react";
import { useRouter } from 'next/navigation';
import styles from './Register.module.css';

export default function Register({ onClose, onSwitch }) {
  const router = useRouter();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || 'Error al registrarse');
        setLoading(false);
        return;
      }

      // Registro exitoso: iniciar sesión automáticamente
      const signInResult = await signIn('credentials', {
        redirect: false,
        email: form.email,
        password: form.password,
      });

      if (signInResult?.error) {
        setError('Error al iniciar sesión automáticamente');
        setLoading(false);
        return;
      }

      // Login correcto, redirige al dashboard
      router.push('/dashboard');

      // Opcional: limpiar formulario y cerrar modal
      setForm({ name: '', email: '', password: '' });
      setLoading(false);
      setSuccess('Usuario creado e iniciado sesión correctamente.');

      // Cerrar modal si quieres
      // onClose();

    } catch (err) {
      setError('Error en el servidor, intenta más tarde.');
      setLoading(false);
    }
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <div className={styles.imageSide}>
          <img src="/8304.jpg" alt="Visual Registro" />
        </div>

        <div className={styles.formSide}>
          <button className={styles.close} onClick={onClose}>×</button>
          <span className={styles.offer}>Crea tu cuenta</span>
          <h1 className={styles.title}>Regístrate en Lexum</h1>
          <p className={styles.description}>
            Únete a cientos de profesionales legales que ya gestionan su trabajo con inteligencia.
          </p>

          <form className={styles.form} onSubmit={handleSubmit}>
            <input
              type="text"
              name="name"
              placeholder="Nombre completo"
              required
              value={form.name}
              onChange={handleChange}
            />
            <input
              type="email"
              name="email"
              placeholder="Correo electrónico"
              required
              value={form.email}
              onChange={handleChange}
            />
            <input
              type="password"
              name="password"
              placeholder="Contraseña"
              required
              value={form.password}
              onChange={handleChange}
            />
            <button type="submit" disabled={loading}>
              {loading ? 'Registrando...' : 'Registrarse'}
            </button>
          </form>

          {error && <p style={{ color: 'red', marginTop: '1rem' }}>{error}</p>}
          {success && <p style={{ color: 'green', marginTop: '1rem' }}>{success}</p>}

          <p className={styles.legal}>
            ¿Ya tienes cuenta?{' '}
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                onSwitch();
              }}
            >
              Inicia sesión
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
