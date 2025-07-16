'use client';
import { useState, useMemo, useRef, useEffect } from 'react';
import styles from './documentos.module.css';
import { FiSearch, FiUpload, FiFileText, FiMoreHorizontal, FiChevronLeft, FiChevronRight, FiEdit, FiTrash2, FiDownload, FiFilter } from 'react-icons/fi';
import { format } from 'date-fns';

// --- DEFINICIÓN DE DATOS FUERA DEL COMPONENTE (EN ESPAÑOL) ---
const INITIAL_DOCUMENTS_DATA = [
  { id: 1, name: 'Contrato_Smith_v2_final.docx', type: 'Documento', case: 'Caso Smith vs. Jones', date: '12 de mayo de 2023', size: '2.4 MB', iconColor: '#3182ce' },
  { id: 2, name: 'Evidencia_Fotos_Caso123.pdf', type: 'PDF', case: 'Sucesión Johnson', date: '10 de mayo de 2023', size: '8.7 MB', iconColor: '#dc2626' },
  { id: 3, name: 'Estado_Financiero_2023.xlsx', type: 'Hoja de cálculo', case: 'Divorcio Williams', date: '8 de mayo de 2023', size: '1.2 MB', iconColor: '#22c55e' },
  { id: 4, name: 'Transcripcion_Declaracion_Brown.pdf', type: 'PDF', case: 'Caso Brown vs. Estado', date: '5 de mayo de 2023', size: '4.8 MB', iconColor: '#dc2626' },
  { id: 5, name: 'Acuerdo_Cliente_v1.docx', type: 'Documento', case: 'Lopez S.A.S.', date: '28 de abril de 2023', size: '1.5 MB', iconColor: '#3182ce' },
  { id: 6, name: 'Factura_2023_04.pdf', type: 'PDF', case: 'Lopez S.A.S.', date: '25 de abril de 2023', size: '0.5 MB', iconColor: '#dc2626' },
  { id: 7, name: 'Notas_Reunion_Caso_ABC.docx', type: 'Documento', case: 'Caso ABC', date: '22 de abril de 2023', size: '0.8 MB', iconColor: '#3182ce' },
  { id: 8, name: 'Informe_Auditoria_2022.xlsx', type: 'Hoja de cálculo', case: 'Caso ABC', date: '18 de abril de 2023', size: '3.1 MB', iconColor: '#22c55e' },
];

