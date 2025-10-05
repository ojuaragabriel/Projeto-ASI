
export const SEMESTERS = ['2025.1', '2025.2', '2026.1'];

export interface AreaInterna {
  id: string;
  nome: string;
}

export interface Departamento {
  id: string;
  nome: string;
  areas?: AreaInterna[];
}

export interface Colegiado {
  id: string;
  nome: string;
}

export interface Curso {
  id: string;
  nome: string;
  colegiadoId: string;
}

export interface Disciplina {
  id: string;
  codigo: string;
  nome: string;
  cargaHoraria: number;
  departamentoId: string;
  areaId?: string;
}

export interface Professor {
  id: string;
  nome: string;
  departamentoId: string;
  areaId?: string;
  minHoras: number;
  maxHoras: number;
}

export interface Alocacao {
  disciplinaId: string;
  professorId: string | null;
  semestre: string;
  status: 'alocada' | 'ofertada' | 'pendente';
}

export interface Horario {
    id: string;
    disciplinaId: string;
    turma: string;
    semestre: string;
    dia: 'Segunda' | 'Terça' | 'Quarta' | 'Quinta' | 'Sexta';
    slot: '08:00-10:00' | '10:00-12:00' | '14:00-16:00' | '16:00-18:00';
}

// --- MOCK DATA ---

export const departamentos: Departamento[] = [
  { id: 'd01', nome: 'Departamento de Ciências Exatas e Tecnológicas' },
  {
    id: 'd02',
    nome: 'Departamento de Ciências Jurídicas',
    areas: [
      { id: 'a01', nome: 'Direito Civil' },
      { id: 'a02', nome: 'Direito Trabalhista' },
    ],
  },
  { id: 'd03', nome: 'Departamento de Letras e Artes' },
];

export const colegiados: Colegiado[] = [
  { id: 'c01', nome: 'Colegiado de Engenharia de Computação' },
  { id: 'c02', nome: 'Colegiado de Direito' },
];

export const cursos: Curso[] = [
    { id: 'cur01', nome: 'Engenharia de Computação', colegiadoId: 'c01' },
    { id: 'cur02', nome: 'Direito', colegiadoId: 'c02' },
];


export const disciplinas: Disciplina[] = [
  { id: 'dis01', codigo: 'CET001', nome: 'Cálculo I', cargaHoraria: 6, departamentoId: 'd01' },
  { id: 'dis02', codigo: 'CET002', nome: 'Algoritmos e Programação', cargaHoraria: 4, departamentoId: 'd01' },
  { id: 'dis03', codigo: 'CET003', nome: 'Engenharia de Software', cargaHoraria: 4, departamentoId: 'd01' },
  { id: 'dis04', codigo: 'DCJ001', nome: 'Introdução ao Direito', cargaHoraria: 4, departamentoId: 'd02' },
  { id: 'dis05', codigo: 'DCJ002', nome: 'Direito Civil I', cargaHoraria: 4, departamentoId: 'd02', areaId: 'a01' },
  { id: 'dis06', codigo: 'DLA001', nome: 'Teoria da Literatura', cargaHoraria: 4, departamentoId: 'd03' },
  { id: 'dis07', codigo: 'CET004', nome: 'Banco de Dados', cargaHoraria: 4, departamentoId: 'd01' },
  { id: 'dis08', codigo: 'DCJ003', nome: 'Direito do Trabalho I', cargaHoraria: 4, departamentoId: 'd02', areaId: 'a02' },
  { id: 'dis09', codigo: 'CET005', nome: 'Redes de Computadores', cargaHoraria: 4, departamentoId: 'd01' },
  { id: 'dis10', codigo: 'CET006', nome: 'Inteligência Artificial', cargaHoraria: 4, departamentoId: 'd01' },
];

export const professores: Professor[] = [
  { id: 'p01', nome: 'Dr. João Silva', departamentoId: 'd01', minHoras: 8, maxHoras: 12 },
  { id: 'p02', nome: 'Dra. Ana Pereira', departamentoId: 'd01', minHoras: 10, maxHoras: 16 },
  { id: 'p03', nome: 'Dr. Carlos Lima', departamentoId: 'd02', areaId: 'a01', minHoras: 8, maxHoras: 12 },
  { id: 'p04', nome: 'Dra. Maria Costa', departamentoId: 'd02', areaId: 'a02', minHoras: 8, maxHoras: 12 },
  { id: 'p05', nome: 'Dr. Pedro Martins', departamentoId: 'd03', minHoras: 6, maxHoras: 10 },
  { id: 'p06', nome: 'Você', departamentoId: 'd01', minHoras: 4, maxHoras: 8 },
];

export const alocacoesIniciais: Alocacao[] = [
    { disciplinaId: 'dis01', professorId: 'p01', semestre: '2025.1', status: 'alocada' },
    { disciplinaId: 'dis02', professorId: 'p02', semestre: '2025.1', status: 'alocada' },
    { disciplinaId: 'dis03', professorId: 'p06', semestre: '2025.1', status: 'alocada' },
    { disciplinaId: 'dis05', professorId: 'p03', semestre: '2025.1', status: 'alocada' },
    { disciplinaId: 'dis04', professorId: null, semestre: '2025.1', status: 'ofertada' },
    { disciplinaId: 'dis06', professorId: null, semestre: '2025.1', status: 'pendente' },
    { disciplinaId: 'dis07', professorId: 'p02', semestre: '2025.1', status: 'alocada' },
];

export const horariosIniciais: Horario[] = [
    { id: 'h01', disciplinaId: 'dis01', turma: 'T1', semestre: '2025.1', dia: 'Segunda', slot: '08:00-10:00' },
    { id: 'h02', disciplinaId: 'dis01', turma: 'T1', semestre: '2025.1', dia: 'Quarta', slot: '08:00-10:00' },
    { id: 'h03', disciplinaId: 'dis02', turma: 'T1', semestre: '2025.1', dia: 'Terça', slot: '10:00-12:00' },
    { id: 'h04', disciplinaId: 'dis03', turma: 'T1', semestre: '2025.1', dia: 'Sexta', slot: '14:00-16:00' },
    { id: 'h05', disciplinaId: 'dis05', turma: 'T1', semestre: '2025.1', dia: 'Segunda', slot: '14:00-16:00' },
];

// Adicionando um tipo para as áreas, já que estava faltando
export const areas: AreaInterna[] = [
    { id: 'a01', nome: 'Direito Civil' },
    { id: 'a02', nome: 'Direito Trabalhista' },
]
