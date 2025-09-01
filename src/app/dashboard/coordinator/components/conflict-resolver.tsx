'use client';

import * as React from 'react';
import { Wand2, Loader2, CheckCircle, AlertOctagon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import type { Conflict } from '../../data';
import { getConflictSuggestion } from '../actions';
import type { ResolveProfessorConflictsOutput } from '@/ai/flows/resolve-professor-conflicts';

interface ConflictResolverProps {
  conflict: Conflict;
  onResolve: (professorName: string) => void;
}

export default function ConflictResolver({ conflict, onResolve }: ConflictResolverProps) {
  const [suggestion, setSuggestion] = React.useState<ResolveProfessorConflictsOutput | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const [selectedProfessor, setSelectedProfessor] = React.useState<string | null>(null);
  const [justification, setJustification] = React.useState('');
  const { toast } = useToast();

  const handleGetSuggestion = async () => {
    setIsLoading(true);
    setSuggestion(null);
    try {
      const result = await getConflictSuggestion(conflict);
      setSuggestion(result);
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Erro de IA',
        description: 'Não foi possível obter a sugestão da IA. Tente novamente.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleChoice = (professorName: string) => {
    setSelectedProfessor(professorName);
  }

  const handleFinalResolve = () => {
    if (!selectedProfessor) return;

    const needsJustification = suggestion && selectedProfessor !== suggestion.suggestedProfessor;
    if (needsJustification && !justification.trim()) {
      toast({
        variant: 'destructive',
        title: 'Justificativa Obrigatória',
        description: 'Você deve fornecer uma justificativa ao contrariar a sugestão do sistema.',
      });
      return;
    }

    onResolve(selectedProfessor);
    toast({
      title: 'Conflito Resolvido',
      description: `Professor(a) ${selectedProfessor} alocado(a) para ${conflict.course}.`,
      className: 'bg-green-100 dark:bg-green-900 border-green-400',
    });
  }

  const needsJustification = suggestion && selectedProfessor && selectedProfessor !== suggestion.suggestedProfessor;

  return (
    <div className="space-y-4 p-1">
      <p className="text-sm text-muted-foreground">{conflict.description}</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {conflict.professors.map((prof, index) => (
          <Card key={prof.name} className={selectedProfessor === prof.name ? "border-primary ring-2 ring-primary" : ""}>
            <CardHeader>
              <CardTitle>Professor {String.fromCharCode(65 + index)}: {prof.name}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <p><strong>Histórico:</strong> Lecionou {prof.history.taught} vezes</p>
              <p><strong>Preferência:</strong> {prof.history.preference ? 'Sim' : 'Não'}</p>
              <Button onClick={() => handleChoice(prof.name)} className="w-full mt-4" variant={selectedProfessor === prof.name ? "default" : "outline"}>
                <CheckCircle className="mr-2 h-4 w-4" />
                Escolher {prof.name.split(' ')[1]}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {!suggestion && !isLoading && (
        <div className="text-center p-4 border-dashed border-2 rounded-lg">
          <p className="mb-2 text-muted-foreground">Precisa de ajuda para decidir?</p>
          <Button onClick={handleGetSuggestion} variant="outline">
            <Wand2 className="mr-2 h-4 w-4" />
            Sugerir com IA
          </Button>
        </div>
      )}

      {isLoading && (
        <div className="flex items-center justify-center p-8 text-muted-foreground">
          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
          Analisando dados e gerando sugestão...
        </div>
      )}

      {suggestion && (
        <Card className="bg-primary/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-primary">
              <Wand2 />
              Sugestão da IA
            </CardTitle>
            <CardDescription>
              A IA sugere alocar <strong>{suggestion.suggestedProfessor}</strong>.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm italic">"{suggestion.justification}"</p>
          </CardContent>
        </Card>
      )}

      {needsJustification && (
        <div className="space-y-2 pt-4">
            <Label htmlFor="justification" className="flex items-center gap-2 font-semibold">
                <AlertOctagon className="text-amber-600" />
                Justificativa para contrariar a sugestão
            </Label>
            <Textarea 
                id="justification"
                placeholder="Explique por que a sugestão da IA não foi seguida..."
                value={justification}
                onChange={(e) => setJustification(e.target.value)}
                className="ring-amber-500 focus-visible:ring-amber-500"
            />
        </div>
      )}
      
      <div className="flex justify-end pt-4">
        <Button onClick={handleFinalResolve} disabled={!selectedProfessor || (needsJustification && !justification.trim())}>
            Confirmar Alocação
        </Button>
      </div>
    </div>
  );
}
