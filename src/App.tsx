import { useEffect, useState } from 'react';
import type { DocumentRecord, Status } from './types';
import { getMockDocuments } from './data/mockData';
import { Filters } from './components/Filters';
import { DocumentGrid } from './components/DocumentGrid';
import { isWithinInterval, parseISO, startOfDay, endOfDay } from 'date-fns';
import { Send, FileText, Loader2, CheckCircle2 } from 'lucide-react';
import './index.css';

function App() {
  const [documents, setDocuments] = useState<DocumentRecord[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters State
  const [dateStart, setDateStart] = useState('');
  const [dateEnd, setDateEnd] = useState('');
  const [minValue, setMinValue] = useState('');
  const [maxValue, setMaxValue] = useState('');
  const [statusFilter, setStatusFilter] = useState<Status | 'todos'>('todos');
  const [searchTerm, setSearchTerm] = useState('');

  // Selection State
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  // Action State
  const [isSending, setIsSending] = useState(false);
  const [showSuccessToast, setShowSuccessToast] = useState(false);

  useEffect(() => {
    getMockDocuments().then(data => {
      setDocuments(data);
      setLoading(false);
    });
  }, []);

  // Filter Logic
  const filteredDocuments = documents.filter(doc => {
    // 1. Search Term (Vendor or Type)
    const matchesSearch = searchTerm === '' ||
      doc.fornecedor.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.tipoDocumento.toLowerCase().includes(searchTerm.toLowerCase());

    if (!matchesSearch) return false;

    // 2. Status
    if (statusFilter !== 'todos' && doc.status !== statusFilter) return false;

    // 3. Value Range
    const val = doc.valor;
    const min = minValue ? parseFloat(minValue) : -Infinity;
    const max = maxValue ? parseFloat(maxValue) : Infinity;
    if (val < min || val > max) return false;

    // 4. Date Range
    if (dateStart || dateEnd) {
      const docDate = parseISO(doc.dataLancamento);
      const start = dateStart ? startOfDay(parseISO(dateStart)) : new Date(0);
      const end = dateEnd ? endOfDay(parseISO(dateEnd)) : new Date(9999, 11, 31);

      if (!isWithinInterval(docDate, { start, end })) return false;
    }

    return true;
  });

  // Handler functions
  const handleToggleSelect = (id: string) => {
    const newSelected = new Set(selectedIds);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedIds(newSelected);
  };

  const handleToggleSelectAll = () => {
    if (selectedIds.size === filteredDocuments.length && filteredDocuments.length > 0) {
      setSelectedIds(new Set());
    } else {
      const allIds = new Set(filteredDocuments.map(d => d.id));
      setSelectedIds(allIds);
    }
  };

  const handleSendForApproval = () => {
    setIsSending(true);
    // Simulate API call
    setTimeout(() => {
      setIsSending(false);
      setShowSuccessToast(true);
      // Optional: Clear selection after send
      setSelectedIds(new Set());

      // Auto hide toast
      setTimeout(() => setShowSuccessToast(false), 3000);
    }, 1500);
  };

  return (
    <div className="app-container" style={{ padding: '2rem', maxWidth: '1400px', margin: '0 auto' }}>

      {/* Header */}
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          {/* Logo Placeholder - User provided PNG, assuming it would be placed here or used via CSS. Using text/gradient for now as per instructions to use palette */}
          <div style={{
            width: '48px',
            height: '48px',
            background: 'linear-gradient(135deg, var(--color-primary), var(--color-secondary))',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            boxShadow: '0 4px 6px -1px rgba(122, 31, 93, 0.3)'
          }}>
            <FileText size={24} />
          </div>
          <div>
            <h1 style={{ margin: 0, fontSize: '1.5rem', fontWeight: '700', color: 'var(--color-primary)' }}>Controle de Documentos</h1>
            <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.9rem' }}>Middleware de Pré-lançamento SAP</p>
          </div>
        </div>

        {/* Global Action */}
        <button
          onClick={handleSendForApproval}
          disabled={selectedIds.size === 0 || isSending}
          style={{
            background: 'linear-gradient(135deg, var(--color-secondary), var(--color-accent))',
            border: 'none',
            color: 'white',
            padding: '0.75rem 1.5rem',
            borderRadius: '8px',
            fontWeight: '600',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            boxShadow: '0 4px 12px rgba(240, 125, 62, 0.25)',
            opacity: selectedIds.size === 0 ? 0.5 : 1,
            cursor: selectedIds.size === 0 ? 'not-allowed' : 'pointer',
            transition: 'transform 0.1s'
          }}
          onMouseDown={e => !e.currentTarget.disabled && (e.currentTarget.style.transform = 'scale(0.97)')}
          onMouseUp={e => (e.currentTarget.style.transform = 'scale(1)')}
          onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
        >
          {isSending ? <Loader2 className="spin" size={20} /> : <Send size={20} />}
          {isSending ? 'Enviando...' : `Enviar para Aprovação (${selectedIds.size})`}
        </button>
      </header>

      {/* Main Content */}
      <main>
        <Filters
          dateStart={dateStart}
          dateEnd={dateEnd}
          minValue={minValue}
          maxValue={maxValue}
          status={statusFilter}
          searchTerm={searchTerm}
          onDateStartChange={setDateStart}
          onDateEndChange={setDateEnd}
          onMinValueChange={setMinValue}
          onMaxValueChange={setMaxValue}
          onStatusChange={setStatusFilter}
          onSearchChange={setSearchTerm}
        />

        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem', color: 'var(--color-primary)' }}>
            <Loader2 className="spin" size={48} />
          </div>
        ) : (
          <DocumentGrid
            documents={filteredDocuments}
            selectedIds={selectedIds}
            onToggleSelect={handleToggleSelect}
            onToggleSelectAll={handleToggleSelectAll}
          />
        )}
      </main>

      {/* Toast Notification */}
      {showSuccessToast && (
        <div style={{
          position: 'fixed',
          bottom: '2rem',
          right: '2rem',
          background: 'white',
          padding: '1rem 1.5rem',
          borderRadius: '12px',
          boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          borderLeft: '4px solid #22c55e',
          animation: 'slideIn 0.3s ease-out'
        }}>
          <CheckCircle2 color="#22c55e" size={24} />
          <div>
            <h4 style={{ margin: 0, fontSize: '0.95rem' }}>Sucesso!</h4>
            <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-muted)' }}>Documentos enviados para aprovação.</p>
          </div>
        </div>
      )}

      {/* Animation Styles */}
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .spin {
          animation: spin 1s linear infinite;
        }
        @keyframes slideIn {
          from { transform: translateY(20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
      `}</style>
    </div>
  );
}

export default App;
