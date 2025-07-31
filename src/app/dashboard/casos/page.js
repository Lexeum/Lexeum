'use client';
import { useState, useMemo, useRef, useEffect } from 'react';
import styles from './casos.module.css';
import { FiSearch, FiPlus, FiMoreHorizontal, FiX, FiChevronLeft, FiChevronRight, FiEdit, FiTrash2 } from 'react-icons/fi';
import { format } from 'date-fns';

// --- DEFINICIÓN DE DATOS FUERA DEL COMPONENTE (MÁS ROBUSTO) ---
// Estos datos se cargan una sola vez y están disponibles para todos los hooks
const ALL_CLIENTS_DATA = [
  { name: 'Tech Solutions', initials: 'TS' },
  { name: 'María García', initials: 'MG' },
  { name: 'Pedro López', initials: 'PL' },
  { name: 'Ana Martínez', initials: 'AM' },
  { name: 'Javier Ruiz', initials: 'JR' },
  { name: 'Sofía Gómez', initials: 'SG' },
  { name: 'Carlos Velez', initials: 'CV' },
  { name: 'Elena Botero', initials: 'EB' },
  { name: 'Empresa A', initials: 'EA' },
  { name: 'Cliente X', initials: 'CX' },
];

const INITIAL_CASES_DATA = [
  { id: 1, title: 'Demanda por incumplimiento contractual', caseId: '#CASO-2025-001', client: 'Tech Solutions', clientInitials: 'TS', status: 'En curso', statusColor: 'green', startDate: '10 Jun 2025', endDate: '30 Jul 2025' },
  { id: 2, title: 'Revisión de contrato de arrendamiento', caseId: '#CASO-2025-002', client: 'María García', clientInitials: 'MG', status: 'En revisión', statusColor: 'yellow', startDate: '15 Jun 2025', endDate: '22 Jun 2025' },
  { id: 3, title: 'Derecho de petición - Servicios públicos', caseId: '#CASO-2025-003', client: 'Pedro López', clientInitials: 'PL', status: 'Urgente', statusColor: 'red', startDate: '18 Jun 2025', endDate: '25 Jun 2025' },
  { id: 4, title: 'Contrato de compraventa inmobiliaria', caseId: '#CASO-2025-004', client: 'Ana Martínez', clientInitials: 'AM', status: 'En curso', statusColor: 'green', startDate: '20 Jun 2025', endDate: '15 Jul 2025' },
  { id: 5, title: 'Reclamación de seguro de vivienda', caseId: '#CASO-2025-005', client: 'Javier Ruiz', clientInitials: 'JR', status: 'Completado', statusColor: 'blue', startDate: '05 Jun 2025', endDate: '19 Jun 2025' },
  { id: 6, title: 'Demanda laboral', caseId: '#CASO-2025-006', client: 'Sofía Gómez', clientInitials: 'SG', status: 'En curso', statusColor: 'green', startDate: '25 Jun 2025', endDate: '28 Jul 2025' },
  { id: 7, title: 'Divorcio de mutuo acuerdo', caseId: '#CASO-2025-007', client: 'Carlos Velez', clientInitials: 'CV', status: 'Completado', statusColor: 'blue', startDate: '28 Jun 2025', endDate: '20 Jul 2025' },
  { id: 8, title: 'Revisión de testamento', caseId: '#CASO-2025-008', client: 'Elena Botero', clientInitials: 'EB', status: 'En revisión', statusColor: 'yellow', startDate: '29 Jun 2025', endDate: '05 Jul 2025' },
  { id: 9, title: 'Contrato de prestación de servicios', caseId: '#CASO-2025-009', client: 'Empresa A', clientInitials: 'EA', status: 'Urgente', statusColor: 'red', startDate: '30 Jun 2025', endDate: '02 Jul 2025' },
  { id: 10, title: 'Demanda por deuda', caseId: '#CASO-2025-010', client: 'Cliente X', clientInitials: 'CX', status: 'En curso', statusColor: 'green', startDate: '30 Jun 2025', endDate: '15 Sep 2025' },
];

