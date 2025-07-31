import styles from './dashboardhome.module.css';
import { FaPlus, FaRegFile, FaRegCalendarAlt, FaChevronLeft, FaChevronRight, FaEllipsisH } from 'react-icons/fa'; // Importa los íconos necesarios


export default function DashboardHome() {
  const recentCases = [
    { id: 'CASO-2025-001', name: 'Demanda por', client: 'Tech Solutions', status: 'En curso', date: '10 Jun 2025', color: 'green' },
    { id: 'CASO-2025-002', name: 'Revisión', client: 'María García', status: 'En revisión', date: '15 Jun 2025', color: 'yellow' },
    { id: 'CASO-2025-003', name: 'Derecho', client: 'Pedro López', status: 'Urgente', date: '18 Jun 2025', color: 'red' },
    { id: 'CASO-2025-004', name: 'Contrato', client: 'Ana Martínez', status: 'En curso', date: '20 Jun 2025', color: 'green' },
  ];

  const recentDocs = [
    { name: 'Contrato_Arrendamiento_MaríaGarcía.pdf', modified: '15 Jun 2025', status: 'Borrador', color: 'yellow' },
    { name: 'Demanda_TechSolutions.docx', modified: '12 Jun 2025', status: 'Firmado', color: 'green' },
    { name: 'Derecho_Peticion_PedroLópez.pdf', modified: '18 Jun 2025', status: 'Pendiente', color: 'red' },
  ];

  const calendarDaysOfWeek = ['L', 'M', 'X', 'J', 'V', 'S', 'D'];
  const calendarDates = Array.from({ length: 30 }, (_, i) => i + 1); // Genera los días del mes
  const activeDate = 16; // El día 16 está activo
  const firstDayOffset = 4; // Lunes = 1, Martes = 2... Jueves = 4. Ajustar el inicio de mes.

  return (
    <div className={styles.dashboard}>
      {/* Encabezado con título y botones */}
      <header className={styles.header}>
        <div className={styles.titleContainer}>
          <h1 className={styles.title}>Dashboard</h1>
          <p className={styles.subtitle}>Bienvenido de nuevo, Juan</p>
        </div>
        <div className={styles.headerButtons}>
          <button className={styles.exportButton}>Exportar</button>
          <button className={styles.newCaseButton}>
            <FaPlus /> Nuevo caso
          </button>
        </div>
      </header>

      {/* Tarjetas de resumen */}
      <div className={styles.overview}>
        <div className={styles.card}>
          <div className={styles.icon}>
            <FaRegFile size={24} />
          </div>
          <h3>24</h3>
          <span>Casos activos</span>
        </div>
        <div className={styles.card}>
          <div className={styles.icon}>
            <FaRegFile size={24} />
          </div>
          <h3>48</h3>
          <span>Clientes totales</span>
        </div>
        <div className={styles.card}>
          <div className={styles.icon}>
            <FaRegFile size={24} />
          </div>
          <h3>156</h3>
          <span>Documentos</span>
        </div>
        <div className={styles.card}>
          <div className={styles.icon}>
            <FaRegCalendarAlt size={24} />
          </div>
          <h3>12</h3>
          <span>Eventos pendientes</span>
        </div>
      </div>

      {/* Grid principal de contenido */}
      <div className={styles.grid}>
        {/* Panel de Casos recientes */}
        <div className={styles.panel}>
          <div className={styles.panelHeader}>
            <h4>Casos recientes</h4>
            <a href="#">Ver todos</a>
          </div>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Caso</th>
                <th>Cliente</th>
                <th>Estado</th>
                <th>Fecha</th>
              </tr>
            </thead>
            <tbody>
              {recentCases.map((c, index) => (
                <tr key={index}>
                  <td>
                    {c.name}<br /><span className={styles.caseId}>#{c.id}</span>
                  </td>
                  <td>{c.client}</td>
                  <td>
                    <span className={`${styles.badge} ${styles[c.color]}`}>{c.status}</span>
                  </td>
                  <td>{c.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Sidebar: Calendario y eventos */}
        <div className={styles.side}>
          {/* Calendario */}
          <div className={`${styles.panel} ${styles.calendarPanel}`}>
            <div className={styles.panelHeader}>
              <h4 className={styles.calendarTitle}>Calendario</h4>
              <div className={styles.calendarNav}>
                <button className={styles.calendarNavButton}><FaChevronLeft size={12} /></button>
                <button className={styles.calendarNavButton}><FaChevronRight size={12} /></button>
              </div>
            </div>
            <div className={styles.calendarBody}>
              <strong className={styles.calendarMonth}>Junio 2025</strong>
              <div className={styles.calendarGrid}>
                {calendarDaysOfWeek.map((day, index) => (
                  <span key={index} className={styles.dayOfWeek}>{day}</span>
                ))}
                {/* Espacios vacíos para alinear el primer día del mes */}
                {Array.from({ length: firstDayOffset }).map((_, i) => (
                  <div key={`empty-${i}`} className={styles.date}></div>
                ))}
                {/* Días del mes */}
                {calendarDates.map((date) => (
                  <div
                    key={date}
                    className={`${styles.date} ${date === activeDate ? styles.activeDate : ''} ${date > 25 ? styles.inactive : ''}`}
                  >
                    {date}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Próximos eventos */}
          <div className={`${styles.panel} ${styles.eventsPanel}`}>
            <div className={styles.panelHeader}>
              <h4>Próximos eventos</h4>
              <a href="#">Ver todos</a>
            </div>
            <div className={styles.eventItem}>
              <div className={styles.eventIcon}>
                <FaRegCalendarAlt size={20} />
              </div>
              <div className={styles.eventDetails}>
                <span className={styles.eventTitle}>Audiencia - Caso Tech Solutions</span>
                <span className={styles.eventTime}>16 Jun 2025, 10:00 AM</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Panel de Documentos recientes (debajo del grid principal) */}
      <div className={`${styles.panel} ${styles.docsPanel}`}>
        <div className={styles.panelHeader}>
          <h4>Documentos recientes</h4>
          <a href="#">Ver todos</a>
        </div>
        <ul className={styles.docsList}>
          {recentDocs.map((doc, index) => (
            <li key={index} className={styles.docItem}>
              <div className={styles.docInfo}>
                <div className={styles.docIcon}>
                  <FaRegFile size={24} />
                </div>
                <div className={styles.docDetails}>
                  <span className={styles.docName}>{doc.name}</span>
                  <span className={styles.docModified}>Modificado: {doc.modified}</span>
                </div>
              </div>
              <div className={styles.docActions}>
                <span className={`${styles.docActionStatus} ${styles[doc.color]}`}>{doc.status}</span>
                <button className={styles.docActionButton}><FaEllipsisH /></button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}