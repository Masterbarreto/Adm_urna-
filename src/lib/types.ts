export type Urna = {
  id: number;
  numero: string;
  localizacao: string;
  status: 'ativa' | 'inativa' | 'manutencao';
  ultimaAtividade: string;
};

export type Eleicao = {
  id: number;
  titulo: string;
  descricao?: string;
  data_inicio: string;
  data_fim:string;
  status: 'criada' | 'ativa' | 'finalizada' | 'cancelada';
};

export type Candidato = {
    id: string;
    nome: string;
    numero: number;
    partido: string;
    foto_url: string;
    id_eleicao: string;
    total_votos?: number;
};

export type Eleitor = {
    id: number;
    nome: string;
    cpf: string;
    matricula: string;
};

export type Log = {
    id: number;
    data: string;
    acao: string;
    usuario: {
      nome: string;
    };
    descricao: string;
};
