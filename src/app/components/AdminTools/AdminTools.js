'use client';
import { useState } from 'react';
import styles from './AdminTools.module.css';

const cards = [
  {
    title: 'Gestión de usuarios',
    description: 'Crea y administra cuentas para todos los miembros de tu despacho legal.',
    image: '/8304.jpg',
  },
  {
    title: 'Roles y permisos',
    description: 'Define roles personalizados con permisos específicos para cada tipo de usuario.',
    image: '/8304.jpg',
  },
  {
    title: 'Informes y analíticas',
    description: 'Visualiza el rendimiento de tu equipo y la actividad de la plataforma.',
    image: '/8304.jpg',
  },
];

export default function AdminTools() {
  const [activeIndex, setActiveIndex] = useState(0);

  const mainCard = cards[activeIndex];
  const sideCards = cards.filter((_, i) => i !== activeIndex);

  return (
    <section className={styles.adminTools}>
      <div className={styles.grid}>
        {/* Card principal activa */}
        <div className={`${styles.card} ${styles.main}`}>
          <img src={mainCard.image} alt={mainCard.title} className={styles.bgImage} />
          <div className={styles.overlay}>
            <h3>{mainCard.title}</h3>
            <p>{mainCard.description}</p>
          </div>
        </div>

        {/* Cards laterales */}
        <div className={styles.rightColumn}>
          {sideCards.map((card, i) => {
            // Mapear a su índice original real
            const actualIndex = cards.findIndex(c => c.title === card.title);

            return (
              <div
                key={card.title}
                className={`${styles.card} ${styles.small}`}
                onClick={() => setActiveIndex(actualIndex)}
              >
                <img src={card.image} alt={card.title} className={styles.bgImage} />
                <div className={styles.overlay}>
                  <h4>{card.title}</h4>
                  <p>{card.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}