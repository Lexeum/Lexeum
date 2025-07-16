'use client';
import { useState, useMemo, useRef, useEffect } from 'react';
import styles from './contratos.module.css';
import { FiFileText, FiDownload, FiEdit, FiSearch, FiPlus, FiMoreHorizontal, FiX, FiMessageSquare } from 'react-icons/fi';
import { format } from 'date-fns';
import { es } from 'date-fns/locale/es';
import { jsPDF } from 'jspdf';

// --- PLANTILLAS DE CONTRATO (en texto plano con placeholders) ---
const ARRENDAMIENTO_TEMPLATE = `
CONTRATO DE ARRENDAMIENTO DE VIVIENDA URBANA
Entre los suscritos a saber:
[NOMBRE_ARRENDADOR], mayor de edad, identificado con cédula de ciudadanía No. [CEDULA_ARRENDADOR] expedida en [CIUDAD_EXPEDICION_ARRENDADOR], domiciliado en [DOMICILIO_ARRENDADOR], quien en adelante se denominará EL ARRENDADOR,
y
[NOMBRE_ARRENDATARIO], mayor de edad, identificado con cédula de ciudadanía No. [CEDULA_ARRENDATARIO] expedida en [CIUDAD_EXPEDICION_ARRENDATARIO], domiciliado en [DOMICILIO_ARRENDATARIO], quien en adelante se denominará EL ARRENDATARIO,
hemos acordado celebrar el presente Contrato de Arrendamiento de Vivienda Urbana, que se regirá por las siguientes cláusulas:
PRIMERA. OBJETO
EL ARRENDADOR da en arrendamiento a EL ARRENDATARIO el inmueble destinado exclusivamente a vivienda, ubicado en [DIRECCION_INMUEBLE], identificado con matrícula inmobiliaria No. [MATRICULA_INMUEBLE], que consta de [DESCRIPCION_INMUEBLE].
SEGUNDA. DURACIÓN
El presente contrato tendrá una duración de [DURACION_MESES] meses, contados a partir del [DIA_INICIO] de [MES_INICIO] de [AÑO_INICIO], y se renovará automáticamente por periodos iguales salvo manifestación escrita de alguna de las partes con mínimo tres (3) meses de antelación al vencimiento.
TERCERA. CANON DE ARRENDAMIENTO
El canon mensual será de $[CANON_MENSUAL] (pesos colombianos), pagaderos dentro de los cinco (5) primeros días calendario de cada mes en el lugar o cuenta bancaria indicada por EL ARRENDADOR.
Este canon solo podrá incrementarse anualmente según el IPC (Índice de Precios al Consumidor) establecido por el DANE.
CUARTA. DEPÓSITO O GARANTÍA
[CLAUSULA_DEPOSITO]
QUINTA. DESTINACIÓN
EL ARRENDATARIO se obliga a destinar el inmueble exclusivamente a vivienda propia y de su núcleo familiar. No podrá usarlo para fines comerciales ni subarrendarlo sin autorización escrita de EL ARRENDADOR.
SEXTA. OBLIGACIONES DEL ARRENDATARIO
Conservar el inmueble en buen estado.
Pagar puntualmente el canon.
Asumir servicios públicos y daños causados por él o sus visitantes.
Permitir la inspección razonable del inmueble.
Restituir el inmueble al terminar el contrato.
SÉPTIMA. OBLIGACIONES DEL ARRENDADOR
Entregar el inmueble en condiciones aptas para su uso.
Garantizar el uso pacífico del inmueble.
Realizar reparaciones locativas necesarias que no correspondan al ARRENDATARIO.
OCTAVA. TERMINACIÓN ANTICIPADA
Cualquiera de las partes podrá dar por terminado el contrato antes del vencimiento, con un preaviso escrito de mínimo tres (3) meses y, en caso del ARRENDADOR, según las causas legales establecidas en la Ley 820 de 2003.
NOVENA. RESTITUCIÓN DEL INMUEBLE
Al finalizar el contrato, EL ARRENDATARIO deberá entregar el inmueble libre de ocupantes y en las mismas condiciones en que lo recibió, salvo el deterioro natural.
DÉCIMA. CLAUSULA PENAL
El incumplimiento de cualquiera de las obligaciones aquí pactadas dará lugar al pago de una cláusula penal equivalente a un (1) mes de arrendamiento, sin perjuicio de las demás acciones legales.
DÉCIMA PRIMERA. LEGISLACIÓN APLICABLE
Este contrato se rige por las disposiciones contenidas en la Ley 820 de 2003, el Código Civil colombiano, y demás normas concordantes.
DÉCIMA SEGUNDA. DOMICILIO CONTRACTUAL
Para todos los efectos legales, las partes fijan como domicilio contractual la ciudad de [CIUDAD_CONTRATO].
En constancia, se firma en dos ejemplares del mismo tenor, hoy [DIA_FIRMA] de [MES_FIRMA] de [AÑO_FIRMA].
EL ARRENDADOR

Firma: ___________________________

Nombre: [NOMBRE_ARRENDADOR]

C.C. No. [CEDULA_ARRENDADOR]
EL ARRENDATARIO

Firma: ___________________________

Nombre: [NOMBRE_ARRENDATARIO]

C.C. No. [CEDULA_ARRENDATARIO]
`;

