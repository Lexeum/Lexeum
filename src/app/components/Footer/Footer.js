'use client';
import styles from './Footer.module.css';
import { FaTwitter, FaLinkedin, FaDribbble } from 'react-icons/fa'; // Asegúrate de tener react-icons instalados

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.top}>
        {/* Logo + descripción (si añades una descripción, va aquí) */}
        <div className={styles.logoBlock}>
          {/* Usamos la clase .logo que ya tiene los estilos definidos */}
          <h3 className={styles.logo}>LEXEUM</h3>
          {/* Puedes añadir una descripción aquí si lo deseas, por ejemplo: */}
          {/* <p className={styles.logoDescription}>Optimiza tu práctica legal con IA avanzada.</p> */}
        </div>

        {/* Enlaces organizados */}
        <div className={styles.linkGroups}>
          <div>
            <h4>Características</h4>
            <ul>
              <li><a href="#">Asistente IA</a></li>
              <li><a href="#">Documentos</a></li>
              <li><a href="#">Calendario</a></li>
              <li><a href="#">Clientes</a></li>
            </ul>
          </div>
          <div>
            <h4>Recursos</h4>
            <ul>
              <li><a href="#">Blog</a></li>
              <li><a href="#">Centro de ayuda</a></li>
              <li><a href="#">Guías</a></li>
              <li><a href="#">Soporte</a></li>
            </ul>
          </div>
          <div>
            <h4>Compañía</h4>
            <ul>
              <li><a href="#">Sobre nosotros</a></li>
              <li><a href="#">Equipo</a></li>
              <li><a href="#">Carreras</a></li>
              <li><a href="#">Contacto</a></li>
            </ul>
          </div>
          <div>
            <h4>Síguenos</h4>
            <div className={styles.social}>
              {/* Los íconos de react-icons ya son SVG, los estilos aplicarán bien */}
              <a href="#" aria-label="Twitter"><FaTwitter /></a>
              <a href="#" aria-label="Dribbble"><FaDribbble /></a>
              <a href="#" aria-label="LinkedIn"><FaLinkedin /></a>
            </div>
          </div>
        </div>
      </div>

      <hr className={styles.divider} />
 
      <div className={styles.bottom}>
        <p>LEXUM © 2025. Todos los derechos reservados.</p>
        <div className={styles.policyLinks}>
          <a href="#">Términos</a>
          <a href="#">Política de privacidad</a>
        </div>
      </div>
    </footer>
  );
}