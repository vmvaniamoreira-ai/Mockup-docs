import type { DocumentRecord } from '../types';
import { subDays } from 'date-fns';

const generateId = () => Math.random().toString(36).substr(2, 9);

const documentosBase: DocumentRecord[] = [
    // Energia
    {
        id: generateId(),
        dataLancamento: subDays(new Date(), 2).toISOString(),
        tipoDocumento: 'Energia',
        fornecedor: 'CPFL',
        valor: 450.50,
        status: 'pendente',
        observacoes: 'Consumo referente ao mês anterior'
    },
    {
        id: generateId(),
        dataLancamento: subDays(new Date(), 5).toISOString(),
        tipoDocumento: 'Energia',
        fornecedor: 'Cemig',
        valor: 1250.00,
        status: 'aprovado',
        responsavelAprovacao: 'Carlos Silva',
        dataEnvioAprovacao: subDays(new Date(), 4).toISOString(),
        dataAprovacao: subDays(new Date(), 3).toISOString()
    },
    {
        id: generateId(),
        dataLancamento: subDays(new Date(), 10).toISOString(),
        tipoDocumento: 'Energia',
        fornecedor: 'Energisa',
        valor: 890.30,
        status: 'reprovado',
        responsavelAprovacao: 'Ana Souza',
        dataEnvioAprovacao: subDays(new Date(), 9).toISOString(),
        dataAprovacao: subDays(new Date(), 8).toISOString(),
        observacoes: 'Valor acima da média histórica'
    },

    // Telefonia
    {
        id: generateId(),
        dataLancamento: subDays(new Date(), 1).toISOString(),
        tipoDocumento: 'Telefonia',
        fornecedor: 'Vivo',
        valor: 199.90,
        status: 'pendente'
    },
    {
        id: generateId(),
        dataLancamento: subDays(new Date(), 15).toISOString(),
        tipoDocumento: 'Telefonia',
        fornecedor: 'Claro',
        valor: 350.00,
        status: 'aprovado',
        responsavelAprovacao: 'Carlos Silva',
        dataEnvioAprovacao: subDays(new Date(), 14).toISOString(),
        dataAprovacao: subDays(new Date(), 13).toISOString()
    },
    {
        id: generateId(),
        dataLancamento: subDays(new Date(), 20).toISOString(),
        tipoDocumento: 'Telefonia',
        fornecedor: 'Tim',
        valor: 150.00,
        status: 'pendente'
    },

    // Locações
    {
        id: generateId(),
        dataLancamento: subDays(new Date(), 3).toISOString(),
        tipoDocumento: 'Locações',
        fornecedor: 'Localiza',
        valor: 1200.00,
        status: 'pendente',
        observacoes: 'Aluguel de veículo para visita técnica'
    },

    // Serviços
    {
        id: generateId(),
        dataLancamento: subDays(new Date(), 7).toISOString(),
        tipoDocumento: 'Serviços',
        fornecedor: 'Tech Solutions',
        valor: 2500.00,
        status: 'aprovado',
        responsavelAprovacao: 'Maria Oliveira',
        dataEnvioAprovacao: subDays(new Date(), 6).toISOString(),
        dataAprovacao: subDays(new Date(), 5).toISOString(),
        observacoes: 'Manutenção de servidores'
    },

    // Diversos
    {
        id: generateId(),
        dataLancamento: subDays(new Date(), 1).toISOString(),
        tipoDocumento: 'Diversos',
        fornecedor: 'Papelaria Central',
        valor: 85.50,
        status: 'pendente',
        observacoes: 'Material de escritório'
    },
    {
        id: generateId(),
        dataLancamento: subDays(new Date(), 12).toISOString(),
        tipoDocumento: 'Diversos',
        fornecedor: 'Restaurante Sabor',
        valor: 320.00,
        status: 'reprovado',
        responsavelAprovacao: 'Carlos Silva',
        dataEnvioAprovacao: subDays(new Date(), 11).toISOString(),
        dataAprovacao: subDays(new Date(), 10).toISOString(),
        observacoes: 'Fora da política de reembolso'
    }
];

export const getMockDocuments = (): Promise<DocumentRecord[]> => {
    return new Promise((resolve) => {
        setTimeout(() => resolve(documentosBase), 500); // Simulate network delay
    });
};
