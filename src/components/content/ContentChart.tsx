'use client';

import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  RadarChart,
  Radar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Cell
} from 'recharts';

// Chart color palette
const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'];
const VOICEFLEET_COLOR = '#3b82f6';
const ALTERNATIVE_COLOR = '#94a3b8';

export interface ChartConfig {
  id: string;
  type: 'bar' | 'line' | 'pie' | 'radar';
  title: string;
  data: Array<{ name: string; value: number; [key: string]: string | number }>;
  xAxisLabel?: string;
  yAxisLabel?: string;
  source?: string;
  sourceId?: number;
}

interface ContentChartProps {
  config: ChartConfig;
  className?: string;
}

export function ContentChart({ config, className = '' }: ContentChartProps) {
  const { type, title, data, xAxisLabel, yAxisLabel, source } = config;

  const renderChart = () => {
    switch (type) {
      case 'bar':
        return (
          <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis
              dataKey="name"
              tick={{ fill: '#6b7280', fontSize: 12 }}
              label={xAxisLabel ? { value: xAxisLabel, position: 'insideBottom', offset: -5 } : undefined}
            />
            <YAxis
              tick={{ fill: '#6b7280', fontSize: 12 }}
              label={yAxisLabel ? { value: yAxisLabel, angle: -90, position: 'insideLeft' } : undefined}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'white',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
              }}
            />
            <Legend />
            <Bar dataKey="value" fill={VOICEFLEET_COLOR} radius={[4, 4, 0, 0]}>
              {data.map((_, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        );

      case 'line':
        return (
          <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="name" tick={{ fill: '#6b7280', fontSize: 12 }} />
            <YAxis tick={{ fill: '#6b7280', fontSize: 12 }} />
            <Tooltip
              contentStyle={{
                backgroundColor: 'white',
                border: '1px solid #e5e7eb',
                borderRadius: '8px'
              }}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="value"
              stroke={VOICEFLEET_COLOR}
              strokeWidth={2}
              dot={{ fill: VOICEFLEET_COLOR, r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        );

      case 'pie':
        return (
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name}: ${((percent ?? 0) * 100).toFixed(0)}%`}
              outerRadius={100}
              fill="#8884d8"
              dataKey="value"
            >
              {data.map((_, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        );

      case 'radar':
        // Radar chart expects different data structure
        const radarData = data.map(d => ({
          feature: d.name || d.feature,
          voicefleet: d.voicefleet || d.value,
          alternative: d.alternative || 0
        }));

        return (
          <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
            <PolarGrid stroke="#e5e7eb" />
            <PolarAngleAxis dataKey="feature" tick={{ fill: '#6b7280', fontSize: 11 }} />
            <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: '#6b7280', fontSize: 10 }} />
            <Radar
              name="VoiceFleet"
              dataKey="voicefleet"
              stroke={VOICEFLEET_COLOR}
              fill={VOICEFLEET_COLOR}
              fillOpacity={0.3}
            />
            {radarData.some(d => d.alternative > 0) && (
              <Radar
                name="Alternative"
                dataKey="alternative"
                stroke={ALTERNATIVE_COLOR}
                fill={ALTERNATIVE_COLOR}
                fillOpacity={0.3}
              />
            )}
            <Legend />
            <Tooltip />
          </RadarChart>
        );

      default:
        return <div className="text-gray-500">Unknown chart type: {type}</div>;
    }
  };

  return (
    <div className={`my-8 ${className}`}>
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
        <h4 className="text-lg font-semibold text-gray-900 mb-4 text-center">{title}</h4>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            {renderChart()}
          </ResponsiveContainer>
        </div>
        {source && (
          <p className="mt-4 text-sm text-gray-500 text-center">
            Source: {source}
          </p>
        )}
      </div>
    </div>
  );
}

export default ContentChart;