const COMPRAVENTA_TEMPLATE = `
CONTRATO DE COMPRAVENTA DE BIEN MUEBLE
Entre:
[VENDEDOR], mayor de edad, identificado con C.C. No. [CEDULA_VENDEDOR] expedida en [CIUDAD_EXPEDICION_VENDEDOR], domiciliado en [DOMICILIO_VENDEDOR], quien en adelante se denominará EL VENDEDOR,
y
[COMPRADOR], mayor de edad, identificado con C.C. No. [CEDULA_COMPRADOR] expedida en [CIUDAD_EXPEDICION_COMPRADOR], domiciliado en [DOMICILIO_COMPRADOR], quien en adelante se denominará EL COMPRADOR,
acuerdan celebrar el presente Contrato de Compraventa, regido por las siguientes cláusulas:
PRIMERA – Objeto: EL VENDEDOR transfiere a EL COMPRADOR la propiedad del bien mueble descrito así: [DESCRIPCION_BIEN]
SEGUNDA – Precio: El valor de la compraventa es de $[PRECIO_TOTAL] COP, que EL COMPRADOR paga a EL VENDEDOR en [FORMA_DE_PAGO] el día de la firma.
TERCERA – Entrega: La entrega se hace el mismo día de la firma del contrato, en el estado en que se encuentra el bien.
CUARTA – Garantía: EL VENDEDOR declara que el bien no tiene gravámenes ni está en litigio. Se entrega en buen estado y funcionamiento, sin garantía posterior, salvo pacto en contrario.
QUINTA – Ley Aplicable: Este contrato se rige por el Código Civil Colombiano.
Firmado en [CIUDAD_FIRMA], a los [DIA_FIRMA] días del mes de [MES_FIRMA] de [AÑO_FIRMA].
EL VENDEDOR

Firma: ___________________________

Nombre: [VENDEDOR]

C.C. No. [CEDULA_VENDEDOR]
EL COMPRADOR

Firma: ___________________________

Nombre: [COMPRADOR]

C.C. No. [CEDULA_COMPRADOR]
`;

const LABORAL_TEMPLATE = `
CONTRATO INDIVIDUAL DE TRABAJO A TÉRMINO FIJO
Entre:
[EMPLEADOR], identificado con NIT No. [NIT_EMPLEADOR], con domicilio en [DOMICILIO_EMPLEADOR], representado legalmente por [REPRESENTANTE_LEGAL], quien actúa en calidad de empleador.
y
[EMPLEADO], identificado con C.C. No. [CEDULA_EMPLEADO] expedida en [CIUDAD_EXPEDICION_EMPLEADO], domiciliado en [DOMICILIO_EMPLEADO], quien actúa como trabajador.
Celebran este Contrato de Trabajo a Término Fijo, conforme al Código Sustantivo del Trabajo, bajo las siguientes cláusulas:
PRIMERA – Objeto: El EMPLEADO se obliga a prestar servicios personales como [CARGO], en jornada de [JORNADA_SEMANAL] horas semanales.
SEGUNDA – Duración: A término fijo por [DURACION_MESES] meses, iniciando el [DIA_INICIO] de [MES_INICIO] de [AÑO_INICIO] y terminando el [DIA_FIN] de [MES_FIN] de [AÑO_FIN].
TERCERA – Remuneración: El EMPLEADOR pagará un salario mensual de $[SALARIO_MENSUAL] COP, más prestaciones legales y afiliaciones al sistema de seguridad social.
CUARTA – Horario: Lunes a viernes de [HORARIO_INICIO] a [HORARIO_FIN] (y sábados si aplica).
QUINTA – Obligaciones del empleado: Cumplir instrucciones, mantener confidencialidad, cuidar equipos, etc.
SEXTA – Terminación anticipada: Se requiere preaviso de 30 días y causal justificada, salvo acuerdo mutuo.
SÉPTIMA – Legislación aplicable: Código Sustantivo del Trabajo y normas complementarias.
Firmado en [CIUDAD_FIRMA], el [DIA_FIRMA] de [MES_FIRMA] de [AÑO_FIRMA].
EL EMPLEADOR

Firma: ___________________________

Nombre: [EMPLEADOR]

NIT: [NIT_EMPLEADOR]
EL EMPLEADO

Firma: ___________________________

Nombre: [EMPLEADO]

C.C. No. [CEDULA_EMPLEADO]
`;

const CONFIDENCIALIDAD_TEMPLATE = `
ACUERDO DE CONFIDENCIALIDAD (NDA)
Entre:
[PARTE_REVELADORA], identificada con C.C./NIT No. [ID_REVELADORA], con domicilio en [DOMICILIO_REVELADORA],
y
[PARTE_RECEPTORA], identificada con C.C./NIT No. [ID_RECEPTORA], con domicilio en [DOMICILIO_RECEPTORA],
se celebra este Acuerdo de Confidencialidad (NDA) bajo los siguientes términos:
PRIMERA – Información confidencial: Toda información técnica, comercial, financiera o de cualquier tipo compartida por LA PARTE REVELADORA a LA PARTE RECEPTORA, ya sea verbal, escrita o digital.
SEGUNDA – Obligaciones: LA PARTE RECEPTORA se compromete a:

No divulgar información a terceros.
No usarla con fines distintos a los autorizados.
Adoptar medidas de protección razonables.
TERCERA – Excepciones: No se considera confidencial aquella información que:

Sea de dominio público.
Ya era conocida legalmente por la receptora.
Se reciba de un tercero sin obligación de confidencialidad.
CUARTA – Vigencia: Este acuerdo tendrá vigencia de [VIGENCIA_AÑOS] años desde la firma y cubrirá la confidencialidad por igual periodo posterior al término de la relación contractual o comercial.
QUINTA – Consecuencias del incumplimiento: El uso o divulgación no autorizada será causal de indemnización por perjuicios.
SEXTA – Ley aplicable: Se rige por las leyes de la República de Colombia.
Firmado el [DIA_FIRMA] de [MES_FIRMA] de [AÑO_FIRMA].
PARTE REVELADORA

Firma: ___________________________

Nombre: [PARTE_REVELADORA]
PARTE RECEPTORA

Firma: ___________________________

Nombre: [PARTE_RECEPTORA]
`;


const TEMPLATE_MAP = {
  'Contrato de arrendamiento': ARRENDAMIENTO_TEMPLATE,
  'Contrato de compraventa': COMPRAVENTA_TEMPLATE,
  'Contrato laboral': LABORAL_TEMPLATE,
  'Acuerdo de confidencialidad': CONFIDENCIALIDAD_TEMPLATE,
};


