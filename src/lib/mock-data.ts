import type { Urna, Eleicao, Candidato, Eleitor, Log } from './types';

export const mockUrnas: Urna[] = [
  {
    id: 'URNA-001',
    nome: 'Urna Principal',
    local: 'Seção 1, Zona A',
    status: 'online',
    ultimaAtividade: '2024-08-15T10:30:00Z',
  },
];

export const mockEleicoes: Eleicao[] = [
  {
    id: 'ELE-2024-PRES',
    nome: 'Eleição Presidencial 2024',
    dataInicio: '2024-10-02T08:00:00Z',
    dataFim: '2024-10-02T17:00:00Z',
    urnaId: 'URNA-001',
  },
  {
    id: 'ELE-2024-GOV',
    nome: 'Eleição para Governador 2024',
    dataInicio: '2024-10-02T08:00:00Z',
    dataFim: '2024-10-02T17:00:00Z',
    urnaId: 'URNA-001',
  },
];

export const mockCandidatos: Candidato[] = [
    { id: 'CAND-01', nome: 'Fulano de Tal', numero: 10, fotoUrl: 'https://picsum.photos/seed/c1/200/200', eleicaoId: 'ELE-2024-PRES' },
    { id: 'CAND-02', nome: 'Ciclana da Silva', numero: 20, fotoUrl: 'https://picsum.photos/seed/c2/200/200', eleicaoId: 'ELE-2024-PRES' },
    { id: 'CAND-03', nome: 'Beltrano Souza', numero: 30, fotoUrl: 'https://picsum.photos/seed/c3/200/200', eleicaoId: 'ELE-2024-PRES' },
];

export const mockEleitores: Eleitor[] = Array.from({ length: 50 }, (_, i) => ({
    id: `ELET-${String(i+1).padStart(4, '0')}`,
    nome: `Eleitor ${i + 1}`,
    cpf: `123.456.789-${String(i).padStart(2, '0')}`,
    matricula: `987654${String(i).padStart(3, '0')}`,
}));

export const mockLogs: Log[] = [
    { id: 'LOG-01', data: '2024-08-15T10:00:00Z', acao: 'Criação de Eleição', usuario: 'admin', descricao: 'Eleição "Eleição Presidencial 2024" criada.' },
    { id: 'LOG-02', data: '2024-08-15T10:05:00Z', acao: 'Adição de Candidato', usuario: 'admin', descricao: 'Candidato "Fulano de Tal" adicionado à eleição "Eleição Presidencial 2024".' },
    { id: 'LOG-03', data: '2024-08-15T10:20:00Z', acao: 'Edição de Urna', usuario: 'admin', descricao: 'Urna "Urna Principal" atualizada.' },
    { id: 'LOG-04', data: '2024-08-15T11:00:00Z', acao: 'Login de Usuário', usuario: 'admin', descricao: 'Usuário admin logado com sucesso.' },
];

export const mockResultados = {
    totalVotos: 1234,
    votosNulos: 50,
    votosBrancos: 25,
    votosPorCandidato: [
        { nome: 'Fulano de Tal', votos: 550 },
        { nome: 'Ciclana da Silva', votos: 450 },
        { nome: 'Beltrano Souza', votos: 159 },
    ],
};
