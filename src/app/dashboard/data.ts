export type Allocation = {
  id: string;
  course: string;
  professor: string | null;
  workload: number;
  status: 'pendente' | 'definido' | 'conflito';
};

export type Conflict = {
  id: string;
  course: string;
  description: string;
  professors: {
    name: string;
    history: {
      taught: number;
      preference: boolean;
    };
  }[];
};

export const summaryData = {
  requestedDisciplines: 45,
  allocatedProfessors: 32,
  pendingConflicts: 3,
};

export const allocations: Allocation[] = [
  { id: 'CSI01', course: 'Cálculo I', professor: 'Dr. João Silva', workload: 6, status: 'definido' },
  { id: 'CSI02', course: 'Física I', professor: 'Dra. Maria Souza', workload: 6, status: 'definido' },
  { id: 'CSI03', course: 'Introdução à Programação', professor: null, workload: 4, status: 'pendente' },
  { id: 'CSI04', course: 'Algoritmos Avançados', professor: 'CONFLITO', workload: 4, status: 'conflito' },
  { id: 'CSI05', course: 'Inteligência Artificial', professor: 'CONFLITO', workload: 4, status: 'conflito' },
  { id: 'CSI06', course: 'Banco de Dados', professor: 'Dr. Carlos Lima', workload: 4, status: 'definido' },
  { id: 'CSI07', course: 'Sistemas Operacionais', professor: null, workload: 4, status: 'pendente' },
  { id: 'CSI08', course: 'Redes de Computadores', professor: 'CONFLITO', workload: 4, status: 'conflito' },
];

export const professors = [
  { id: 'p1', name: 'Dr. João Silva' },
  { id: 'p2', name: 'Dra. Maria Souza' },
  { id: 'p3', name: 'Dr. Carlos Lima' },
  { id: 'p4', name: 'Dra. Ana Pereira' },
  { id: 'p5', name: 'Dr. Pedro Martins' },
];

export const conflicts: { [key: string]: Conflict } = {
  CSI04: {
    id: 'CSI04',
    course: 'Algoritmos Avançados',
    description: 'Dois professores manifestaram preferência pela mesma disciplina.',
    professors: [
      { name: 'Dra. Ana Pereira', history: { taught: 3, preference: true } },
      { name: 'Dr. Pedro Martins', history: { taught: 1, preference: true } },
    ],
  },
  CSI05: {
    id: 'CSI05',
    course: 'Inteligência Artificial',
    description: 'Conflito de alocação devido a sobreposição de horários com outra disciplina.',
    professors: [
      { name: 'Dr. João Silva', history: { taught: 5, preference: true } },
      { name: 'Dra. Maria Souza', history: { taught: 0, preference: false } },
    ],
  },
  CSI08: {
    id: 'CSI08',
    course: 'Redes de Computadores',
    description: 'Ambos os professores solicitaram a disciplina, um tem mais experiência.',
     professors: [
      { name: 'Dr. Carlos Lima', history: { taught: 4, preference: true } },
      { name: 'Dr. Pedro Martins', history: { taught: 2, preference: true } },
    ],
  },
};

export const progradDemands = [
  { id: 'D001', course: 'Ciência da Computação', semester: '2025.1', disciplines: 45, status: 'Pendente de Aprovação' },
  { id: 'D002', course: 'Engenharia de Produção', semester: '2025.1', disciplines: 38, status: 'Aprovado' },
  { id: 'D003', course: 'Medicina', semester: '2025.1', disciplines: 62, status: 'Rejeitado' },
  { id: 'D004', course: 'Direito', semester: '2025.1', disciplines: 55, status: 'Aprovado' },
  { id: 'D005', course: 'Administração', semester: '2025.1', disciplines: 48, status: 'Pendente de Aprovação' },
];

export const departmentAllocations = [
    { id: 'DA01', course: 'Ciência da Computação', discipline: 'Cálculo I', workload: 6, preferences: ['Dr. João Silva'], history: ['Dr. João Silva', 'Dra. Maria Souza'] },
    { id: 'DA02', course: 'Ciência da Computação', discipline: 'Inteligência Artificial', workload: 4, preferences: ['Dr. João Silva', 'Dra. Ana Pereira'], history: ['Dr. João Silva'] },
    { id: 'DA03', course: 'Ciência da Computação', discipline: 'Banco de Dados', workload: 4, preferences: [], history: ['Dr. Carlos Lima', 'Dra. Ana Pereira'] },
    { id: 'DA04', course: 'Física', discipline: 'Física I', workload: 6, preferences: ['Dra. Maria Souza'], history: ['Dra. Maria Souza'] },
    { id: 'DA05', course: 'Física', discipline: 'Mecânica Quântica', workload: 4, preferences: [], history: [] },
];

export const professorPreferences = [
    { id: 'PP01', name: 'Cálculo I', workload: 6, course: 'Ciência da Computação' },
    { id: 'PP02', name: 'Álgebra Linear', workload: 4, course: 'Matemática' },
    { id: 'PP03', name: 'Inteligência Artificial', workload: 4, course: 'Ciência da Computação' },
    { id: 'PP04', name: 'Física Quântica', workload: 4, course: 'Física' },
    { id: 'PP05', name: 'Engenharia de Software', workload: 4, course: 'Ciência da Computação' },
];
