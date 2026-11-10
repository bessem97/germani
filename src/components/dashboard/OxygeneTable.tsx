
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

import {
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  LineChart,
  Line,
  Legend,
} from 'recharts';

type Props = {
  data: Array<any>;
};

export default function OxygeneTable({ data }: Props) {
  const sortedData = [...(data || [])]
    .map((item) => ({
      ...item,
      do_mgl: Number(item.do_mgl),
      temperature: Number(item.temperature),
      date_heure: item.date_heure,
    }))
    .sort((a, b) => {
      const dateA = new Date(a.date_heure).getTime();
      const dateB = new Date(b.date_heure).getTime();
      return dateA - dateB;
    });
  const chartData = sortedData.slice(-30);

  return (
    <Card className="col-span-1 lg:col-span-4">
      <CardHeader>
        <CardTitle>Graphique Oxygène (ligne 1)</CardTitle>
      </CardHeader>
      <CardContent>
        {(!data || data.length === 0) ? (
          <div className="text-sm text-slate-500">Aucun relevé disponible.</div>
        ) : (
          <div className="h-[420px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis
                  dataKey="date_heure"
                  tickFormatter={(value) => value?.slice(11, 16)}
                  stroke="#64748b"
                  minTickGap={15}
                />
                <YAxis
                  yAxisId="left"
                  stroke="#0ea5e9"
                  tickFormatter={(value) => value?.toFixed(2)}
                />
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  stroke="#f97316"
                  tickFormatter={(value) => value?.toFixed(1)}
                />
                <Tooltip
                  labelFormatter={(label) => `Date / heure : ${label}`}
                  formatter={(value, name) => [value, name === 'do_mgl' ? 'Oxygène (mg/L)' : 'Température (°C)']}
                />
                <Legend verticalAlign="top" height={36} />
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="do_mgl"
                  stroke="#0ea5e9"
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 5 }}
                  name="Oxygène (mg/L)"
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="temperature"
                  stroke="#f97316"
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 5 }}
                  name="Température (°C)"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
