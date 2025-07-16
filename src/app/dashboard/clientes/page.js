'use client';
import { useState, useMemo, useRef, useEffect } from 'react';
import styles from './clientes.module.css';
import { FiSearch, FiPlus, FiMoreHorizontal, FiX, FiChevronLeft, FiChevronRight, FiEdit, FiTrash2, FiUpload, FiList, FiGrid } from 'react-icons/fi';
import { format } from 'date-fns';
import { es } from 'date-fns/locale/es';

// --- DEFINICIÓN DE DATOS FUERA DEL COMPONENTE (MÁS ROBUSTO) ---
const INITIAL_CLIENTS_DATA = [
  { id: 1, name: 'Tech Solutions SL', email: 'tech@example.com', initials: 'TS', type: 'Empresa', contact: '+57 320 567 7789', activeCases: 1, registrationDate: '10 Ene 2025' },
  { id: 2, name: 'María García', email: 'maria@example.com', initials: 'MG', type: 'Particular', contact: '+57 320 567 7789', activeCases: 1, registrationDate: '15 Mar 2025' },
  { id: 3, name: 'Pedro López', email: 'pedro@example.com', initials: 'PL', type: 'Particular', contact: '+57 320 567 7789', activeCases: 1, registrationDate: '05 May 2025' },
  { id: 4, name: 'Ana Martínez', email: 'ana@example.com', initials: 'AM', type: 'Particular', contact: '+57 320 567 7789', activeCases: 1, registrationDate: '12 Jun 2025' },
  { id: 5, name: 'Javier Ruiz', email: 'javier@example.com', initials: 'JR', type: 'Particular', contact: '+57 320 567 7789', activeCases: 1, registrationDate: '20 Feb 2025' },
  { id: 6, name: 'Innovate Group', email: 'contact@innovate.com', initials: 'IG', type: 'Empresa', contact: '+57 311 234 5678', activeCases: 3, registrationDate: '01 Abr 2025' },
  { id: 7, name: 'Laura Gómez', email: 'laura@example.com', initials: 'LG', type: 'Particular', contact: '+57 300 987 6543', activeCases: 0, registrationDate: '25 Abr 2025' },
  { id: 8, name: 'Global Tech SA', email: 'info@globaltech.com', initials: 'GT', type: 'Empresa', contact: '+57 315 123 4567', activeCases: 2, registrationDate: '08 May 2025' },
];

