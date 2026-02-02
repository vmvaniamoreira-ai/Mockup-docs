import { Filter, Calendar, DollarSign, Search } from 'lucide-react';
import type { Status } from '../types';
import styles from './Filters.module.css';

interface FiltersProps {
    dateStart: string;
    dateEnd: string;
    minValue: string;
    maxValue: string;
    status: Status | 'todos';
    searchTerm: string;
    onDateStartChange: (val: string) => void;
    onDateEndChange: (val: string) => void;
    onMinValueChange: (val: string) => void;
    onMaxValueChange: (val: string) => void;
    onStatusChange: (val: Status | 'todos') => void;
    onSearchChange: (val: string) => void;
}

export function Filters({
    dateStart,
    dateEnd,
    minValue,
    maxValue,
    status,
    searchTerm,
    onDateStartChange,
    onDateEndChange,
    onMinValueChange,
    onMaxValueChange,
    onStatusChange,
    onSearchChange
}: FiltersProps) {
    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <div className={styles.title}>
                    <Filter size={20} />
                    <span>Filtros</span>
                </div>
            </div>

            <div className={styles.grid}>
                {/* Search */}
                <div className={styles.filterGroup}>
                    <label>Buscar</label>
                    <div className={styles.inputWrapper}>
                        <Search size={16} className={styles.icon} />
                        <input
                            type="text"
                            placeholder="Fornecedor, tipo..."
                            value={searchTerm}
                            onChange={(e) => onSearchChange(e.target.value)}
                        />
                    </div>
                </div>

                {/* Date Range */}
                <div className={styles.filterGroup}>
                    <label>Período</label>
                    <div className={styles.row}>
                        <div className={styles.inputWrapper}>
                            <Calendar size={16} className={styles.icon} />
                            <input
                                type="date"
                                value={dateStart}
                                onChange={(e) => onDateStartChange(e.target.value)}
                            />
                        </div>
                        <span className={styles.separator}>até</span>
                        <div className={styles.inputWrapper}>
                            <Calendar size={16} className={styles.icon} />
                            <input
                                type="date"
                                value={dateEnd}
                                onChange={(e) => onDateEndChange(e.target.value)}
                            />
                        </div>
                    </div>
                </div>

                {/* Value Range */}
                <div className={styles.filterGroup}>
                    <label>Valor (R$)</label>
                    <div className={styles.row}>
                        <div className={styles.inputWrapper}>
                            <DollarSign size={16} className={styles.icon} />
                            <input
                                type="number"
                                placeholder="Mín"
                                value={minValue}
                                onChange={(e) => onMinValueChange(e.target.value)}
                            />
                        </div>
                        <span className={styles.separator}>até</span>
                        <div className={styles.inputWrapper}>
                            <DollarSign size={16} className={styles.icon} />
                            <input
                                type="number"
                                placeholder="Máx"
                                value={maxValue}
                                onChange={(e) => onMaxValueChange(e.target.value)}
                            />
                        </div>
                    </div>
                </div>

                {/* Status */}
                <div className={styles.filterGroup}>
                    <label>Status</label>
                    <select
                        value={status}
                        onChange={(e) => onStatusChange(e.target.value as Status | 'todos')}
                    >
                        <option value="todos">Todos</option>
                        <option value="pendente">Pendente</option>
                        <option value="aprovado">Aprovado</option>
                        <option value="reprovado">Reprovado</option>
                    </select>
                </div>
            </div>
        </div>
    );
}