export default function CasosPage() {
  const ITEMS_PER_PAGE = 5;
  
  // --- Estados del componente ---
  const [cases, setCases] = useState(INITIAL_CASES_DATA); // Usamos los datos iniciales aquí
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterClient, setFilterClient] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [caseToEdit, setCaseToEdit] = useState(null); // Estado para la edición
  const [showActionsMenuId, setShowActionsMenuId] = useState(null); // Estado para el menú de acciones
  const actionsMenuRef = useRef(null);

  // --- Datos para los filtros (únicos y dinámicos) ---
  // AHORA USAN LAS CONSTANTES DEFINIDAS ARRIBA
  const statuses = useMemo(() => ['Todos', ...new Set(INITIAL_CASES_DATA.map(c => c.status))], []);
  const clients = useMemo(() => ['Todos', ...ALL_CLIENTS_DATA.map(c => c.name)], []);

  // --- Lógica de filtrado y búsqueda ---
  const filteredAndSearchedCases = useMemo(() => {
    // Convertimos el término de búsqueda a minúsculas para una búsqueda sin distinción de mayúsculas
    const lowercasedSearchTerm = searchTerm.toLowerCase();

    return cases.filter(c => {
      // 1. Filtro por término de búsqueda (título y caseId)
      const matchesSearch = c.title.toLowerCase().includes(lowercasedSearchTerm) ||
                            c.caseId.toLowerCase().includes(lowercasedSearchTerm);

      // 2. Filtro por estado
      const matchesStatus = filterStatus === 'Todos' || filterStatus === '' || c.status === filterStatus;

      // 3. Filtro por cliente
      const matchesClient = filterClient === 'Todos' || filterClient === '' || c.client === filterClient;
      
      // La fila debe cumplir con todos los filtros para ser mostrada
      return matchesSearch && matchesStatus && matchesClient;
    });
  }, [cases, searchTerm, filterStatus, filterClient]); // Las dependencias de useMemo son clave aquí

  // --- Lógica de paginación ---
  const totalCases = filteredAndSearchedCases.length;
  const totalPages = Math.ceil(totalCases / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedCases = filteredAndSearchedCases.slice(startIndex, endIndex);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const pageNumbers = useMemo(() => {
    const pages = [];
    for (let i = 1; i <= totalPages; i++) {
      pages.push(i);
    }
    return pages;
  }, [totalPages]);
  
  // --- Lógica del Modal "Nuevo/Editar Caso" ---
  const [newCase, setNewCase] = useState({
    title: '', client: ALL_CLIENTS_DATA[0].name, status: 'En curso', startDate: '', endDate: '',
  });

  // Efecto para cerrar el menú de acciones al hacer clic fuera
  useEffect(() => {
    function handleClickOutside(event) {
      if (actionsMenuRef.current && !actionsMenuRef.current.contains(event.target)) {
        setShowActionsMenuId(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [actionsMenuRef]);

  const handleOpenModalForNewCase = () => {
    setCaseToEdit(null); // Resetear estado de edición
    setNewCase({
      title: '', client: ALL_CLIENTS_DATA[0].name, status: 'En curso', startDate: '', endDate: '',
    });
    setShowModal(true);
  };

  const handleOpenModalForEdit = (caseItem) => {
    setCaseToEdit(caseItem); // Establecer el caso a editar
    setNewCase({
      title: caseItem.title,
      client: caseItem.client,
      status: caseItem.status,
      // Convertimos el formato de fecha para que el input type="date" lo entienda
      startDate: format(new Date(caseItem.startDate), 'yyyy-MM-dd'),
      endDate: caseItem.endDate !== '-' ? format(new Date(caseItem.endDate), 'yyyy-MM-dd') : '',
    });
    setShowModal(true);
    setShowActionsMenuId(null); // Cerrar menú
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setNewCase(prev => ({ ...prev, [name]: value }));
  };

  const handleAddNewOrEditCase = (e) => {
    e.preventDefault();
    if (!newCase.title || !newCase.client || !newCase.startDate) {
      alert('Por favor, completa los campos requeridos.');
      return;
    }

    const selectedClient = ALL_CLIENTS_DATA.find(c => c.name === newCase.client);
    const clientInitials = selectedClient ? selectedClient.initials : '';
    const statusColorMap = { 'En curso': 'green', 'En revisión': 'yellow', 'Urgente': 'red', 'Completado': 'blue' };
    const statusColor = statusColorMap[newCase.status] || 'green';

    const caseDetails = {
      title: newCase.title,
      client: newCase.client,
      clientInitials: clientInitials,
      status: newCase.status,
      statusColor: statusColor,
      // Formateamos las fechas de vuelta al formato de visualización
      startDate: newCase.startDate ? format(new Date(newCase.startDate), 'dd MMM yyyy') : '-',
      endDate: newCase.endDate ? format(new Date(newCase.endDate), 'dd MMM yyyy') : '-',
    };

    if (caseToEdit) {
      // Lógica de EDICIÓN: Actualiza el caso existente
      setCases(cases.map(c => c.id === caseToEdit.id ? { ...c, ...caseDetails } : c));
    } else {
      // Lógica de NUEVO CASO: Crea un nuevo caso
      const newId = cases.length > 0 ? Math.max(...cases.map(c => c.id)) + 1 : 1;
      const caseId = `#CASO-${format(new Date(), 'yyyyMMdd')}-${newId}`;
      setCases([{ id: newId, caseId: caseId, ...caseDetails }, ...cases]);
    }
    
    setShowModal(false);
    setCaseToEdit(null); // Resetear estado de edición
    setNewCase({ title: '', client: ALL_CLIENTS_DATA[0].name, status: 'En curso', startDate: '', endDate: '' });
  };

  const handleDeleteCase = (id) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este caso?')) {
      setCases(cases.filter(c => c.id !== id));
      setShowActionsMenuId(null); // Cerrar menú
    }
  };

  /**
   * Convierte un array de objetos JSON a una cadena de texto CSV.
   * @param {Array<Object>} data El array de datos a convertir.
   * @returns {string} La cadena de texto en formato CSV.
   */
  const convertToCSV = (data) => {
    if (!data || data.length === 0) return '';

    // Mapeamos los headers de las columnas a un formato legible
    const headersMap = {
        'caseId': 'ID del Caso',
        'title': 'Título',
        'client': 'Cliente',
        'status': 'Estado',
        'startDate': 'Fecha de Inicio',
        'endDate': 'Fecha Límite'
        // Puedes agregar más headers si los necesitas
    };
    
    // Obtenemos las claves de los objetos que queremos exportar
    const keysToExport = ['caseId', 'title', 'client', 'status', 'startDate', 'endDate'];

    // Creamos la fila de encabezados
    const csvHeaders = keysToExport.map(key => `"${headersMap[key] || key}"`).join(',');

    // Creamos las filas de datos
    const csvRows = data.map(row => {
        return keysToExport.map(key => {
            let value = row[key];
            // Si el valor contiene comas o comillas, lo encerramos entre comillas dobles
            if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
                // Escapamos las comillas internas
                value = value.replace(/"/g, '""');
                value = `"${value}"`;
            }
            return value;
        }).join(',');
    }).join('\n');

    return `${csvHeaders}\n${csvRows}`;
  };

  /**
   * Dispara la descarga de un archivo CSV en el navegador.
   */
  const handleExport = () => {
    if (filteredAndSearchedCases.length === 0) {
        alert('No hay casos para exportar con los filtros actuales.');
        return;
    }

    const csvString = convertToCSV(filteredAndSearchedCases);
    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    const filename = `casos-exportados-${format(new Date(), 'yyyy-MM-dd_HHmmss')}.csv`;
    
    link.href = url;
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Libera el objeto URL
    URL.revokeObjectURL(url);
  };


  return (
    <div className={styles.casesContainer}>
      {/* HEADER DE LA PÁGINA */}
      <header className={styles.pageHeader}>
        <div className={styles.titleContainer}>
          <h1 className={styles.pageTitle}>Casos</h1>
          <p className={styles.pageSubtitle}>Gestiona todos tus casos legales</p>
        </div>
        <div className={styles.headerButtons}>
          <button className={styles.exportButton} onClick={handleExport}>
            Exportar
          </button>
          <button className={styles.newCaseButton} onClick={handleOpenModalForNewCase}>
            <FiPlus /> Nuevo caso
          </button>
        </div>
      </header>

      {/* PANEL DE FILTROS Y BÚSQUEDA */}
      <div className={styles.filtersContainer}>
        <div className={styles.searchInputWrapper}>
          <FiSearch className={styles.searchIcon} size={18} />
          <input
            type="text"
            placeholder="Buscar casos..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1); // Resetear paginación al buscar
            }}
            className={styles.searchInput}
          />
        </div>
        
        <select
          value={filterStatus}
          onChange={(e) => {
            setFilterStatus(e.target.value);
            setCurrentPage(1);
          }}
          className={styles.filterSelect}
        >
          {statuses.map(status => <option key={status} value={status}>{status}</option>)}
        </select>
        
        <select
          value={filterClient}
          onChange={(e) => {
            setFilterClient(e.target.value);
            setCurrentPage(1);
          }}
          className={styles.filterSelect}
        >
          {clients.map(client => <option key={client} value={client}>{client}</option>)}
        </select>
        
        <select className={styles.filterSelect}>
          <option value="">Fecha</option>
          {/* Opciones de fecha (e.g., Última semana, Último mes, etc.) */}
        </select>
      </div>

      {/* TABLA DE CASOS */}
      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Caso</th>
              <th>Cliente</th>
              <th>Estado</th>
              <th>Fecha inicio</th>
              <th>Fecha límite</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {paginatedCases.length > 0 ? (
              paginatedCases.map(c => (
                <tr key={c.id}>
                  <td>
                    <span className={styles.caseDetails}>{c.title}</span>
                    <span className={styles.caseId}>{c.caseId}</span>
                  </td>
                  <td>
                    <div className={styles.clientCell}>
                      <div className={styles.clientAvatar}>{c.clientInitials}</div>
                      <span>{c.client}</span>
                    </div>
                  </td>
                  <td>
                    <span className={`${styles.badge} ${styles[c.statusColor]}`}>{c.status}</span>
                  </td>
                  <td>{c.startDate}</td>
                  <td>{c.endDate}</td>
                  <td>
                    <div className={styles.actionBtnWrapper}>
                        <button className={styles.actionBtn} onClick={(e) => {
                          e.stopPropagation(); // Evita que se cierre el menú si se hace clic en la fila
                          setShowActionsMenuId(showActionsMenuId === c.id ? null : c.id);
                        }}>
                            <FiMoreHorizontal />
                        </button>
                        {/* Menú de acciones condicional */}
                        {showActionsMenuId === c.id && (
                            <div ref={actionsMenuRef} className={styles.actionsMenu}>
                                <button onClick={() => handleOpenModalForEdit(c)}>
                                    <FiEdit size={14} style={{ marginRight: '8px' }} /> Editar
                                </button>
                                <button className={styles.deleteBtn} onClick={() => handleDeleteCase(c.id)}>
                                    <FiTrash2 size={14} style={{ marginRight: '8px' }} /> Eliminar
                                </button>
                            </div>
                        )}
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-light)' }}>
                  No se encontraron casos.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* PAGINACIÓN */}
      {totalCases > 0 && (
        <div className={styles.pagination}>
          <span className={styles.pageInfo}>
            Mostrando {startIndex + 1}-{Math.min(endIndex, totalCases)} de {totalCases} casos
          </span>
          <div className={styles.pageControls}>
            <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} className={styles.pageButton}>
              <FiChevronLeft size={16} />
            </button>
            {pageNumbers.map(page => (
              <button key={page} onClick={() => handlePageChange(page)} className={`${styles.pageButton} ${page === currentPage ? styles.active : ''}`}>
                {page}
              </button>
            ))}
            <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages} className={styles.pageButton}>
              <FiChevronRight size={16} />
            </button>
          </div>
        </div>
      )}

      {/* MODAL PARA AGREGAR/EDITAR CASO */}
      {showModal && (
        <div className={styles.modalBackdrop}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <h3 className={styles.modalTitle}>{caseToEdit ? 'Editar caso' : 'Nuevo caso'}</h3>
              <button className={styles.closeButton} onClick={() => setShowModal(false)}>&times;</button>
            </div>
            <form onSubmit={handleAddNewOrEditCase} className={styles.modalForm}>
              <div className={styles.formGrid}>
                <div className={styles.formGroup}>
                  <label htmlFor="caseTitle">Título del caso</label>
                  <input type="text" id="caseTitle" name="title" value={newCase.title} onChange={handleFormChange} required />
                </div>
                <div className={styles.formGroup}>
                  <label htmlFor="clientName">Cliente</label>
                  <select id="clientName" name="client" value={newCase.client} onChange={handleFormChange} className={styles.filterSelect} required>
                    {ALL_CLIENTS_DATA.map((client, index) => (<option key={index} value={client.name}>{client.name}</option>))}
                  </select>
                </div>
                <div className={styles.formGroup}>
                  <label htmlFor="status">Estado</label>
                  <select id="status" name="status" value={newCase.status} onChange={handleFormChange}>
                    <option>En curso</option>
                    <option>En revisión</option>
                    <option>Urgente</option>
                    <option>Completado</option>
                  </select>
                </div>
                <div className={styles.formGroup}>
                  <label htmlFor="startDate">Fecha inicio</label>
                  <input type="date" id="startDate" name="startDate" value={newCase.startDate} onChange={handleFormChange} required />
                </div>
                <div className={styles.formGroup}>
                  <label htmlFor="endDate">Fecha límite</label>
                  <input type="date" id="endDate" name="endDate" value={newCase.endDate} onChange={handleFormChange} />
                </div>
              </div>
              <div className={styles.modalActions}>
                <button type="button" className={`${styles.modalButton} ${styles.cancelButton}`} onClick={() => setShowModal(false)}>
                  Cancelar
                </button>
                <button type="submit" className={`${styles.modalButton} ${styles.saveButton}`}>
                  {caseToEdit ? 'Guardar cambios' : 'Guardar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}