'use client';
import styles from './Interface.module.css';

const logos = [
  '/g.png',
  '/m.png',
  '/d.png',
  '/n.png',
  '/s.png',
];

export default function Interface() {
  return (
    <section className={styles.interface}>
      <div className={styles.container}>
        <div className={styles.left}>
          <h2 className={styles.title}>Confiado por gigantes</h2>
          <p className={styles.subtitle}>
            Descubra por qué Lexum es la opción preferida para soluciones de diseño confiables en todo el mundo.
          </p>
          <div className={styles.buttons}>
            <button className={styles.primaryBtn}>Regístrate gratis</button>
            <button className={styles.secondaryBtn}>Reserva una demostración</button>
          </div>
        </div>
        <div className={styles.right}>
          <img
            src="/interface.jpg"
            alt="Vista previa del panel"
            className={styles.previewImage}
          />
        </div>
      </div>

      <div className={styles.logoSlider}>
        {logos.map((src, index) => (
          <img key={index} src={src} alt="Logo" className={styles.logoItem} />
        ))}
      </div>
    </section>
  );
}