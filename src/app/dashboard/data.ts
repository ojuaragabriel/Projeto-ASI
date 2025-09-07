export const professorPreferences = [
    { id: 'PP01', name: 'Cálculo I', workload: 6, course: 'Ciência da Computação' },
    { id: 'PP02', name: 'Álgebra Linear', workload: 4, course: 'Matemática' },
    { id: 'PP03', name: 'Inteligência Artificial', workload: 4, course: 'Ciência da Computação' },
    { id: 'PP04', name: 'Física Quântica', workload: 4, course: 'Física' },
    { id: 'PP05', name: 'Engenharia de Software', workload: 4, course: 'Ciência da Computação' },
    { id: 'PP06', name: 'Banco de Dados', workload: 4, course: 'Ciência da Computação' },
    { id: 'PP07', name: 'Redes de Computadores', workload: 4, course: 'Ciência da Computação' },
];

export const allocationResults = [
  { id: 'AR01', name: 'Cálculo I', professor: 'Dr. João Silva', status: 'Alocado' },
  { id: 'AR02', name: 'Inteligência Artificial', professor: 'Dra. Ana Pereira', status: 'Alocado' },
  { id_user: 'AR03', name: 'Engenharia de Software', professor: 'Você', status: 'Alocado para você' },
  { id: 'AR04', name: 'Física Quântica', professor: null, status: 'Não alocado' },
  { id: 'AR05', name: 'Banco de Dados', professor: 'Dr. Carlos Lima', status: 'Alocado' },
];

export const mySubjects = [
  { id: 'MS01', name: 'Engenharia de Software', course: 'Ciência da Computação', workload: 4, class: 'T01', schedule: 'Seg/Qua 10:00-12:00' },
  { id: 'MS02', name: 'Algoritmos Avançados', course: 'Ciência da Computação', workload: 4, class: 'T01', schedule: 'Ter/Qui 08:00-10:00' },
];
