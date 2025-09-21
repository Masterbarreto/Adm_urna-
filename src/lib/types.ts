export type Urna = {
  id: string;
  nome: string;
  local: string;
  status: 'online' | 'offline';
  ultimaAtividade: string;
};

export type Eleicao = {
  id: string;
  nome: string;
  dataInicio: string;
  dataFim:string;
  urnaId: string;
};

export type Candidato = {
    id: string;
    nome: string;
    numero: number;
    fotoUrl: string;
    eleicaoId: string;
};

export type Eleitor = {
    id: string;
    nome: string;
    cpf: string;
    matricula: string;
};

export type Log = {
    id: string;
    data: string;
    acao: string;
    usuario: string;
    descricao: string;
};
