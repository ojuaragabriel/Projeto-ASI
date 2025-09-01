'use server';

import { resolveProfessorConflicts } from '@/ai/flows/resolve-professor-conflicts';
import type { ResolveProfessorConflictsOutput } from '@/ai/flows/resolve-professor-conflicts';
import type { Conflict } from '../data';

export async function getConflictSuggestion(conflict: Conflict): Promise<ResolveProfessorConflictsOutput> {
  // Simulate network latency
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  const input = {
    courseName: conflict.course,
    conflictDescription: conflict.description,
    professorAHistory: `Professor: ${conflict.professors[0].name}, lecionou ${conflict.professors[0].history.taught} vezes, preferência: ${conflict.professors[0].history.preference ? 'Sim' : 'Não'}`,
    professorBHistory: `Professor: ${conflict.professors[1].name}, lecionou ${conflict.professors[1].history.taught} vezes, preferência: ${conflict.professors[1].history.preference ? 'Sim' : 'Não'}`,
  };

  try {
    const result = await resolveProfessorConflicts(input);
    return result;
  } catch (error) {
    console.error("AI Error:", error);
    // Fallback in case of AI error
    return {
      suggestedProfessor: conflict.professors[0].name,
      justification: 'Falha ao consultar o sistema de IA. Sugestão baseada no primeiro professor listado.',
    }
  }
}
