export type FieldType = 'campo_aberto' | 'estufa' | 'vinha' | 'olival' | 'pomar' | 'outro'

export type SoilType = 'arenoso' | 'argiloso' | 'humoso' | 'misto' | 'outro'

export interface Field {
  id: string;
  nome: string;
  descricao: string;
  tipo: FieldType;
  tipoSolo: SoilType;
  area: number;
  capacidadeIrrigacao: number;
  observacoes: string;
  coordenadas: { lat: number; lng: number } | null;
  dataCriacao: string;
  dataAtualizacao: string;
  ativo: boolean;
  userId: string;
}

export interface CreateFieldDTO extends Omit<Field, 'id' | 'dataCriacao' | 'dataAtualizacao' | 'ativo'> {
  ativo?: boolean
}

export type UpdateFieldDTO = Partial<Omit<Field, 'id' | 'dataCriacao' | 'dataAtualizacao' | 'userId'>>
