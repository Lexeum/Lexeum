'use client';
import styles from './asistente-ia.module.css';
import { useState, useEffect } from 'react';
import { FiSend, FiTrash2, FiPlus, FiMessageSquare, FiSearch } from 'react-icons/fi';
import { useSession } from 'next-auth/react';

export default function ChatPage() {
  const { data: session } = useSession();
  const [conversations, setConversations] = useState([]);
  const [activeId, setActiveId] = useState(null);
  const [input, setInput] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('lexum_conversations');
    let initialConversations = stored ? JSON.parse(stored) : [
      {
        id: Date.now(),
        title: 'Consulta de contrato',
        messages: [
          { type: 'bot', text: 'Hola, soy tu asistente legal con IA. ¿En qué puedo ayudarte hoy?' },
        ],
      },
    ];
    setConversations(initialConversations);
    setActiveId(initialConversations[0]?.id || null);
  }, []);

  useEffect(() => {
    localStorage.setItem('lexum_conversations', JSON.stringify(conversations));
  }, [conversations]);

  const activeConversation = conversations.find(c => c.id === activeId);

 const consultarIA = async (mensaje) => {
  if (!mensaje || mensaje.trim().length < 3) return 'Escribe una pregunta válida.';

  try {
    const res = await fetch('/api/consulta', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${session?.user?.token}`,
      },
      body: JSON.stringify({ mensaje }),
    });

    const text = await res.text(); // Podría no ser JSON si falla

    try {
      const data = JSON.parse(text);
      if (data?.respuesta) return data.respuesta;
      if (data?.error) return `⚠️ ${data.error}`;
      return '⚠️ No se recibió una respuesta válida de la IA.';
    } catch (jsonErr) {
      console.error('⚠️ Respuesta no es JSON:', text);
      return '⚠️ La IA no respondió correctamente.';
    }

  } catch (err) {
    console.error('❌ Error al consultar IA:', err);
    return '❌ Error de red o del servidor.';
  }
};



  const handleSend = async () => {
  if (!input.trim() || !activeId) return;

  setLoading(true);
  const prompt = input;
  setInput(''); // limpiamos antes

  const respuestaIA = await consultarIA(prompt);
  const updated = conversations.map(c => {
    if (c.id !== activeId) return c;
    return {
      ...c,
      messages: [...c.messages, { type: 'user', text: prompt }, { type: 'bot', text: respuestaIA }]
    };
  });

  setConversations(updated);
  setLoading(false);
};


  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleNewConversation = () => {
    const newId = Date.now();
    const newConv = {
      id: newId,
      title: `Nueva consulta ${conversations.length + 1}`,
      messages: [
        {
          type: 'bot',
          text: 'Hola, soy tu asistente legal con IA. ¿En qué puedo ayudarte hoy?'
        }
      ]
    };
    setConversations([newConv, ...conversations]);
    setActiveId(newId);
  };

  const handleDelete = (id) => {
    const updated = conversations.filter(c => c.id !== id);
    setConversations(updated);
    setActiveId(updated[0]?.id || null);
  };

  const handleRename = (id) => {
    const updated = conversations.map(c =>
      c.id === id ? { ...c, title: editTitle.trim() || c.title } : c
    );
    setConversations(updated);
    setEditingId(null);
  };

  return (
    <div className={styles.chatWrapper}>
      <aside className={styles.sidebar}>
        <button className={styles.newChat} onClick={handleNewConversation}>
          <FiPlus /> Nueva Consulta
        </button>
        <div className={styles.searchContainer}>
          <FiSearch size={18} color="#9ca3af" />
          <input
            type="text"
            placeholder="Buscar conversaciones"
            className={styles.search}
          />
        </div>
        <ul className={styles.chatList}>
          {conversations.map((conv) => (
            <li
              key={conv.id}
              className={conv.id === activeId ? styles.active : ''}
              onClick={() => setActiveId(conv.id)}
              onDoubleClick={() => {
                setEditingId(conv.id);
                setEditTitle(conv.title);
              }}
            >
              {editingId === conv.id ? (
                <input
                  className={styles.renameInput}
                  value={editTitle}
                  autoFocus
                  onChange={(e) => setEditTitle(e.target.value)}
                  onBlur={() => handleRename(conv.id)}
                  onKeyDown={(e) => e.key === 'Enter' && handleRename(conv.id)}
                />
              ) : (
                <span className={styles.chatListItemTitle}>{conv.title}</span>
              )}
              <button
                className={styles.deleteBtn}
                onClick={(e) => {
                  e.stopPropagation();
                  handleDelete(conv.id);
                }}
              >
                <FiTrash2 size={16} />
              </button>
            </li>
          ))}
        </ul>
      </aside>

      <div className={styles.chatPanel}>
        <header className={styles.chatHeader}>
          <h2>{activeConversation?.title || 'Selecciona una conversación'}</h2>
        </header>

        <div className={styles.chatBody}>
          {activeConversation?.messages.map((msg, i) => (
            <div
              key={i}
              className={`${styles.messageWrapper} ${msg.type === 'user' ? styles.user : styles.bot}`}
            >
              {msg.type === 'user'
                ? <div className={styles.avatarUser}>JD</div>
                : <div className={styles.avatarBot}>🤖</div>}
              <div className={styles.messageContent}>
                {msg.type === 'bot' && (
                  <div className={styles.botHeader}>
                    <strong className={styles.botTitle}>Asistente Legal IA</strong>
                  </div>
                )}
                <p className={styles.messageText}>{msg.text}</p>
              </div>
            </div>
          ))}
          {loading && (
            <div className={`${styles.messageWrapper} ${styles.bot}`}>
              <div className={styles.avatarBot}>🤖</div>
              <div className={styles.messageContent}>
                <div className={styles.botHeader}>
                  <strong className={styles.botTitle}>Asistente Legal IA</strong>
                </div>
                <p className={styles.messageText}>Escribiendo respuesta...</p>
              </div>
            </div>
          )}
        </div>

        {activeConversation && (
          <>
            <div className={styles.chatInput}>
              <textarea
                placeholder="Escribe tu mensaje..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                rows={1}
              />
              <button onClick={handleSend} disabled={loading}>
                <FiSend size={20} />
              </button>
            </div>
            <div className={styles.notice}>
              <p>El asistente es una herramienta de IA. No sustituye la asesoría de un profesional.</p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