export default function DocumentosPage() {
  const ITEMS_PER_PAGE = 5;

  // --- Estados del componente ---
  const [documents, setDocuments] = useState(INITIAL_DOCUMENTS_DATA);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('Todos'); // 'Todos' como valor por defecto
  const [filterDate, setFilterDate] = useState('Recientes');
  const [currentPage, setCurrentPage] = useState(1);
  const [showActionsMenuId, setShowActionsMenuId] = useState(null);
  const actionsMenuRef = useRef(null);

  // --- Lógica de filtrado y búsqueda ---
  const filteredDocuments = useMemo(() => {
    const lowercasedSearchTerm = searchTerm.toLowerCase();
    
    return documents.filter(doc => {
      // 1. Filtro por término de búsqueda (nombre del documento y caso)
      const matchesSearch = doc.name.toLowerCase().includes(lowercasedSearchTerm) ||
                            doc.case.toLowerCase().includes(lowercasedSearchTerm);
      
      // 2. Filtro por tipo (ahora usa los valores en español)
      const matchesType = filterType === 'Todos' || doc.type === filterType;
      
      // 3. Filtro por fecha (lógica simple de ejemplo)
      const matchesDate = true; // Por ahora, no se filtra por fecha

      return matchesSearch && matchesType && matchesDate;
    });
  }, [documents, searchTerm, filterType, filterDate]);

  // --- Lógica de paginación ---
  const totalDocuments = filteredDocuments.length;
  const totalPages = Math.ceil(totalDocuments / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedDocuments = filteredDocuments.slice(startIndex, endIndex);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const pageNumbers = useMemo(() => {
    const pages = [];
    // Muestra solo 1, 2, 3, etc., sin "..."
    for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
    }
    return pages;
  }, [totalPages]);

  // --- Lógica de Acciones ---
  const handleDownload = (docId) => {
    const doc = documents.find(d => d.id === docId);
    alert(`Descargando: ${doc.name}`);
    setShowActionsMenuId(null);
  };

  const handleDelete = (docId) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este documento?')) {
      setDocuments(documents.filter(d => d.id !== docId));
      setShowActionsMenuId(null);
    }
  };

  const handleEdit = (docId) => {
    const doc = documents.find(d => d.id === docId);
    alert(`Editando: ${doc.name}`);
    setShowActionsMenuId(null);
  };

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
    <div className={styles.documentsContainer}>
      {/* HEADER DE LA PÁGINA */}
      <header className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Documentos</h1>
        {/* La imagen no tiene subtítulo aquí */}
      </header>

      {/* BARRA DE BÚSQUEDA Y FILTROS */}
      <div className={styles.searchBar}>
        <div className={styles.searchInputWrapper}>
          <FiSearch className={styles.searchIcon} size={18} />
          <input
            type="text"
            placeholder="Buscar documentos..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className={styles.searchInput}
          />
        </div>
        <button className={styles.uploadButton}>
          <FiUpload /> Subir
        </button>
      </div>

      {/* FILTROS SECUNDARIOS */}
      <div className={styles.filtersRow}>
        <button className={styles.filterButton}><FiFilter size={18} /> Filtrar</button>
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className={styles.filterSelect}
        >
          <option value="Todos">Tipo: Todos</option>
          <option value="Documento">Documento</option>
          <option value="PDF">PDF</option>
          <option value="Hoja de cálculo">Hoja de cálculo</option>
        </select>
        <select
          value={filterDate}
          onChange={(e) => setFilterDate(e.target.value)}
          className={styles.filterSelect}
        >
          <option value="Recientes">Fecha: Recientes</option>
          <option value="Más antiguos">Fecha: Más antiguos</option>
        </select>
      </div>

      {/* TABLA DE DOCUMENTOS */}
      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Documento</th>
              <th>Tipo</th>
              <th>Caso</th>
              <th>Fecha</th>
              <th>Tamaño</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {paginatedDocuments.length > 0 ? (
              paginatedDocuments.map(doc => (
                <tr key={doc.id}>
                  <td>
                    <div className={styles.documentCell}>
                      <div className={styles.documentIconWrapper} style={{ color: doc.iconColor }}>
                        <FiFileText size={24} />
                      </div>
                      <span className={styles.documentName}>{doc.name}</span>
                    </div>
                  </td>
                  <td><span className={styles.typeBadge}>{doc.type}</span></td>
                  <td>{doc.case}</td>
                  <td>{doc.date}</td>
                  <td>{doc.size}</td>
                  <td>
                    <div className={styles.actionBtnWrapper}>
                      <button className={styles.actionBtn} onClick={(e) => {
                        e.stopPropagation();
                        setShowActionsMenuId(showActionsMenuId === doc.id ? null : doc.id);
                      }}>
                        <FiMoreHorizontal />
                      </button>
                      {showActionsMenuId === doc.id && (
                        <div ref={actionsMenuRef} className={styles.actionsMenu}>
                          <button onClick={() => handleEdit(doc.id)}>
                            <FiEdit size={14} /> Editar
                          </button>
                          <button onClick={() => handleDownload(doc.id)}>
                            <FiDownload size={14} /> Descargar
                          </button>
                          <button className={styles.deleteBtn} onClick={() => handleDelete(doc.id)}>
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
                  No se encontraron documentos.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
      {/* PAGINACIÓN */}
      {totalDocuments > 0 && (
        <div className={styles.pagination}>
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className={`${styles.pageButton} ${styles.prevNext}`}
          >
            <FiChevronLeft size={16} /> Anterior
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
            className={`${styles.pageButton} ${styles.prevNext}`}
          >
            Siguiente <FiChevronRight size={16} />
          </button>
        </div>
      )}
    </div>
  );
}