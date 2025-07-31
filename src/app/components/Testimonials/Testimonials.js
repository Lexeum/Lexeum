'use client';
import { useRef } from 'react';
import styles from './Testimonials.module.css';

const testimonials = [
  {
    quote: "“Pudimos publicar una versión funcional de todo el sitio web en menos de dos semanas. Y no tuvimos que renunciar a nuestros diseños originales”.",
    author: 'Juan Sepulveda',
    role: 'Abogado en JPS',
    avatar: '/avatar.png',
    logo: '/company.png',
  },
  {
    quote: "“Pudimos publicar una versión funcional de todo el sitio web en menos de dos semanas. Y no tuvimos que renunciar a nuestros diseños originales”.",
    author: 'Lucas Montoya',
    role: 'Cofundador de Lexeum',
    avatar: '/avatar.png',
    logo: '/company.png',
  },
  {
    quote: "“Pudimos publicar una versión funcional de todo el sitio web en menos de dos semanas. Y no tuvimos que renunciar a nuestros diseños originales”.",
    author: 'Lucas Montoya',
    role: 'Cofundador de Lexeum',
    avatar: '/avatar.png',
    logo: '/company.png',
  },
  {
    quote: "“Pudimos publicar una versión funcional de todo el sitio web en menos de dos semanas. Y no tuvimos que renunciar a nuestros diseños originales”.",
    author: 'Lucas Montoya',
    role: 'Cofundador de Lexeum',
    avatar: '/avatar.png',
    logo: '/company.png',
  },
];

export default function Testimonials() {
  const sliderRef = useRef(null);

  const scrollLeft = () => {
    sliderRef.current?.scrollBy({ left: -300, behavior: 'smooth' });
  };

  const scrollRight = () => {
    sliderRef.current?.scrollBy({ left: 300, behavior: 'smooth' });
  };

  return (
    <section className={styles.testimonials}>
      <h2 className={styles.heading}>Lo que dicen nuestros clientes</h2>

      <div className={styles.slider} ref={sliderRef}>
        {testimonials.map((testimonial, index) => (
          <div key={index} className={styles.card}>
            <div className={styles.cardTop}>
              <img src={testimonial.avatar} alt={testimonial.author} className={styles.avatar} />
              <img src={testimonial.logo} alt="Logo" className={styles.logo} />
            </div>
            <p className={styles.quote}>{testimonial.quote}</p>
            <div className={styles.authorInfo}>
              <strong>{testimonial.author}</strong>
              <span>{testimonial.role}</span>
            </div>
          </div>
        ))}
      </div>

      <div className={styles.controls}>
        <button onClick={scrollLeft}>&larr;</button>
        <button onClick={scrollRight}>&rarr;</button>
      </div>
    </section>
  );
}