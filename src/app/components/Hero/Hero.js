import styles from './Hero.module.css';

export default function Hero() {
  return (
    <section className={styles.hero}>
      <div className={styles.heroContainer}>
        <div className={styles.heroContent}>
          <span className={styles.tag}>Plataforma legal integral</span>
          <h1 className={styles.heroTitle}>
            Gestión legal <br /> inteligente para profesionales
          </h1>
          <p className={styles.heroText}>
            Lexum combina IA avanzada con herramientas de gestión para optimizar todos los aspectos de tu práctica legal: consultas, documentos, citas y más.
          </p>
          <div className={styles.heroButtons}>
            <button className={styles.primaryBtn}>Comenzar ahora</button>
            <button className={styles.secondaryBtn}>
              <span>▶</span> Ver demo
            </button>
          </div>
        </div>
        <img
          src="/Hero_Image.png"
          alt="Interfaz Lexum"
          className={styles.heroImage}
        />
      </div>
    </section>
  );
}