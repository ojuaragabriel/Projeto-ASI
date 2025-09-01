import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { CheckCircle2, Eye, XCircle } from "lucide-react";
import { progradDemands } from "../data";
import { Badge } from "@/components/ui/badge";

const statusVariant = {
  'Pendente de Aprovação': 'warning',
  'Aprovado': 'success',
  'Rejeitado': 'destructive',
} as const;

export default function ProgradApprovalPage() {
  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Aprovação de Demandas - PROGRAD</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>Demandas de Disciplinas</CardTitle>
          <CardDescription>Revise e aprove as solicitações de disciplinas dos colegiados para o semestre 2025.1.</CardDescription>
          <div className="flex items-center space-x-2 pt-4">
            <Select>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filtrar por semestre" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="2025.1">2025.1</SelectItem>
                <SelectItem value="2024.2">2024.2</SelectItem>
              </SelectContent>
            </Select>
            <Select>
              <SelectTrigger className="w-[220px]">
                <SelectValue placeholder="Filtrar por curso" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os cursos</SelectItem>
                <SelectItem value="cs">Ciência da Computação</SelectItem>
                <SelectItem value="ep">Engenharia de Produção</SelectItem>
                <SelectItem value="med">Medicina</SelectItem>
              </SelectContent>
            </Select>
             <Select>
              <SelectTrigger className="w-[220px]">
                <SelectValue placeholder="Filtrar por status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os status</SelectItem>
                <SelectItem value="pending">Pendente de Aprovação</SelectItem>
                <SelectItem value="approved">Aprovado</SelectItem>
                <SelectItem value="rejected">Rejeitado</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Curso</TableHead>
                <TableHead>Semestre</TableHead>
                <TableHead className="text-center">Nº de Disciplinas</TableHead>
                <TableHead className="text-center">Status</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {progradDemands.map((demand) => (
                <TableRow key={demand.id}>
                  <TableCell className="font-medium">{demand.course}</TableCell>
                  <TableCell>{demand.semester}</TableCell>
                  <TableCell className="text-center">{demand.disciplines}</TableCell>
                  <TableCell className="text-center">
                    <Badge variant={
                        demand.status === 'Aprovado' ? 'default' : 
                        demand.status === 'Rejeitado' ? 'destructive' : 
                        'secondary'
                    }
                    className={demand.status === 'Aprovado' ? 'bg-green-600 text-white' : ''}
                    >
                      {demand.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                        <Button variant="outline" size="icon" aria-label="Visualizar">
                            <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="icon" className="text-green-600 hover:bg-green-100 hover:text-green-700 border-green-300" aria-label="Aprovar">
                            <CheckCircle2 className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="icon" className="text-red-600 hover:bg-red-100 hover:text-red-700 border-red-300" aria-label="Rejeitar">
                            <XCircle className="h-4 w-4" />
                        </Button>
                    </div>
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
