import type { DocumentRecord } from '../types';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { CheckCircle, Clock, XCircle, AlertCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import styles from './DocumentGrid.module.css';
import { cn } from '../utils';

interface DocumentGridProps {
    documents: DocumentRecord[];
    selectedIds: Set<string>;
    onToggleSelect: (id: string) => void;
    onToggleSelectAll: () => void;
    totalItems: number;
    currentPage: number;
    itemsPerPage: number;
    onPageChange: (page: number) => void;
}

export function DocumentGrid({
    documents,
    selectedIds,
    onToggleSelect,
    onToggleSelectAll,
    totalItems,
    currentPage,
    itemsPerPage,
    onPageChange
}: DocumentGridProps) {

    // Only count as selectable those that are pending
    const pendingDocuments = documents.filter(d => d.status === 'pendente');
    const allSelected = pendingDocuments.length > 0 && pendingDocuments.every(d => selectedIds.has(d.id));
    const someSelected = pendingDocuments.some(d => selectedIds.has(d.id));

    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const startItem = (currentPage - 1) * itemsPerPage + 1;
    const endItem = Math.min(currentPage * itemsPerPage, totalItems);

    const formatDate = (dateString?: string) => {
        if (!dateString) return '-';
        return format(new Date(dateString), 'dd/MM/yyyy', { locale: ptBR });
    };

    const formatCurrency = (val: number) => {
        return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);
    };

    const getStatusConfig = (status: string) => {
        switch (status) {
            case 'aprovado':
                return { icon: CheckCircle, className: styles.statusApproved, label: 'Aprovado' };
            case 'reprovado':
                return { icon: XCircle, className: styles.statusRejected, label: 'Reprovado' };
            case 'pendente':
            default:
                return { icon: Clock, className: styles.statusPending, label: 'Pendente' };
        }
    };

    return (
        <div className={styles.tableContainer}>
            <div className={styles.tableWrapper}>
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th className={styles.checkboxCol}>
                                <input
                                    type="checkbox"
                                    checked={allSelected}
                                    ref={input => { if (input) input.indeterminate = !allSelected && someSelected; }}
                                    onChange={onToggleSelectAll}
                                    className={styles.checkbox}
                                    disabled={pendingDocuments.length === 0}
                                />
                            </th>
                            <th>Data Lançamento</th>
                            <th>Tipo</th>
                            <th>Fornecedor</th>
                            <th>Valor</th>
                            <th>Status</th>
                            <th>Aprovador</th>
                            <th>Data Envio</th>
                            <th>Data Aprov.</th>
                            <th>Obs.</th>
                        </tr>
                    </thead>
                    <tbody>
                        {documents.length === 0 ? (
                            <tr>
                                <td colSpan={10} className={styles.emptyState}>
                                    <div className={styles.emptyContent}>
                                        <AlertCircle size={48} />
                                        <p>Nenhum documento encontrado.</p>
                                    </div>
                                </td>
                            </tr>
                        ) : (
                            documents.map((doc) => {
                                const { icon: StatusIcon, className: statusClass, label: statusLabel } = getStatusConfig(doc.status);
                                const isSelected = selectedIds.has(doc.id);
                                const isSelectable = doc.status === 'pendente';

                                return (
                                    <tr key={doc.id} className={cn(isSelected && styles.rowSelected)}>
                                        <td className={styles.checkboxCol}>
                                            <input
                                                type="checkbox"
                                                checked={isSelected}
                                                onChange={() => onToggleSelect(doc.id)}
                                                className={styles.checkbox}
                                                disabled={!isSelectable}
                                                title={!isSelectable ? `Documentos ${doc.status}s não podem ser selecionados` : ''}
                                            />
                                        </td>
                                        <td>{formatDate(doc.dataLancamento)}</td>
                                        <td><span className={styles.badge}>{doc.tipoDocumento}</span></td>
                                        <td className={styles.fontMedium}>{doc.fornecedor}</td>
                                        <td className={styles.fontMono}>{formatCurrency(doc.valor)}</td>
                                        <td>
                                            <div className={cn(styles.statusBadge, statusClass)}>
                                                <StatusIcon size={14} />
                                                <span>{statusLabel}</span>
                                            </div>
                                        </td>
                                        <td className={styles.textSecondary}>{doc.responsavelAprovacao || '-'}</td>
                                        <td className={styles.textSecondary}>{formatDate(doc.dataEnvioAprovacao)}</td>
                                        <td className={styles.textSecondary}>{formatDate(doc.dataAprovacao)}</td>
                                        <td className={styles.textSmall} title={doc.observacoes}>{doc.observacoes || '-'}</td>
                                    </tr>
                                );
                            })
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination Footer */}
            {totalItems > 0 && (
                <div className={styles.pagination}>
                    <div className={styles.pageInfo}>
                        {startItem}–{endItem} de {totalItems} registros
                    </div>
                    <div className={styles.pageButtons}>
                        <button
                            className={styles.pageButton}
                            disabled={currentPage === 1}
                            onClick={() => onPageChange(currentPage - 1)}
                        >
                            <ChevronLeft size={16} />
                        </button>
                        <button
                            className={styles.pageButton}
                            disabled={currentPage === totalPages}
                            onClick={() => onPageChange(currentPage + 1)}
                        >
                            <ChevronRight size={16} />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
