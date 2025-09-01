'use client';

import * as React from 'react';
import { AlertTriangle, BarChart, Edit, MoreVertical, Users } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { allocations, conflicts, professors, summaryData, type Allocation } from '../data';
import ConflictResolver from './components/conflict-resolver';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

function SummaryCard({ title, value, icon: Icon }: { title: string; value: number | string; icon: React.ElementType }) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
      </CardContent>
    </Card>
  );
}

const statusVariant = {
  definido: 'secondary',
  pendente: 'outline',
  conflito: 'destructive',
} as const;

export default function CoordinatorDashboard() {
  const [currentAllocations, setCurrentAllocations] = React.useState<Allocation[]>(allocations);
  const [openDialogs, setOpenDialogs] = React.useState<Record<string, boolean>>({});

  const handleAllocationChange = (id: string, professorName: string) => {
    setCurrentAllocations(prev =>
      prev.map(alloc => (alloc.id === id ? { ...alloc, professor: professorName, status: 'definido' } : alloc))
    );
  };

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Painel do Coordenador</h1>
      <div className="grid gap-4 md:grid-cols-3">
        <SummaryCard title="Disciplinas Solicitadas" value={summaryData.requestedDisciplines} icon={BarChart} />
        <SummaryCard title="Professores Alocados" value={summaryData.allocatedProfessors} icon={Users} />
        <SummaryCard title="Conflitos Pendentes" value={summaryData.pendingConflicts} icon={AlertTriangle} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Alocação de Disciplinas</CardTitle>
          <CardDescription>Gerencie e visualize a alocação de professores para o semestre 2025.1.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Disciplina</TableHead>
                <TableHead>Professor Alocado</TableHead>
                <TableHead className="text-center">C.H. Semanal</TableHead>
                <TableHead className="text-center">Status</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentAllocations.map((alloc) => (
                <TableRow key={alloc.id}>
                  <TableCell className="font-medium">{alloc.course}</TableCell>
                  <TableCell>
                    {alloc.status === 'conflito' ? (
                      <span className="text-destructive font-semibold">CONFLITO</span>
                    ) : (
                      <Select
                        value={alloc.professor || ''}
                        onValueChange={(value) => handleAllocationChange(alloc.id, value)}
                      >
                        <SelectTrigger className="w-[220px]">
                          <SelectValue placeholder="Selecione um professor" />
                        </SelectTrigger>
                        <SelectContent>
                          {professors.map(p => (
                            <SelectItem key={p.id} value={p.name}>{p.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  </TableCell>
                  <TableCell className="text-center">{alloc.workload}h</TableCell>
                  <TableCell className="text-center">
                    <Badge variant={statusVariant[alloc.status]} className="capitalize">
                      {alloc.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    {alloc.status === 'conflito' ? (
                       <Dialog open={openDialogs[alloc.id] || false} onOpenChange={(isOpen) => setOpenDialogs(prev => ({...prev, [alloc.id]: isOpen}))}>
                        <DialogTrigger asChild>
                           <Button variant="ghost" size="sm">
                             <AlertTriangle className="mr-2 h-4 w-4" />
                             Resolver
                           </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                          <DialogHeader>
                            <DialogTitle>Resolução de Conflito: {alloc.course}</DialogTitle>
                          </DialogHeader>
                          <ConflictResolver 
                            conflict={conflicts[alloc.id]}
                            onResolve={(professorName) => {
                              handleAllocationChange(alloc.id, professorName);
                              setOpenDialogs(prev => ({...prev, [alloc.id]: false}));
                            }}
                          />
                        </DialogContent>
                      </Dialog>
                    ) : (
                      <Button variant="ghost" size="icon">
                        <Edit className="h-4 w-4" />
                        <span className="sr-only">Editar Alocação</span>
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