const INITIAL_TEMPLATES_DATA = [
  { id: 1, name: 'Contrato de arrendamiento', description: 'Contrato estándar para alquiler de vivienda o local comercial.', popular: true },
  { id: 2, name: 'Contrato de compraventa', description: 'Para transacciones de bienes muebles o inmuebles.', popular: false },
  { id: 3, name: 'Contrato laboral', description: 'Contrato de trabajo conforme a la legislación vigente.', popular: false },
  { id: 4, name: 'Acuerdo de confidencialidad', description: 'NDA para proteger información sensible.', popular: false },
];

const RECENT_CONTRACTS_DATA = [
  { id: 1, name: 'Contrato_de_arrendamient_smith', type: 'Documento', client: 'Smith vs. Jones', status: 'En curso', date: 'May 12, 2023' },
  { id: 2, name: 'Acuerdo_confidencialidad_v3', type: 'Documento', client: 'Tech Solutions SL', status: 'Firmado', date: 'May 20, 2023' },
  { id: 3, name: 'Contrato_laboral_Gomez', type: 'Documento', client: 'María García', status: 'En revisión', date: 'Jun 05, 2023' },
];

const ALL_CLIENTS_DATA = [
  { name: 'Smith vs. Jones' },
  { name: 'Tech Solutions SL' },
  { name: 'María García' },
  { name: 'Pedro López' },
  { name: 'Ana Martínez' },
];

