'use client';
import styles from './Features.module.css';

const features = [
  {
    image: '/interface.jpg',
    title: 'Plantillas de diseño personalizadas',
    description:
      'Inicie hermosos sitios web, aplicaciones y presentaciones rápidamente con una biblioteca de plantillas diseñadas profesionalmente como punto de partida.',
    linkText: 'Explorar plantillas',
  },
  {
    image: '/interface.jpg',
    title: 'Componentes optimizados',
    description:
      'Acceda a bloques de interfaz reutilizables y adaptables para acelerar el desarrollo de productos digitales con una estructura coherente.',
    linkText: 'Explorar componentes',
  },
  {
    image: '/interface.jpg',
    title: 'Documentación integrada',
    description:
      'Toda la información que necesita para implementar y personalizar fácilmente los elementos del sistema de diseño.',
    linkText: 'Ver documentación',
  },
];

export default function Features() {
  return (
    <section className={styles.featuresSection}>
      <div className={styles.featuresHeader}>
        <h2 className={styles.featuresTitle}>
          Su conjunto de herramientas todo en uno para impresionantes interfaces de usuario y flujos de trabajo optimizados
        </h2>
      </div>

      <div className={styles.sliderWrapper}>
        <div className={styles.featuresGrid}>
          {features.map((feature, index) => (
            <div key={index} className={styles.featureCard}>
              <img
                src={feature.image}
                alt={feature.title}
                className={styles.featureImage}
              />
              <div className={styles.featureContent}>
                <h3 className={styles.featureTitle}>{feature.title}</h3>
                <p className={styles.featureDescription}>{feature.description}</p>
                <a href="#" className={styles.featureLink}>
                  {feature.linkText}
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}