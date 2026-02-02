import { useEffect, useState } from 'react';
import type { DocumentRecord, Status } from './types';
import { getMockDocuments } from './data/mockData';
import { Filters } from './components/Filters';
import { DocumentGrid } from './components/DocumentGrid';
import { isWithinInterval, parseISO, startOfDay, endOfDay } from 'date-fns';
import { Send, Loader2, CheckCircle2 } from 'lucide-react';
import './index.css';

const ITEMS_PER_PAGE = 10;

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
  const [currentPage, setCurrentPage] = useState(1);

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

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [dateStart, dateEnd, minValue, maxValue, statusFilter, searchTerm]);

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
  }).sort((a, b) => {
    // Default Sort: Date Descending
    return new Date(b.dataLancamento).getTime() - new Date(a.dataLancamento).getTime();
  });

  // Pagination Logic
  const paginatedDocuments = filteredDocuments.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  // Handler functions
  const handleClearFilters = () => {
    setDateStart('');
    setDateEnd('');
    setMinValue('');
    setMaxValue('');
    setStatusFilter('todos');
    setSearchTerm('');
    setCurrentPage(1);
  };

  const handleToggleSelect = (id: string) => {
    const doc = documents.find(d => d.id === id);
    // Safety check: only allow pending
    if (!doc || doc.status !== 'pendente') return;

    const newSelected = new Set(selectedIds);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedIds(newSelected);
  };

  const handleToggleSelectAll = () => {
    // Logic: Toggle selection for ONLY pending documents CURRENTLY visible (paginated or filtered list? usually visible list for intuitively)
    // Actually, usually "Select All" applies to the view. Let's apply to filtered set but only pending ones.
    const pendingInView = filteredDocuments.filter(d => d.status === 'pendente');

    if (pendingInView.length === 0) return;

    const allPendingSelected = pendingInView.every(d => selectedIds.has(d.id));

    const newSelected = new Set(selectedIds);
    if (allPendingSelected) {
      // Unselect all pending in filtered view
      pendingInView.forEach(d => newSelected.delete(d.id));
    } else {
      // Select all pending in filtered view
      pendingInView.forEach(d => newSelected.add(d.id));
    }
    setSelectedIds(newSelected);
  };

  const handleSendForApproval = () => {
    setIsSending(true);
    // Simulate API call
    setTimeout(() => {
      setIsSending(false);
      setShowSuccessToast(true);
      setSelectedIds(new Set());
      setTimeout(() => setShowSuccessToast(false), 3000);
    }, 1500);
  };

  return (
    <div className="app-container" style={{ padding: '2rem', maxWidth: '1400px', margin: '0 auto' }}>

      {/* Header */}
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          {/* Logo */}
          <div style={{
            background: 'white',
            borderRadius: '12px',
            padding: '0.5rem',
            boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
            display: 'flex',
            alignItems: 'center'
          }}>
            <img
              src="/aperam-logo.png"
              alt="Aperam"
              style={{ height: '42px', width: 'auto', display: 'block' }}
              onError={(e) => {
                // Fallback if image fails
                (e.target as HTMLImageElement).style.display = 'none';
                ((e.target as HTMLImageElement).nextSibling as HTMLElement).style.display = 'block';
              }}
            />
            <div style={{ display: 'none', fontWeight: 'bold', color: 'var(--color-primary)', padding: '0 1rem' }}>APERAM</div>
          </div>

          <div style={{ borderLeft: '1px solid rgba(0,0,0,0.1)', paddingLeft: '1.5rem', height: '40px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <h1 style={{ margin: 0, fontSize: '1.5rem', fontWeight: '700', color: 'var(--color-primary)', lineHeight: '1.2' }}>Controle de Documentos</h1>
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
            padding: '0.75rem 1.75rem',
            borderRadius: '10px',
            fontWeight: '600',
            fontSize: '0.95rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.6rem',
            boxShadow: '0 8px 16px -4px rgba(240, 125, 62, 0.3)',
            opacity: selectedIds.size === 0 ? 0.6 : 1,
            cursor: selectedIds.size === 0 ? 'not-allowed' : 'pointer',
            transition: 'all 0.2s',
            transform: selectedIds.size > 0 ? 'translateY(0)' : 'none'
          }}
          onMouseDown={e => !e.currentTarget.disabled && (e.currentTarget.style.transform = 'translateY(1px)')}
          onMouseUp={e => !e.currentTarget.disabled && (e.currentTarget.style.transform = 'translateY(0)')}
        >
          {isSending ? <Loader2 className="spin" size={20} /> : <Send size={20} />}
          <span>{isSending ? 'Enviando...' : 'Enviar para Aprovação'}</span>
          {selectedIds.size > 0 && (
            <span style={{
              background: 'rgba(255,255,255,0.2)',
              padding: '2px 8px',
              borderRadius: '12px',
              fontSize: '0.85rem'
            }}>
              {selectedIds.size}
            </span>
          )}
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
          onClearFilters={handleClearFilters}
        />

        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '6rem', color: 'var(--color-primary)' }}>
            <Loader2 className="spin" size={48} />
          </div>
        ) : (
          <DocumentGrid
            documents={paginatedDocuments}
            selectedIds={selectedIds}
            onToggleSelect={handleToggleSelect}
            onToggleSelectAll={handleToggleSelectAll}
            totalItems={filteredDocuments.length}
            currentPage={currentPage}
            itemsPerPage={ITEMS_PER_PAGE}
            onPageChange={setCurrentPage}
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
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
          display: 'flex',
          alignItems: 'center',
          gap: '1rem',
          borderLeft: '6px solid #22c55e',
          animation: 'slideIn 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
          zIndex: 100
        }}>
          <div style={{ background: '#dcfce7', padding: '8px', borderRadius: '50%' }}>
            <CheckCircle2 color="#166534" size={24} />
          </div>
          <div>
            <h4 style={{ margin: '0 0 2px 0', fontSize: '1rem', color: '#14532d' }}>Sucesso!</h4>
            <p style={{ margin: 0, fontSize: '0.9rem', color: '#166534' }}>Documentos enviados para aprovação.</p>
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
          from { transform: translateY(100%); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
      `}</style>
    </div>
  );
}

export default App;
