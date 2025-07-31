'use client';
import { useState } from 'react';
import styles from './perfil.module.css';

export default function MiPerfil() {
  const [form, setForm] = useState({
    nombre: 'Juan',
    apellido: 'Díaz', // Cambiado a Díaz para coincidir con la imagen
    email: 'juan@ejemplo.com',
    telefono: '+57 3206987245',
    direccion: 'Calle 60 # 45-50',
    ciudad: 'Medellín',
    pais: 'Colombia',
    notificaciones: true, 
    autenticacionDosFactores: false, 
    idioma: 'espanol', 
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Datos actualizados:', form);
    // Aquí puedes hacer la petición a tu API para guardar los cambios
    alert('¡Perfil actualizado con éxito!'); // Feedback visual simple
  };

  // Función para obtener las iniciales del nombre
  const getInitials = (nombre, apellido) => {
    if (!nombre && !apellido) return '';
    const firstInitial = nombre ? nombre.charAt(0) : '';
    const lastInitial = apellido ? apellido.charAt(0) : '';
    return (firstInitial + lastInitial).toUpperCase();
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>Mi Perfil</h1>
        <p className={styles.subtitleDescription}>Administra tu información personal y preferencias</p>
      </header>

      <div className={styles.mainContent}>
        {/* Columna Izquierda: Perfil y Plan Actual */}
        <aside className={styles.sidebar}>
          <div className={`${styles.card} ${styles.profileCard}`}>
            <div className={styles.avatar}>
              {getInitials(form.nombre, form.apellido)}
            </div>
            <h2 className={styles.profileName}>{form.nombre} {form.apellido}</h2>
            <p className={styles.profileEmail}>{form.email}</p>
            <button className={styles.changePhotoButton}>Cambiar foto</button>
          </div>

          <div className={`${styles.card} ${styles.planCard}`}>
            <div className={styles.planHeader}>
              <h2 className={styles.planTitle}>Plan actual</h2>
              <span className={styles.planStatusPill}>Activo</span>
            </div>
            <p className={styles.planDetails}>Renovación: 15 de julio, 2025</p>
            <p className={styles.planTitle}>Características incluidas:</p>
            <ul className={styles.planFeaturesList}>
              <li>Consultas ilimitadas</li>
              <li>Asesoría legal prioritaria</li>
              <li>Redacción de contratos</li>
            </ul>
            <button className={styles.changePlanButton}>Cambiar plan</button>
          </div>
        </aside>

        {/* Columna Derecha: Formularios de Información, Seguridad y Preferencias */}
        <section className={styles.formSection}>
          {/* Información Personal */}
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <h2 className={styles.cardTitle}>Información personal</h2>
              <button className={styles.actionButton}>Editar</button>
            </div>
            <div className={styles.formGrid}>
              <div className={styles.field}>
                <label htmlFor="nombre">Nombre</label>
                <input type="text" id="nombre" name="nombre" value={form.nombre} onChange={handleChange} />
              </div>
              <div className={styles.field}>
                <label htmlFor="apellido">Apellido</label>
                <input type="text" id="apellido" name="apellido" value={form.apellido} onChange={handleChange} />
              </div>
              <div className={styles.field}>
                <label htmlFor="email">Correo electrónico</label>
                <input type="email" id="email" name="email" value={form.email} onChange={handleChange} />
              </div>
              <div className={styles.field}>
                <label htmlFor="telefono">Teléfono</label>
                <input type="tel" id="telefono" name="telefono" value={form.telefono} onChange={handleChange} />
              </div>
            </div>
          </div>

          {/* Seguridad */}
          <div className={`${styles.card} ${styles.securityCard}`}>
            <div className={styles.securityHeader}>
              <h2 className={styles.securitySubtitle}>Seguridad</h2>
              <button className={styles.changePasswordButton}>Cambiar contraseña</button>
            </div>

            <div className={styles.securitySection}>
              <div className={styles.twoFactorAuth}>
                <div>
                  <label htmlFor="autenticacionDosFactores">Autenticación de dos factores</label>
                  <p className={styles.description}>Añade una capa adicional de seguridad a tu cuenta</p>
                </div>
                <label className={styles.switch}>
                  <input
                    type="checkbox"
                    id="autenticacionDosFactores"
                    name="autenticacionDosFactores"
                    checked={form.autenticacionDosFactores}
                    onChange={handleChange}
                  />
                  <span className={styles.slider}></span>
                </label>
              </div>
            </div>

            <div className={styles.securitySection}>
              <h3 className={styles.securitySubtitle}>Historial de inicio de sesión</h3>
              <div className={styles.sessionHistory}>
                <div className={styles.sessionItem}>
                  <div className={styles.sessionInfo}>
                    <p className={styles.sessionLocation}>Medellín, Colombia</p>
                    <p className={styles.sessionDevice}>Chrome en Windows • IP: 85.214.XX.XX</p>
                  </div>
                  <span className={styles.sessionTime}>Hoy, 10:45</span>
                </div>
                <div className={styles.sessionItem}>
                  <div className={styles.sessionInfo}>
                    <p className={styles.sessionLocation}>Medellín, Colombia</p>
                    <p className={styles.sessionDevice}>Safari en iPhone • IP: 85.214.XX.XX</p>
                  </div>
                  <span className={styles.sessionTime}>Ayer, 18:30</span>
                </div>
              </div>
            </div>
          </div>

          {/* Preferencias */}
          <div className={`${styles.card} ${styles.preferencesCard}`}>
            <h2 className={styles.cardTitle}>Preferencias</h2>

            <div className={styles.preferencesGroup}>
              <label htmlFor="idioma" className={styles.preferencesLabel}>Idioma</label>
              <p className={styles.preferencesDescription}>Selecciona el idioma de la plataforma</p>
              <div className={styles.preferencesField}>
                <select id="idioma" name="idioma" value={form.idioma} onChange={handleChange}>
                  <option value="espanol">Español</option>
                  <option value="ingles">Inglés</option>
                  {/* Puedes añadir más idiomas aquí */}
                </select>
              </div>
            </div>

            <div className={styles.preferencesGroup}>
              <label htmlFor="notificaciones" className={styles.preferencesLabel}>Notificaciones por email</label>
              <p className={styles.preferencesDescription}>Recibe actualizaciones sobre tu cuenta</p>
              <div className={styles.preferencesField}>
                <label className={styles.switch}>
                  <input
                    type="checkbox"
                    id="notificaciones"
                    name="notificaciones"
                    checked={form.notificaciones}
                    onChange={handleChange}
                  />
                  <span className={styles.slider}></span>
                </label>
              </div>
            </div>
          </div>

          {/* Botón de Guardar Cambios (fuera de las cards para que sea global) */}
          <div className={styles.actions}>
            <button type="submit">Guardar cambios</button>
          </div>
        </section>
      </div>
    </div>
  );
}