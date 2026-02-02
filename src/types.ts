export type Status = 'pendente' | 'aprovado' | 'reprovado';

export interface DocumentRecord {
  id: string;
  dataLancamento: string; // ISO date string
  tipoDocumento: string;
  fornecedor: string;
  valor: number;
  status: Status;
  responsavelAprovacao?: string;
  dataEnvioAprovacao?: string; // ISO date string
  dataAprovacao?: string; // ISO date string
  observacoes?: string;
}