export default function ClientesPage() {
  const ITEMS_PER_PAGE = 5;

  // --- Estados del componente ---
  const [clients, setClients] = useState(INITIAL_CLIENTS_DATA);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('Todos');
  const [filterCases, setFilterCases] = useState('Todos');
  const [currentPage, setCurrentPage] = useState(1);
  const [showActionsMenuId, setShowActionsMenuId] = useState(null);
  const actionsMenuRef = useRef(null);
  const [showModal, setShowModal] = useState(false);
  const [clientToEdit, setClientToEdit] = useState(null);
  const [viewMode, setViewMode] = useState('list'); // 'list' o 'grid'

  // --- Lógica de filtrado y búsqueda ---
  const filteredClients = useMemo(() => {
    const lowercasedSearchTerm = searchTerm.toLowerCase();

    return clients.filter(client => {
      const matchesSearch = client.name.toLowerCase().includes(lowercasedSearchTerm) ||
                            client.email.toLowerCase().includes(lowercasedSearchTerm) ||
                            client.contact.includes(lowercasedSearchTerm);
      
      const matchesType = filterType === 'Todos' || client.type === filterType;

      const matchesCases = filterCases === 'Todos' || (filterCases === 'Activos' && client.activeCases > 0) || (filterCases === 'Sin casos' && client.activeCases === 0);
      
      return matchesSearch && matchesType && matchesCases;
    });
  }, [clients, searchTerm, filterType, filterCases]);

  // --- Lógica de paginación ---
  const totalClients = filteredClients.length;
  const totalPages = Math.ceil(totalClients / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedClients = filteredClients.slice(startIndex, endIndex);

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
  
  // --- Lógica del Modal (Crear/Editar) ---
  const [newClient, setNewClient] = useState({
    name: '',
    type: 'Particular', // Default
    idNumber: '',
    address: '',
    email: '',
    phone: '',
  });

  const handleOpenModalForNew = () => {
    setClientToEdit(null);
    setNewClient({ name: '', type: 'Particular', idNumber: '', address: '', email: '', phone: '' });
    setShowModal(true);
  };

  const handleOpenModalForEdit = (client) => {
    setClientToEdit(client);
    setNewClient({
      name: client.name,
      type: client.type,
      // Suponemos que Documento de identificación y Dirección están en el estado del cliente
      idNumber: '', // No está en mock data, pero lo añadimos
      address: '',  // No está en mock data, pero lo añadimos
      email: client.email,
      phone: client.contact,
    });
    setShowModal(true);
    setShowActionsMenuId(null);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setNewClient(prev => ({ ...prev, [name]: value }));
  };

  const handleCreateOrUpdateClient = (e) => {
    e.preventDefault();
    if (!newClient.name || !newClient.email || !newClient.phone) {
      alert('Por favor, completa los campos requeridos.');
      return;
    }

    const clientDetails = {
      name: newClient.name,
      email: newClient.email,
      type: newClient.type,
      contact: newClient.phone,
      // Campos extra del formulario
      idNumber: newClient.idNumber,
      address: newClient.address,
    };
    
    if (clientToEdit) {
      // Lógica de EDICIÓN
      setClients(clients.map(c => c.id === clientToEdit.id ? { ...c, ...clientDetails } : c));
    } else {
      // Lógica de CREAR
      const newId = clients.length > 0 ? Math.max(...clients.map(c => c.id)) + 1 : 1;
      const newClientWithDetails = {
        id: newId,
        initials: newClient.name.split(' ').map(n => n[0]).join('').toUpperCase(),
        activeCases: 0,
        registrationDate: format(new Date(), 'dd MMM yyyy', { locale: es }),
        ...clientDetails,
      };
      setClients([newClientWithDetails, ...clients]);
    }

    setShowModal(false);
    setClientToEdit(null);
    setNewClient({ name: '', type: 'Particular', idNumber: '', address: '', email: '', phone: '' });
  };

  // --- Lógica de Acciones ---
  const handleDeleteClient = (id) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este cliente?')) {
      setClients(clients.filter(c => c.id !== id));
      setShowActionsMenuId(null);
    }
  };
  const handleExport = () => alert('Exportando a CSV...');

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

  return (
    <div className={styles.clientsContainer}>
      {/* HEADER DE LA PÁGINA */}
      <header className={styles.pageHeader}>
        <div className={styles.titleContainer}>
          <h1 className={styles.pageTitle}>Clientes</h1>
          <p className={styles.pageSubtitle}>Gestiona tu directorio de clientes</p>
        </div>
        <div className={styles.headerButtons}>
          <button className={styles.exportButton} onClick={handleExport}>Exportar</button>
          <button className={styles.newClientButton} onClick={handleOpenModalForNew}>
            <FiPlus /> Nuevo cliente
          </button>
        </div>
      </header>

      {/* BARRA DE BÚSQUEDA Y FILTROS */}
      <div className={styles.searchFiltersRow}>
        <div className={styles.searchInputWrapper}>
          <FiSearch className={styles.searchIcon} size={18} />
          <input
            type="text"
            placeholder="Buscar clientes..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className={styles.searchInput}
          />
        </div>
        
        <select
          value={filterType}
          onChange={(e) => {
            setFilterType(e.target.value);
            setCurrentPage(1);
          }}
          className={styles.filterSelect}
        >
          <option value="Todos">Tipo</option>
          <option value="Particular">Particular</option>
          <option value="Empresa">Empresa</option>
        </select>
        
        <select
          value={filterCases}
          onChange={(e) => {
            setFilterCases(e.target.value);
            setCurrentPage(1);
          }}
          className={styles.filterSelect}
        >
          <option value="Todos">Casos</option>
          <option value="Activos">Activos</option>
          <option value="Sin casos">Sin casos</option>
        </select>

        {/* Botones de vista */}
        <div className={styles.viewToggle}>
          <button className={`${styles.viewToggleButton} ${viewMode === 'list' ? styles.active : ''}`} onClick={() => setViewMode('list')}>
            <FiList size={20} />
          </button>
          <button className={`${styles.viewToggleButton} ${viewMode === 'grid' ? styles.active : ''}`} onClick={() => setViewMode('grid')}>
            <FiGrid size={20} />
          </button>
        </div>
      </div>

      {/* TABLA DE CLIENTES */}
      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Cliente</th>
              <th>Tipo</th>
              <th>Contacto</th>
              <th>Casos activos</th>
              <th>Fecha registro</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {paginatedClients.length > 0 ? (
              paginatedClients.map(client => (
                <tr key={client.id}>
                  <td>
                    <div className={styles.clientCell}>
                      <div className={styles.clientAvatar}>{client.initials}</div>
                      <div className={styles.clientNameEmail}>
                        <span className={styles.clientName}>{client.name}</span>
                        <span className={styles.clientEmail}>{client.email}</span>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className={`${styles.typeBadge} ${styles[client.type.toLowerCase()]}`}>
                      {client.type}
                    </span>
                  </td>
                  <td>{client.contact}</td>
                  <td>{client.activeCases}</td>
                  <td>{client.registrationDate}</td>
                  <td>
                    <div className={styles.actionBtnWrapper}>
                        <button className={styles.actionBtn} onClick={(e) => {
                          e.stopPropagation();
                          setShowActionsMenuId(showActionsMenuId === client.id ? null : client.id);
                        }}>
                            <FiMoreHorizontal />
                        </button>
                        {showActionsMenuId === client.id && (
                            <div ref={actionsMenuRef} className={styles.actionsMenu}>
                                <button onClick={() => handleOpenModalForEdit(client)}>
                                    <FiEdit size={14} /> Editar
                                </button>
                                <button className={styles.deleteBtn} onClick={() => handleDeleteClient(client.id)}>
                                    <FiTrash2 size={14} /> Eliminar
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
                  No se encontraron clientes.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* PAGINACIÓN */}
      {totalClients > 0 && (
        <div className={styles.pagination}>
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className={`${styles.pageButton}`}
          >
            <FiChevronLeft size={16} />
          </button>
          <div className={styles.pageControls}>
            {pageNumbers.map(page => (
              <button
                key={page}
                onClick={() => handlePageChange(page)}
                className={`${styles.pageButton} ${page === currentPage ? styles.active : ''}`}
              >
                {page}
              </button>
            ))}
          </div>
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={`${styles.pageButton}`}
          >
            <FiChevronRight size={16} />
          </button>
        </div>
      )}
      
      {/* MODAL PARA CREAR/EDITAR CLIENTE */}
      {showModal && (
        <div className={styles.modalBackdrop}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <h3 className={styles.modalTitle}>{clientToEdit ? 'Editar cliente' : 'Nuevo cliente'}</h3>
              <button className={styles.closeButton} onClick={() => setShowModal(false)}>&times;</button>
            </div>
            <form onSubmit={handleCreateOrUpdateClient} className={styles.modalForm}>
              <div className={styles.formGrid}>
                {/* Nombre */}
                <div className={styles.formGroup}>
                  <label htmlFor="name">Nombre</label>
                  <input type="text" id="name" name="name" value={newClient.name} onChange={handleFormChange} required />
                </div>
                {/* Tipo de persona */}
                <div className={styles.formGroup}>
                  <label htmlFor="type">Tipo de persona</label>
                  <select id="type" name="type" value={newClient.type} onChange={handleFormChange}>
                    <option value="Particular">Particular</option>
                    <option value="Empresa">Empresa</option>
                  </select>
                </div>
                {/* Documento de identificación */}
                <div className={styles.formGroup}>
                  <label htmlFor="idNumber">Documento de identificación</label>
                  <input type="text" id="idNumber" name="idNumber" value={newClient.idNumber} onChange={handleFormChange} />
                </div>
                {/* Dirección */}
                <div className={styles.formGroup}>
                  <label htmlFor="address">Dirección</label>
                  <input type="text" id="address" name="address" value={newClient.address} onChange={handleFormChange} />
                </div>
                {/* Correo */}
                <div className={styles.formGroup}>
                  <label htmlFor="email">Correo</label>
                  <input type="email" id="email" name="email" value={newClient.email} onChange={handleFormChange} required />
                </div>
                {/* Teléfono */}
                <div className={styles.formGroup}>
                  <label htmlFor="phone">Teléfono</label>
                  <input type="tel" id="phone" name="phone" value={newClient.phone} onChange={handleFormChange} required />
                </div>
              </div>
              <div className={styles.modalActions}>
                <button type="button" className={`${styles.modalButton} ${styles.cancelButton}`} onClick={() => setShowModal(false)}>
                  Cancelar
                </button>
                <button type="submit" className={`${styles.modalButton} ${styles.saveButton}`}>
                  {clientToEdit ? 'Guardar cambios' : 'Guardar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}