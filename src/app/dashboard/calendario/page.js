'use client';
import { useState, useMemo, useEffect } from 'react';
import styles from './calendario.module.css';
import { FiChevronLeft, FiChevronRight, FiPlus } from 'react-icons/fi';
import { 
  format, 
  startOfMonth, 
  endOfMonth, 
  eachDayOfInterval, 
  isSameMonth, 
  isToday, 
  getDay, 
  addMonths, 
  subMonths,
  startOfWeek, // Nuevo
  endOfWeek, // Nuevo
  addWeeks, // Nuevo
  subWeeks, // Nuevo
  addDays, // Nuevo
  subDays, // Nuevo
  isSameWeek, // Nuevo
} from 'date-fns';
import { es } from 'date-fns/locale/es';

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [showModal, setShowModal] = useState(false);
  const [view, setView] = useState('Mes'); // 'Mes', 'Semana', 'Día'
  
  // Estado para los eventos del calendario con un "tipo" para el color
  const [events, setEvents] = useState([
    { id: 1, title: 'Client Meeting', time: '10:00 AM - 11:30 AM', date: '2025-06-30', type: 'purple' },
    { id: 2, title: 'Court Hearing', time: '2:00 PM - 4:00 PM', date: '2025-07-03', type: 'blue' },
    { id: 3, title: 'Filing Deadline', time: '5:00 PM', date: '2025-07-05', type: 'red' },
    { id: 4, title: 'Team Meeting', time: '9:00 AM - 10:00 AM', date: '2025-07-09', type: 'green' },
    { id: 5, title: 'Client Call', time: '1:00 PM - 2:00 PM', date: '2025-07-12', type: 'yellow' },
    { id: 6, title: 'Deposition', time: '10:00 AM - 2:00 PM', date: '2025-07-15', type: 'blue' },
    { id: 7, title: 'Strategy Meeting', time: '11:00 AM - 12:00 PM', date: '2025-07-17', type: 'purple' },
  ]);

  // Estado para el formulario de nuevo evento
  const [newEvent, setNewEvent] = useState({
    title: '',
    date: format(new Date(), 'yyyy-MM-dd'),
    time: '',
    type: 'blue' // Tipo por defecto
  });

  // ----------------------------------------------------
  // LÓGICA DE FECHAS DINÁMICA SEGÚN LA VISTA
  // ----------------------------------------------------
  const [currentDisplayDate, setCurrentDisplayDate] = useState(new Date());
  
  const daysInView = useMemo(() => {
    if (view === 'Mes') {
      // Mes: Siempre 6 semanas (42 celdas)
      const startOfCalendar = startOfMonth(currentDisplayDate);
      const dayOfWeekOfFirstDay = getDay(startOfCalendar); // 0 (Domingo) a 6 (Sábado)
      const daysFromPrevMonth = dayOfWeekOfFirstDay; // Offset para iniciar en Domingo
      const intervalStart = new Date(startOfCalendar);
      intervalStart.setDate(startOfCalendar.getDate() - daysFromPrevMonth);
      const intervalEnd = addDays(intervalStart, 41); // 42 días en total (6 semanas)
      return eachDayOfInterval({ start: intervalStart, end: intervalEnd });
    } else if (view === 'Semana') {
      // Semana: Días de la semana actual
      const weekStart = startOfWeek(currentDisplayDate, { locale: es, weekStartsOn: 0 }); // Domingo = 0
      const weekEnd = endOfWeek(currentDisplayDate, { locale: es, weekStartsOn: 0 });
      return eachDayOfInterval({ start: weekStart, end: weekEnd });
    } else { // 'Día'
      // Día: Un solo día
      return [currentDisplayDate];
    }
  }, [currentDisplayDate, view]);

  // Agrupar eventos por fecha para un acceso rápido
  const eventsByDate = useMemo(() => {
    const map = new Map();
    events.forEach(event => {
      if (!map.has(event.date)) {
        map.set(event.date, []);
      }
      map.get(event.date).push(event);
    });
    return map;
  }, [events]);

  // ----------------------------------------------------
  // NAVEGACIÓN Y TÍTULOS
  // ----------------------------------------------------
  const getHeaderTitle = () => {
    if (view === 'Mes') {
      return format(currentDisplayDate, 'MMMM yyyy', { locale: es });
    } else if (view === 'Semana') {
      const weekStart = startOfWeek(currentDisplayDate, { locale: es, weekStartsOn: 0 });
      const weekEnd = endOfWeek(currentDisplayDate, { locale: es, weekStartsOn: 0 });
      return `${format(weekStart, 'd MMM', { locale: es })} - ${format(weekEnd, 'd MMM yyyy', { locale: es })}`;
    } else { // 'Día'
      return format(currentDisplayDate, 'EEEE, d MMMM yyyy', { locale: es });
    }
  };

  const goToPrevious = () => {
    if (view === 'Mes') setCurrentDisplayDate(prev => subMonths(prev, 1));
    else if (view === 'Semana') setCurrentDisplayDate(prev => subWeeks(prev, 1));
    else setCurrentDisplayDate(prev => subDays(prev, 1));
  };

  const goToNext = () => {
    if (view === 'Mes') setCurrentDisplayDate(prev => addMonths(prev, 1));
    else if (view === 'Semana') setCurrentDisplayDate(prev => addWeeks(prev, 1));
    else setCurrentDisplayDate(prev => addDays(prev, 1));
  };

  const goToToday = () => {
    setCurrentDisplayDate(new Date());
    // Mantenemos la vista actual
  };

  // ----------------------------------------------------
  // MODAL Y FORMULARIO
  // ----------------------------------------------------
  const openModal = () => {
    setNewEvent(prev => ({ ...prev, date: format(currentDisplayDate, 'yyyy-MM-dd') }));
    setShowModal(true);
  };
  const closeModal = () => setShowModal(false);

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setNewEvent(prev => ({ ...prev, [name]: value }));
  };

  const handleSaveEvent = (e) => {
    e.preventDefault();
    if (!newEvent.title || !newEvent.date || !newEvent.time) {
      alert('Por favor, completa todos los campos.');
      return;
    }
    const id = Date.now();
    const newEventWithId = { ...newEvent, id };
    setEvents(prev => [...prev, newEventWithId]);
    closeModal();
    setNewEvent({ title: '', date: format(new Date(), 'yyyy-MM-dd'), time: '', type: 'blue' });
  };

  const daysOfWeek = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];

  // ----------------------------------------------------
  // RENDERIZADO CONDICIONAL DE LAS VISTAS
  // ----------------------------------------------------
  const renderCalendarView = () => {
    if (view === 'Mes') {
      return (
        <div className={styles.calendarGrid}>
          <div className={styles.weekdaysRow}>
            {daysOfWeek.map((day, index) => (
              <span key={index} className={styles.dayOfWeek}>{day}</span>
            ))}
          </div>
          {daysInView.map((day) => {
            const dayString = format(day, 'yyyy-MM-dd');
            const eventsForDay = eventsByDate.get(dayString) || [];
            
            return (
              <div
                key={dayString}
                className={`${styles.dayCell} 
                  ${isToday(day) ? styles.today : ''} 
                  ${!isSameMonth(day, currentDisplayDate) ? styles.inactive : ''}
                `}
              >
                <span className={styles.dayNumber}>{format(day, 'd')}</span>
                <div className={styles.eventsInDay}>
                  {eventsForDay.map(event => (
                    <div key={event.id} className={`${styles.eventCard} ${styles[event.type]}`}>
                      <span className={styles.eventTitle}>{event.title}</span>
                      <span className={styles.eventTime}>{event.time}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      );
    } else if (view === 'Semana') {
      return (
        <div className={styles.weekGrid}>
          <div className={styles.weekdaysRow}>
            {daysInView.map((day, index) => (
              <span key={index} className={`${styles.dayOfWeek} ${isToday(day) ? styles.todayDayHeader : ''}`}>
                {format(day, 'EEEE', { locale: es })}
                <span className={styles.dayNumberHeader}>{format(day, 'd')}</span>
              </span>
            ))}
          </div>
          {/* Aquí puedes renderizar las horas o un grid más complejo si lo necesitas */}
          <div className={styles.weekContent}>
            {daysInView.map(day => {
              const dayString = format(day, 'yyyy-MM-dd');
              const eventsForDay = eventsByDate.get(dayString) || [];
              return (
                <div key={dayString} className={styles.dayColumn}>
                  {eventsForDay.map(event => (
                    <div key={event.id} className={`${styles.eventCard} ${styles[event.type]}`}>
                      <span className={styles.eventTitle}>{event.title}</span>
                      <span className={styles.eventTime}>{event.time}</span>
                    </div>
                  ))}
                </div>
              );
            })}
          </div>
        </div>
      );
    } else { // 'Día'
      const day = daysInView[0];
      const dayString = format(day, 'yyyy-MM-dd');
      const eventsForDay = eventsByDate.get(dayString) || [];
      return (
        <div className={styles.dayView}>
          <div className={styles.eventsInDayList}>
            {eventsForDay.length > 0 ? (
              eventsForDay.map(event => (
                <div key={event.id} className={`${styles.eventCardList} ${styles[event.type]}`}>
                  <span className={styles.eventTitle}>{event.title}</span>
                  <span className={styles.eventTime}>{event.time}</span>
                </div>
              ))
            ) : (
              <p className={styles.noEvents}>No hay eventos para este día.</p>
            )}
          </div>
        </div>
      );
    }
  };


  return (
    <div className={styles.calendarPageContainer}>
      {/* Encabezado principal de la página */}
      <header className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Calendario</h1>
        <div className={styles.controlsGroup}>
          <div className={styles.viewToggle}>
            <button className={`${styles.viewButton} ${view === 'Mes' ? styles.active : ''}`} onClick={() => setView('Mes')}>Mes</button>
            <button className={`${styles.viewButton} ${view === 'Semana' ? styles.active : ''}`} onClick={() => setView('Semana')}>Semana</button>
            <button className={`${styles.viewButton} ${view === 'Día' ? styles.active : ''}`} onClick={() => setView('Día')}>Día</button>
          </div>
          <button className={styles.addEventButton} onClick={openModal}>
            <FiPlus /> Nuevo Evento
          </button>
        </div>
      </header>

      {/* Calendario Principal */}
      <div className={styles.calendarWrapper}>
        {/* Navegación del mes/semana/día */}
        <div className={styles.calendarNavHeader}>
          <button className={styles.navButton} onClick={goToPrevious}>
            <FiChevronLeft size={20} />
          </button>
          <h2 className={styles.monthYearDisplay}>
            {getHeaderTitle()}
          </h2>
          <button className={styles.navButton} onClick={goToNext}>
            <FiChevronRight size={20} />
          </button>
          <button className={styles.todayButton} onClick={goToToday}>Hoy</button>
        </div>

        {/* Renderiza la vista de calendario seleccionada */}
        {renderCalendarView()}

      </div>

      {/* Modal para agregar evento */}
      {showModal && (
        <div className={styles.modalBackdrop}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <h3 className={styles.modalTitle}>Agregar nuevo evento</h3>
              <button className={styles.closeButton} onClick={closeModal}>
                &times;
              </button>
            </div>
            <form className={styles.modalForm} onSubmit={handleSaveEvent}>
              <div className={styles.formGroup}>
                <label htmlFor="title">Título</label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={newEvent.title}
                  onChange={handleFormChange}
                  placeholder="Ej: Audiencia, Reunión..."
                  required
                />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="date">Fecha</label>
                <input
                  type="date"
                  id="date"
                  name="date"
                  value={newEvent.date}
                  onChange={handleFormChange}
                  required
                />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="time">Hora</label>
                <input
                  type="text"
                  id="time"
                  name="time"
                  value={newEvent.time}
                  onChange={handleFormChange}
                  placeholder="Ej: 10:00 AM - 11:00 AM"
                  required
                />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="type">Tipo (Color)</label>
                <select id="type" name="type" value={newEvent.type} onChange={handleFormChange}>
                  <option value="purple">Reunión con Cliente</option>
                  <option value="blue">Audiencia</option>
                  <option value="green">Reunión de Equipo</option>
                  <option value="yellow">Llamada</option>
                  <option value="red">Plazo / Vencimiento</option>
                </select>
              </div>
              <div className={styles.modalActions}>
                <button type="button" className={`${styles.modalButton} ${styles.cancelButton}`} onClick={closeModal}>
                  Cancelar
                </button>
                <button type="submit" className={`${styles.modalButton} ${styles.saveButton}`}>
                  Guardar
                </button>
                </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}