export default function ContratosPage() {
  const [templates, setTemplates] = useState(INITIAL_TEMPLATES_DATA);
  const [recentContracts, setRecentContracts] = useState(RECENT_CONTRACTS_DATA);
  const [showTemplateActionsId, setShowTemplateActionsId] = useState(null);
  const actionsMenuRef = useRef(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState(null); // Para el modal de "Usar plantilla"
  const [showModifyModal, setShowModifyModal] = useState(false);
  const [templateToModify, setTemplateToModify] = useState(null);
  
  // --- ESTADO COMPLETO Y GENÉRICO DEL FORMULARIO DE CONTRATO ---
  const [contractForm, setContractForm] = useState({
    // Campos comunes a todas las plantillas
    contractName: '', // Nombre del archivo/contrato
    client: ALL_CLIENTS_DATA[0].name,
    startDate: format(new Date(), 'yyyy-MM-dd'),
    // Campos específicos para Arrendamiento
    arrendadorName: '', arrendadorId: '', arrendadorCityExpedition: '', arrendadorDomicilio: '',
    arrendatarioName: '', arrendatarioId: '', arrendatarioCityExpedition: '', arrendatarioDomicilio: '',
    propertyAddress: '', propertyRegistry: '', propertyDescription: '',
    durationMonths: '12', rentAmount: '',
    hasDeposit: false, depositAmount: '',
    contractCity: '',
    // Campos específicos para Compraventa
    vendedorName: '', vendedorId: '', vendedorCityExpedition: '', vendedorDomicilio: '',
    compradorName: '', compradorId: '', compradorCityExpedition: '', compradorDomicilio: '',
    bienDescription: '', price: '', paymentMethod: 'efectivo',
    contractCityCompraventa: '',
    // Campos específicos para Laboral
    empleadorName: '', empleadorNIT: '', empleadorLegalRep: '', empleadorDomicilio: '',
    empleadoName: '', empleadoId: '', empleadoCityExpedition: '', empleadoDomicilio: '',
    cargo: '', weeklyHours: '', durationMonthsLaboral: '6', endDate: '',
    salary: '', scheduleStart: '', scheduleEnd: '', contractCityLaboral: '',
    // Campos específicos para NDA
    parteReveladoraName: '', parteReveladoraId: '', parteReveladoraDomicilio: '',
    parteReceptoraName: '', parteReceptoraId: '', parteReceptoraDomicilio: '',
    vigenciaAños: '5',
  });
  
  const handleFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setContractForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };
  
  // Efecto para cerrar el menú de acciones al hacer clic fuera
  useEffect(() => {
    function handleClickOutside(event) {
      if (actionsMenuRef.current && !actionsMenuRef.current.contains(event.target)) {
        setShowTemplateActionsId(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [actionsMenuRef]);
  
  // --- LÓGICA DE DESCARGA DE ARCHIVOS ---
  const generateContractPDF = (templateName, details) => {
    const doc = new jsPDF();
    doc.setFont('Helvetica');
    doc.setFontSize(10);
    
    // Seleccionar la plantilla de texto correcta
    let fullContractText = TEMPLATE_MAP[templateName] || '';
    
    // Rellenar la plantilla con los datos del formulario
    for (const key in details) {
      const placeholder = `[${key.toUpperCase().replace(/ /g, '_')}]`;
      const regex = new RegExp(placeholder, 'g');
      fullContractText = fullContractText.replace(regex, details[key] || '__________');
    }
    
    // Lógica específica de reemplazo para la cláusula opcional de depósito
    if (templateName === 'Contrato de arrendamiento') {
        const depositClause = details.hasDeposit ? `EL ARRENDATARIO entrega a título de depósito la suma de $${details.depositAmount} como garantía de cumplimiento.` : '';
        fullContractText = fullContractText.replace('[CLAUSULA_DEPOSITO]', depositClause);
    }
    
    // Dividir el texto en líneas para que se ajuste al PDF
    const textLines = doc.splitTextToSize(fullContractText, 170); // 170mm de ancho
    doc.text(textLines, 20, 20);
    
    return doc.output('blob');
  };
  
  const handleDownload = (blob, filename) => {
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };
  
  const handleDownloadTemplate = (template) => {
    const templateDetails = {
      // Usamos placeholders genéricos para la plantilla
      arrendadorName: '___________________________', arrendadorId: '__________', arrendadorCityExpedition: '__________', arrendadorDomicilio: '___________________________',
      arrendatarioName: '___________________________', arrendatarioId: '__________', arrendatarioCityExpedition: '__________', arrendatarioDomicilio: '___________________________',
      propertyAddress: '___________________________', propertyRegistry: '_______________', propertyDescription: '_____________________________',
      durationMonths: '___', rentAmount: '__________', hasDeposit: true, depositAmount: '__________', contractCity: '___________________',
      vendedorName: '___________________________', vendedorId: '__________', vendedorCityExpedition: '__________', vendedorDomicilio: '___________________________',
      compradorName: '___________________________', compradorId: '__________', compradorCityExpedition: '__________', compradorDomicilio: '___________________________',
      bienDescription: '_______________________________', price: '_________', paymentMethod: '(efectivo / transferencia)', contractCityCompraventa: '___________________',
      empleadorName: '___________________________', empleadorNIT: '__________', empleadorLegalRep: '___________________________', empleadorDomicilio: '___________________________',
      empleadoName: '___________________________', empleadoId: '__________', empleadoCityExpedion: '__________', empleadoDomicilio: '___________________________',
      cargo: '____________________', weeklyHours: '______', durationMonthsLaboral: '_________', endDate: '____________________',
      salary: '_________', scheduleStart: '___', scheduleEnd: '___', contractCityLaboral: '___________________',
      parteReveladoraName: '___________________________', parteReveladoraId: '__________', parteReveladoraDomicilio: '___________________________',
      parteReceptoraName: '___________________________', parteReceptoraId: '__________', parteReceptoraDomicilio: '___________________________',
      vigenciaAños: '___',
      // Datos de fecha genéricos
      DIA_INICIO: '__', MES_INICIO: '___________', AÑO_INICIO: '____',
      DIA_FIN: '__', MES_FIN: '___________', AÑO_FIN: '____',
      DIA_FIRMA: '__', MES_FIRMA: '___________', AÑO_FIRMA: '____',
      CIUDAD_FIRMA: '___________________',
    };
    
    const pdfBlob = generateContractPDF(template.name, templateDetails);
    const filename = `${template.name}_Plantilla.pdf`;
    handleDownload(pdfBlob, filename);
    setShowTemplateActionsId(null);
  };
  
  // Lógica para el modal de "Usar plantilla"
  const handleUseTemplate = (template) => {
    setSelectedTemplate(template);
    // Reiniciar y pre-llenar el formulario con datos básicos
    const initialFormState = {
      contractName: `${template.name.replace(/ /g, '_')}_${format(new Date(), 'yyyyMMdd')}`,
      client: ALL_CLIENTS_DATA[0].name,
      startDate: format(new Date(), 'yyyy-MM-dd'),
      template: template.name,
      // Resetear campos específicos para evitar que se muestren datos de otra plantilla
      arrendadorName: '', arrendadorId: '', arrendadorCityExpedition: '', arrendadorDomicilio: '', arrendatarioName: '', arrendatarioId: '', arrendatarioCityExpedition: '', arrendatarioDomicilio: '', propertyAddress: '', propertyRegistry: '', propertyDescription: '', durationMonths: '12', rentAmount: '', hasDeposit: false, depositAmount: '', contractCity: '',
      vendedorName: '', vendedorId: '', vendedorCityExpedition: '', vendedorDomicilio: '', compradorName: '', compradorId: '', compradorCityExpedition: '', compradorDomicilio: '', bienDescription: '', price: '', paymentMethod: 'efectivo', contractCityCompraventa: '',
      empleadorName: '', empleadorNIT: '', empleadorLegalRep: '', empleadorDomicilio: '', empleadoName: '', empleadoId: '', empleadoCityExpedition: '', empleadoDomicilio: '', cargo: '', weeklyHours: '', durationMonthsLaboral: '6', endDate: '', salary: '', scheduleStart: '', scheduleEnd: '', contractCityLaboral: '',
      parteReveladoraName: '', parteReveladoraId: '', parteReveladoraDomicilio: '', parteReceptoraName: '', parteReceptoraId: '', parteReceptoraDomicilio: '', vigenciaAños: '5',
    };
    setContractForm(initialFormState);
    setShowModal(true);
  };
  const handleCloseModal = () => setShowModal(false);

  // Lógica para crear un nuevo contrato (AHORA DESCARGA EL PDF)
  const handleCreateContract = (e) => {
    e.preventDefault();
    if (!contractForm.contractName || !contractForm.client || !contractForm.startDate) {
      alert('Por favor, completa los campos requeridos.');
      return;
    }
    
    // 1. Recolectar todos los datos necesarios para la plantilla
    const creationDate = new Date();
    const contractDetails = {
      // Datos comunes
      ...contractForm,
      // Datos de fecha y firma
      DIA_INICIO: format(new Date(contractForm.startDate), 'dd'),
      MES_INICIO: format(new Date(contractForm.startDate), 'MMMM', { locale: es }),
      AÑO_INICIO: format(new Date(contractForm.startDate), 'yyyy'),
      DIA_FIN: contractForm.endDate ? format(new Date(contractForm.endDate), 'dd') : '',
      MES_FIN: contractForm.endDate ? format(new Date(contractForm.endDate), 'MMMM', { locale: es }) : '',
      AÑO_FIN: contractForm.endDate ? format(new Date(contractForm.endDate), 'yyyy') : '',
      DIA_FIRMA: format(creationDate, 'dd'),
      MES_FIRMA: format(creationDate, 'MMMM', { locale: es }),
      AÑO_FIRMA: format(creationDate, 'yyyy'),
      // Mapeo de nombres para placeholders
      NOMBRE_ARRENDADOR: contractForm.arrendadorName, CEDULA_ARRENDADOR: contractForm.arrendadorId, CIUDAD_EXPEDICION_ARRENDADOR: contractForm.arrendadorCityExpedition, DOMICILIO_ARRENDADOR: contractForm.arrendadorDomicilio,
      NOMBRE_ARRENDATARIO: contractForm.arrendatarioName, CEDULA_ARRENDATARIO: contractForm.arrendatarioId, CIUDAD_EXPEDICION_ARRENDATARIO: contractForm.arrendatarioCityExpedition, DOMICILIO_ARRENDATARIO: contractForm.arrendatarioDomicilio,
      DIRECCION_INMUEBLE: contractForm.propertyAddress, MATRICULA_INMUEBLE: contractForm.propertyRegistry, DESCRIPCION_INMUEBLE: contractForm.propertyDescription,
      DURACION_MESES: contractForm.durationMonths, CANON_MENSUAL: contractForm.rentAmount,
      CIUDAD_CONTRATO: contractForm.contractCity,
      VENDEDOR: contractForm.vendedorName, COMPRADOR: contractForm.compradorName, CEDULA_VENDEDOR: contractForm.vendedorId, CEDULA_COMPRADOR: contractForm.compradorId,
      CIUDAD_EXPEDICION_VENDEDOR: contractForm.vendedorCityExpedition, CIUDAD_EXPEDICION_COMPRADOR: contractForm.compradorCityExpedition, DOMICILIO_VENDEDOR: contractForm.vendedorDomicilio, DOMICILIO_COMPRADOR: contractForm.compradorDomicilio,
      DESCRIPCION_BIEN: contractForm.bienDescription, PRECIO_TOTAL: contractForm.price, FORMA_DE_PAGO: contractForm.paymentMethod, CIUDAD_FIRMA: contractForm.contractCityCompraventa,
      EMPLEADOR: contractForm.empleadorName, NIT_EMPLEADOR: contractForm.empleadorNIT, DOMICILIO_EMPLEADOR: contractForm.empleadorDomicilio, REPRESENTANTE_LEGAL: contractForm.empleadorLegalRep,
      EMPLEADO: contractForm.empleadoName, CEDULA_EMPLEADO: contractForm.empleadoId, CIUDAD_EXPEDICION_EMPLEADO: contractForm.empleadoCityExpedition, DOMICILIO_EMPLEADO: contractForm.empleadoDomicilio,
      CARGO: contractForm.cargo, JORNADA_SEMANAL: contractForm.weeklyHours, DURACION_MESES_LABORAL: contractForm.durationMonthsLaboral,
      SALARIO_MENSUAL: contractForm.salary, HORARIO_INICIO: contractForm.scheduleStart, HORARIO_FIN: contractForm.scheduleEnd, CIUDAD_FIRMA_LABORAL: contractForm.contractCityLaboral,
      PARTE_REVELADORA: contractForm.parteReveladoraName, ID_REVELADORA: contractForm.parteReveladoraId, DOMICILIO_REVELADORA: contractForm.parteReveladoraDomicilio,
      PARTE_RECEPTORA: contractForm.parteReceptoraName, ID_RECEPTORA: contractForm.parteReceptoraId, DOMICILIO_RECEPTORA: contractForm.parteReceptoraDomicilio,
      VIGENCIA_AÑOS: contractForm.vigenciaAños,
    };

    // 2. Genera el Blob del PDF
    const pdfBlob = generateContractPDF(selectedTemplate.name, contractDetails);
    
    // 3. Añadir a la lista de contratos recientes
    const newContract = {
        id: recentContracts.length + 1,
        name: contractForm.contractName,
        type: 'Documento',
        client: contractForm.client,
        status: 'Firmado',
        date: format(new Date(contractForm.startDate), 'MMM dd,yyyy'),
    };
    setRecentContracts([newContract, ...recentContracts]);

    // 4. Dispara la descarga del archivo con extensión .pdf
    const filename = `${contractForm.contractName}.pdf`;
    handleDownload(pdfBlob, filename);
    
    alert('Contrato creado y descargado con éxito!');
    handleCloseModal();
  };
  
  // Lógica para descargar un contrato desde la tabla de recientes
  const handleDownloadRecentContract = (contract) => {
    // Para esta descarga, usamos datos de relleno ya que no tenemos los detalles del contrato guardados
    const contractDetails = {
      NOMBRE_ARRENDADOR: 'N/A', NOMBRE_ARRENDATARIO: contract.client, DIRECCION_INMUEBLE: 'N/A', DURACION_MESES: 'N/A', CANON_MENSUAL: 'N/A', CIUDAD_CONTRATO: 'N/A', DIA_INICIO: 'N/A', MES_INICIO: 'N/A', AÑO_INICIO: 'N/A',
      DIA_FIN: 'N/A', MES_FIN: 'N/A', AÑO_FIN: 'N/A', DIA_FIRMA: 'N/A', MES_FIRMA: 'N/A', AÑO_FIRMA: 'N/A',
      VENDEDOR: 'N/A', COMPRADOR: 'N/A', DESCRIPCION_BIEN: 'N/A', PRECIO_TOTAL: 'N/A', FORMA_DE_PAGO: 'N/A', CIUDAD_FIRMA: 'N/A',
      EMPLEADOR: 'N/A', EMPLEADO: 'N/A', CARGO: 'N/A', SALARIO_MENSUAL: 'N/A',
      PARTE_REVELADORA: 'N/A', PARTE_RECEPTORA: 'N/A', VIGENCIA_AÑOS: 'N/A',
    };
    // Asumimos la plantilla de arrendamiento como base si el nombre coincide, sino, usamos una genérica
    const templateName = contract.name.includes('arrendamient') ? 'Contrato de arrendamiento' : 'Contrato de compraventa';
    const pdfBlob = generateContractPDF(templateName, contractDetails);
    const filename = `${contract.name}.pdf`;
    handleDownload(pdfBlob, filename);
  };
  
  // Lógica para modificar la plantilla
  const handleModifyTemplate = (template) => {
    setTemplateToModify(template);
    setShowModifyModal(true);
    setShowTemplateActionsId(null);
  };
  const handleCloseModifyModal = () => setShowModifyModal(false);
  const handleSaveModifiedTemplate = (e) => {
    e.preventDefault();
    alert('Plantilla modificada con éxito!');
    handleCloseModifyModal();
  };

  const renderFormFields = () => {
    if (!selectedTemplate) return null;

    switch (selectedTemplate.name) {
      case 'Contrato de arrendamiento':
        return (
          <>
            <h4 style={{ gridColumn: '1 / -1', marginTop: '1rem' }}>Datos del Arrendador</h4>
            <div className={styles.formGroup}><label>Nombre</label><input type="text" name="arrendadorName" value={contractForm.arrendadorName} onChange={handleFormChange} required /></div>
            <div className={styles.formGroup}><label>Cédula</label><input type="text" name="arrendadorId" value={contractForm.arrendadorId} onChange={handleFormChange} /></div>
            <div className={styles.formGroup}><label>Lugar expedición Cédula</label><input type="text" name="arrendadorCityExpedition" value={contractForm.arrendadorCityExpedition} onChange={handleFormChange} /></div>
            <div className={styles.formGroup}><label>Domicilio</label><input type="text" name="arrendadorDomicilio" value={contractForm.arrendadorDomicilio} onChange={handleFormChange} /></div>
            
            <h4 style={{ gridColumn: '1 / -1', marginTop: '1rem' }}>Datos del Arrendatario</h4>
            <div className={styles.formGroup}><label>Nombre</label><input type="text" name="arrendatarioName" value={contractForm.arrendatarioName} onChange={handleFormChange} required /></div>
            <div className={styles.formGroup}><label>Cédula</label><input type="text" name="arrendatarioId" value={contractForm.arrendatarioId} onChange={handleFormChange} /></div>
            <div className={styles.formGroup}><label>Lugar expedición Cédula</label><input type="text" name="arrendatarioCityExpedition" value={contractForm.arrendatarioCityExpedition} onChange={handleFormChange} /></div>
            <div className={styles.formGroup}><label>Domicilio</label><input type="text" name="arrendatarioDomicilio" value={contractForm.arrendatarioDomicilio} onChange={handleFormChange} /></div>
            
            <h4 style={{ gridColumn: '1 / -1', marginTop: '1rem' }}>Detalles del Inmueble y Contrato</h4>
            <div className={styles.formGroup}><label>Dirección del inmueble</label><input type="text" name="propertyAddress" value={contractForm.propertyAddress} onChange={handleFormChange} required /></div>
            <div className={styles.formGroup}><label>Matrícula inmobiliaria</label><input type="text" name="propertyRegistry" value={contractForm.propertyRegistry} onChange={handleFormChange} /></div>
            <div className={styles.formGroup}><label>Descripción del inmueble</label><textarea name="propertyDescription" value={contractForm.propertyDescription} onChange={handleFormChange} rows="2"></textarea></div>
            <div className={styles.formGroup}><label>Duración (meses)</label><select name="durationMonths" value={contractForm.durationMonths} onChange={handleFormChange}><option value="6">6</option><option value="12">12</option><option value="24">24</option></select></div>
            <div className={styles.formGroup}><label>Canon mensual ($)</label><input type="number" name="rentAmount" value={contractForm.rentAmount} onChange={handleFormChange} required /></div>
            <div className={styles.formGroup}><label>Fecha de inicio</label><input type="date" name="startDate" value={contractForm.startDate} onChange={handleFormChange} required /></div>
            <div className={styles.formGroup}><label>Ciudad del contrato</label><input type="text" name="contractCity" value={contractForm.contractCity} onChange={handleFormChange} required /></div>
            <div className={styles.formGroup}><label>¿Requiere depósito?</label><input type="checkbox" name="hasDeposit" checked={contractForm.hasDeposit} onChange={handleFormChange} style={{width: 'auto'}} /></div>
            {contractForm.hasDeposit && (<div className={styles.formGroup}><label>Valor del depósito ($)</label><input type="number" name="depositAmount" value={contractForm.depositAmount} onChange={handleFormChange} required /></div>)}
          </>
        );
      case 'Contrato de compraventa':
        return (
          <>
            <h4 style={{ gridColumn: '1 / -1', marginTop: '1rem' }}>Datos de las Partes</h4>
            <div className={styles.formGroup}><label>Nombre del Vendedor</label><input type="text" name="vendedorName" value={contractForm.vendedorName} onChange={handleFormChange} required /></div>
            <div className={styles.formGroup}><label>Cédula Vendedor</label><input type="text" name="vendedorId" value={contractForm.vendedorId} onChange={handleFormChange} /></div>
            <div className={styles.formGroup}><label>Lugar expedición Cédula</label><input type="text" name="vendedorCityExpedition" value={contractForm.vendedorCityExpedition} onChange={handleFormChange} /></div>
            <div className={styles.formGroup}><label>Domicilio Vendedor</label><input type="text" name="vendedorDomicilio" value={contractForm.vendedorDomicilio} onChange={handleFormChange} /></div>

            <div className={styles.formGroup}><label>Nombre del Comprador</label><input type="text" name="compradorName" value={contractForm.compradorName} onChange={handleFormChange} required /></div>
            <div className={styles.formGroup}><label>Cédula Comprador</label><input type="text" name="compradorId" value={contractForm.compradorId} onChange={handleFormChange} /></div>
            <div className={styles.formGroup}><label>Lugar expedición Cédula</label><input type="text" name="compradorCityExpedition" value={contractForm.compradorCityExpedition} onChange={handleFormChange} /></div>
            <div className={styles.formGroup}><label>Domicilio Comprador</label><input type="text" name="compradorDomicilio" value={contractForm.compradorDomicilio} onChange={handleFormChange} /></div>

            <h4 style={{ gridColumn: '1 / -1', marginTop: '1rem' }}>Detalles del Bien y Pago</h4>
            <div className={styles.formGroup}><label>Descripción del bien</label><textarea name="bienDescription" value={contractForm.bienDescription} onChange={handleFormChange} rows="3" required></textarea></div>
            <div className={styles.formGroup}><label>Precio total ($)</label><input type="number" name="price" value={contractForm.price} onChange={handleFormChange} required /></div>
            <div className={styles.formGroup}><label>Forma de pago</label><select name="paymentMethod" value={contractForm.paymentMethod} onChange={handleFormChange}><option value="efectivo">Efectivo</option><option value="transferencia">Transferencia</option></select></div>
            <div className={styles.formGroup}><label>Ciudad de firma</label><input type="text" name="contractCityCompraventa" value={contractForm.contractCityCompraventa} onChange={handleFormChange} required /></div>
          </>
        );
      case 'Contrato laboral':
        return (
          <>
            <h4 style={{ gridColumn: '1 / -1', marginTop: '1rem' }}>Datos del Empleador</h4>
            <div className={styles.formGroup}><label>Nombre Empleador</label><input type="text" name="empleadorName" value={contractForm.empleadorName} onChange={handleFormChange} required /></div>
            <div className={styles.formGroup}><label>NIT</label><input type="text" name="empleadorNIT" value={contractForm.empleadorNIT} onChange={handleFormChange} /></div>
            <div className={styles.formGroup}><label>Domicilio</label><input type="text" name="empleadorDomicilio" value={contractForm.empleadorDomicilio} onChange={handleFormChange} /></div>
            <div className={styles.formGroup}><label>Representante Legal</label><input type="text" name="empleadorLegalRep" value={contractForm.empleadorLegalRep} onChange={handleFormChange} /></div>
            
            <h4 style={{ gridColumn: '1 / -1', marginTop: '1rem' }}>Datos del Empleado</h4>
            <div className={styles.formGroup}><label>Nombre Empleado</label><input type="text" name="empleadoName" value={contractForm.empleadoName} onChange={handleFormChange} required /></div>
            <div className={styles.formGroup}><label>Cédula</label><input type="text" name="empleadoId" value={contractForm.empleadoId} onChange={handleFormChange} /></div>
            <div className={styles.formGroup}><label>Lugar expedición Cédula</label><input type="text" name="empleadoCityExpedition" value={contractForm.empleadoCityExpedition} onChange={handleFormChange} /></div>
            <div className={styles.formGroup}><label>Domicilio</label><input type="text" name="empleadoDomicilio" value={contractForm.empleadoDomicilio} onChange={handleFormChange} /></div>

            <h4 style={{ gridColumn: '1 / -1', marginTop: '1rem' }}>Detalles del Cargo y Remuneración</h4>
            <div className={styles.formGroup}><label>Cargo</label><input type="text" name="cargo" value={contractForm.cargo} onChange={handleFormChange} required /></div>
            <div className={styles.formGroup}><label>Salario mensual ($)</label><input type="number" name="salary" value={contractForm.salary} onChange={handleFormChange} required /></div>
            <div className={styles.formGroup}><label>Jornada (horas/semana)</label><input type="number" name="weeklyHours" value={contractForm.weeklyHours} onChange={handleFormChange} /></div>
            <div className={styles.formGroup}><label>Horario</label><input type="text" name="scheduleStart" value={contractForm.scheduleStart} onChange={handleFormChange} placeholder="Ej: 8:00 a 17:00" /></div>
            <div className={styles.formGroup}><label>Duración (meses)</label><select name="durationMonthsLaboral" value={contractForm.durationMonthsLaboral} onChange={handleFormChange}><option value="6">6</option><option value="12">12</option></select></div>
            <div className={styles.formGroup}><label>Fecha de inicio</label><input type="date" name="startDate" value={contractForm.startDate} onChange={handleFormChange} required /></div>
            <div className={styles.formGroup}><label>Fecha de fin</label><input type="date" name="endDate" value={contractForm.endDate} onChange={handleFormChange} /></div>
            <div className={styles.formGroup}><label>Ciudad de firma</label><input type="text" name="contractCityLaboral" value={contractForm.contractCityLaboral} onChange={handleFormChange} required /></div>
          </>
        );
      case 'Acuerdo de confidencialidad':
        return (
          <>
            <h4 style={{ gridColumn: '1 / -1', marginTop: '1rem' }}>Datos de las Partes</h4>
            <div className={styles.formGroup}><label>Nombre Parte Reveladora</label><input type="text" name="parteReveladoraName" value={contractForm.parteReveladoraName} onChange={handleFormChange} required /></div>
            <div className={styles.formGroup}><label>Cédula/NIT Reveladora</label><input type="text" name="parteReveladoraId" value={contractForm.parteReveladoraId} onChange={handleFormChange} /></div>
            <div className={styles.formGroup}><label>Domicilio Reveladora</label><input type="text" name="parteReveladoraDomicilio" value={contractForm.parteReveladoraDomicilio} onChange={handleFormChange} /></div>
            
            <div className={styles.formGroup}><label>Nombre Parte Receptora</label><input type="text" name="parteReceptoraName" value={contractForm.parteReceptoraName} onChange={handleFormChange} required /></div>
            <div className={styles.formGroup}><label>Cédula/NIT Receptora</label><input type="text" name="parteReceptoraId" value={contractForm.parteReceptoraId} onChange={handleFormChange} /></div>
            <div className={styles.formGroup}><label>Domicilio Receptora</label><input type="text" name="parteReceptoraDomicilio" value={contractForm.parteReceptoraDomicilio} onChange={handleFormChange} /></div>
            
            <h4 style={{ gridColumn: '1 / -1', marginTop: '1rem' }}>Detalles del Acuerdo</h4>
            <div className={styles.formGroup}><label>Vigencia (años)</label><input type="number" name="vigenciaAños" value={contractForm.vigenciaAños} onChange={handleFormChange} /></div>
          </>
        );
      default:
        return (
          <p style={{ gridColumn: '1 / -1', textAlign: 'center', color: 'var(--text-light)' }}>
            Selecciona una plantilla para ver el formulario.
          </p>
        );
    }
  };

  return (
    <div className={styles.contractsContainer}>
      {/* HEADER DE LA PÁGINA */}
      <header className={styles.pageHeader}>
        <div className={styles.titleContainer}>
          <h1 className={styles.pageTitle}>Contratos</h1>
          <p className={styles.pageSubtitle}>Genera y gestiona contratos legales</p>
        </div>
        <div className={styles.headerButtons}>
          <button className={styles.aiButton}><FiMessageSquare /> Asistente IA</button>
          <button className={styles.newContractButton} onClick={() => handleUseTemplate(templates[0])}>
            <FiPlus /> Nuevo contrato
          </button>
        </div>
      </header>

      {/* SECCIÓN DE PLANTILLAS */}
      <section className={styles.templatesSection}>
        <h2 className={styles.sectionTitle}>Plantillas de contratos</h2>
        <div className={styles.templateGrid}>
          {templates.map(template => (
            <div key={template.id} className={styles.templateCard}>
              <div className={styles.cardHeader}>
                <div className={styles.cardIcon}>
                  <FiFileText />
                </div>
                {template.popular && <span className={styles.popularBadge}>Popular</span>}
                
                {/* Botón de acciones para la plantilla */}
                <div className={styles.actionBtnWrapper}>
                  <button className={styles.actionBtn} onClick={(e) => {
                    e.stopPropagation();
                    setShowTemplateActionsId(showTemplateActionsId === template.id ? null : template.id);
                  }}>
                    <FiMoreHorizontal />
                  </button>
                  {showTemplateActionsId === template.id && (
                    <div ref={actionsMenuRef} className={styles.actionsMenu}>
                      <button onClick={() => handleModifyTemplate(template)}>
                        <FiEdit size={14} /> Modificar
                      </button>
                      <button onClick={() => handleDownloadTemplate(template)}>
                        <FiDownload size={14} /> Descargar
                      </button>
                    </div>
                  )}
                </div>
              </div>
              <h3 className={styles.cardTitle}>{template.name}</h3>
              <p className={styles.cardDescription}>{template.description}</p>
              <button className={styles.useTemplateButton} onClick={() => handleUseTemplate(template)}>
                Usar plantilla
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* SECCIÓN DE CONTRATOS RECIENTES */}
      <section className={styles.recentContractsSection}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Contratos recientes</h2>
          <a href="#" className={styles.viewAllLink}>Ver todos</a>
        </div>
        
        {/* Input de filtro al 90% de ancho */}
        <input
          type="text"
          placeholder="Buscar contratos recientes..."
          className={styles.recentSearchInput}
        />

        {/* TABLA DE CONTRATOS RECIENTES */}
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Tipo</th>
                <th>Cliente</th>
                <th>Estado</th>
                <th>Fecha</th>
              </tr>
            </thead>
            <tbody>
              {recentContracts.map(contract => (
                <tr key={contract.id}>
                  <td>
                    <div className={styles.contractNameCell}>
                      <FiFileText className={styles.contractIcon} size={20} />
                      {/* Ahora el nombre es un enlace que descarga el contrato */}
                      <a href="#" className={styles.contractName} onClick={(e) => {
                        e.preventDefault();
                        handleDownloadRecentContract(contract);
                      }}>
                        {contract.name}
                      </a>
                    </div>
                  </td>
                  <td>{contract.type}</td>
                  <td>{contract.client}</td>
                  <td><span className={`${styles.typeBadge} ${styles[contract.status.toLowerCase()]}`}>{contract.status}</span></td>
                  <td>{contract.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
      
      {/* MODAL PARA USAR PLANTILLA / CREAR CONTRATO */}
      {showModal && (
        <div className={styles.modalBackdrop}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <h3 className={styles.modalTitle}>Crear contrato: {selectedTemplate?.name}</h3>
              <button className={styles.closeButton} onClick={handleCloseModal}>&times;</button>
            </div>
            <form onSubmit={handleCreateContract} className={styles.modalForm}>
              <div className={styles.formGrid}>
                {/* Campos comunes a todas las plantillas */}
                <div className={styles.formGroup}>
                  <label>Nombre del contrato</label>
                  <input type="text" name="contractName" value={contractForm.contractName} onChange={handleFormChange} required />
                </div>
                <div className={styles.formGroup}>
                  <label>Cliente</label>
                  <select name="client" value={contractForm.client} onChange={handleFormChange} required>
                    {ALL_CLIENTS_DATA.map(client => <option key={client.name} value={client.name}>{client.name}</option>)}
                  </select>
                </div>

                {/* Renderizar campos específicos según la plantilla */}
                {renderFormFields()}

              </div>
              <div className={styles.modalActions}>
                <button type="button" className={`${styles.modalButton} ${styles.cancelButton}`} onClick={handleCloseModal}>Cancelar</button>
                <button type="submit" className={`${styles.modalButton} ${styles.saveButton}`}>Crear</button>
              </div>
            </form>
          </div>
        </div>
      )}
      
      {/* MODAL PARA MODIFICAR PLANTILLA */}
      {showModifyModal && (
        <div className={styles.modalBackdrop}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <h3 className={styles.modalTitle}>Modificar plantilla: {templateToModify?.name}</h3>
              <button className={styles.closeButton} onClick={handleCloseModifyModal}>&times;</button>
            </div>
            <form onSubmit={handleSaveModifiedTemplate} className={styles.modalForm}>
              <div className={styles.formGroup}>
                <label>Nombre de la plantilla</label>
                <input type="text" defaultValue={templateToModify?.name} />
              </div>
              <div className={styles.formGroup}>
                <label>Descripción</label>
                <textarea defaultValue={templateToModify?.description} rows="3"></textarea>
              </div>
              <div className={styles.modalActions}>
                <button type="button" className={`${styles.modalButton} ${styles.cancelButton}`} onClick={handleCloseModifyModal}>Cancelar</button>
                <button type="submit" className={`${styles.modalButton} ${styles.saveButton}`}>Guardar cambios</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}