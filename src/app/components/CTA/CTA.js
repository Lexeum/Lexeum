import styles from './CTA.module.css';

export default function CTA() {
  return (
    <section className={styles.cta}>
      <h2 className={styles.heading}>Optimiza tu práctica legal hoy mismo</h2>
      <p className={styles.subheading}>
        Únete a miles de profesionales legales que ya confían en Lexum.
      </p>

      <div className={styles.actions}>
        <button className={styles.primary}>Comenzar prueba gratis</button>
        <button className={styles.secondary}>Solicitar demo</button>
      </div>
    </section>
  );
}