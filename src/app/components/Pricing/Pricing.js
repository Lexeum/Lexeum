'use client';
import { useState } from 'react';
import styles from './Pricing.module.css';

export default function Pricing() {
  const [selectedPlan, setSelectedPlan] = useState('12meses');

  const handleSelect = (planId) => {
    setSelectedPlan(planId);
  };

  return (
    <section className={styles.pricing}>
      <div className={styles.header}>
        <h2 className={styles.title}>Encuentre el plan adecuado para sus necesidades</h2>
        <p className={styles.subtitle}>
          Elija el plan que se adapte a sus objetivos de diseño
        </p>
      </div>

      <div className={styles.plans}>
        {/* Plan 1 */}
        <div
          className={`${styles.card} ${selectedPlan === '1mes' ? styles.active : ''}`}
          onClick={() => handleSelect('1mes')}
        >
          <h3>1 mes</h3>
          <p className={styles.price}>$8 <span>/ mes</span></p>
          <button className={styles.btn}>Seleccionar plan</button>
          <p className={styles.note}>
            Garantía de satisfacción de 30 días o le devolvemos su dinero.
          </p>
          <a href="#">Más información</a>
        </div>

        {/* Plan destacado */}
        <div
          className={`${styles.card} ${styles.featured} ${selectedPlan === '12meses' ? styles.active : ''}`}
          onClick={() => handleSelect('12meses')}
        >
          <div className={styles.featuredTop}>Mejor valor</div>
          <h3>12 meses <br /><small>Ahorra 20%</small></h3>
          <p className={styles.price}>$15 <span>/ mes</span></p>
          <button className={styles.btnFeatured}>Seleccionar plan</button>
          <p className={styles.note}>
            Garantía de satisfacción de 30 días o le devolvemos su dinero.
          </p>
          <a href="#">Más información</a>
        </div>

        {/* Plan 3 */}
        <div
          className={`${styles.card} ${selectedPlan === '6meses' ? styles.active : ''}`}
          onClick={() => handleSelect('6meses')}
        >
          <h3>6 meses</h3>
          <p className={styles.price}>$25 <span>/ mes</span></p>
          <button className={styles.btn}>Seleccionar plan</button>
          <p className={styles.note}>
            Garantía de satisfacción de 30 días o le devolvemos su dinero.
          </p>
          <a href="#">Más información</a>
        </div>
      </div>
    </section>
  );
}