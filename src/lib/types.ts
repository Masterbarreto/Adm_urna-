export type Urna = {
  id: number;
  nome: string;
  local: string;
  status: 'online' | 'offline';
  ultimaAtividade: string;
};

export type Eleicao = {
  id: number;
  nome: string;
  dataInicio: string;
  dataFim:string;
  urnaId: number;
};

export type Candidato = {
    id: number;
    nome: string;
    numero: number;
    fotoUrl: string;
    eleicaoId: number;
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
