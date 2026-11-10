import { useMemo } from 'react';
import { FileText, Download } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '@/components/ui/table';

interface HistoryRecord {
  date: string;
  site: string;
  event: string;
  volume: number;
  status: string;
}

const historyData: HistoryRecord[] = [
  {
    date: '2026-05-18 09:24',
    site: 'Station A',
    event: 'Fuite détectée',
    volume: 120,
    status: 'Résolu',
  },
  {
    date: '2026-05-19 14:10',
    site: 'Station B',
    event: 'Baisse de pression',
    volume: 0,
    status: 'En cours',
  },
  {
    date: '2026-05-20 07:55',
    site: 'Station C',
    event: 'Rupture de canalisation',
    volume: 320,
    status: 'Alerte',
  },
  {
    date: '2026-05-20 11:40',
    site: 'Station D',
    event: 'Contrôle de maintenance',
    volume: 0,
    status: 'Planifié',
  },
];

function downloadFile(content: string | Blob, filename: string, type: string) {
  const blob = content instanceof Blob ? content : new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

function exportToCSV(records: HistoryRecord[]) {
  const header = ['Date', 'Site', 'Événement', 'Volume (m³)', 'Statut'];
  const rows = records.map((record) => [
    record.date,
    record.site,
    record.event,
    record.volume.toString(),
    record.status,
  ]);
  const csv = [header, ...rows]
    .map((row) => row.map((cell) => `"${cell.replace(/"/g, '""')}"`).join(','))
    .join('\r\n');

  downloadFile(csv, 'historique-fuites.csv', 'text/csv;charset=utf-8;');
}

function exportToExcel(records: HistoryRecord[]) {
  const rows = records.map((record) => `
      <tr>
        <td>${record.date}</td>
        <td>${record.site}</td>
        <td>${record.event}</td>
        <td>${record.volume}</td>
        <td>${record.status}</td>
      </tr>
    `);

  const excelFile = `<!DOCTYPE html>
<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
<head>
<meta charset="UTF-8" />
<!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>Historique</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]-->
</head>
<body>
<table>
  <tr>
    <th>Date</th>
    <th>Site</th>
    <th>Événement</th>
    <th>Volume (m³)</th>
    <th>Statut</th>
  </tr>
  ${rows.join('')}
</table>
</body>
</html>`;

  downloadFile(excelFile, 'historique-fuites.xls', 'application/vnd.ms-excel');
}

export function HistoriquePage() {
  const totalRecords = useMemo(() => historyData.length, []);
  const activeAlerts = useMemo(
    () => historyData.filter((record) => record.status !== 'Résolu').length,
    []
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            Historique des données
          </h1>
          <p className="text-slate-500 dark:text-slate-400">
            Export CSV / Excel des historiques de fuite et des événements.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button onClick={() => exportToCSV(historyData)}>
            <Download className="mr-2 h-4 w-4" />
            Export CSV
          </Button>
          <Button variant="secondary" onClick={() => exportToExcel(historyData)}>
            <FileText className="mr-2 h-4 w-4" />
            Export Excel
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="border-slate-200 dark:border-slate-700">
          <CardHeader>
            <CardTitle>Résumé</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between rounded-lg bg-slate-50 p-4 dark:bg-slate-900">
              <div>
                <p className="text-sm text-slate-500">Enregistrements</p>
                <p className="text-2xl font-semibold">{totalRecords}</p>
              </div>
              <Badge className="bg-cyan-500 text-white">Historique</Badge>
            </div>
            <div className="flex items-center justify-between rounded-lg bg-slate-50 p-4 dark:bg-slate-900">
              <div>
                <p className="text-sm text-slate-500">Alertes actives</p>
                <p className="text-2xl font-semibold">{activeAlerts}</p>
              </div>
              <Badge variant="destructive">{activeAlerts > 0 ? 'En cours' : 'Aucune'}</Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-slate-200 dark:border-slate-700">
        <CardHeader>
          <CardTitle>Liste des historiques</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Site</TableHead>
                <TableHead>Événement</TableHead>
                <TableHead>Volume</TableHead>
                <TableHead>Statut</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {historyData.map((record) => (
                <TableRow key={`${record.date}-${record.site}`}>
                  <TableCell>{record.date}</TableCell>
                  <TableCell>{record.site}</TableCell>
                  <TableCell>{record.event}</TableCell>
                  <TableCell>{record.volume} m³</TableCell>
                  <TableCell>
                    <Badge
                      variant={record.status === 'Résolu' ? 'default' : record.status === 'En cours' ? 'secondary' : 'destructive'}
                    >
                      {record.status}
                    </Badge>
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
