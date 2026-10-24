import React from 'react';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
} from 'recharts';
import { Card, CardHeader, CardTitle, CardDescription } from '../ui/Card';
import { RiskDistributionItem } from '../../data/demoData';
import { formatNumber } from '../../lib/utils';

interface RiskDistributionProps {
  data: RiskDistributionItem[];
}

export const RiskDistribution: React.FC<RiskDistributionProps> = ({ data }) => {
  const total = data.reduce((acc, curr) => acc + curr.count, 0);

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <div>
          <CardTitle>Customer Risk Distribution</CardTitle>
          <CardDescription>Customers by churn risk level.</CardDescription>
        </div>
      </CardHeader>

      <div className="flex-1 flex flex-col justify-center items-center py-2">
        <div className="relative w-full h-[210px] flex items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Tooltip
                contentStyle={{
                  backgroundColor: '#111726',
                  borderColor: '#24314c',
                  borderRadius: '8px',
                  fontSize: '12px',
                  color: '#f1f5f9',
                }}
                formatter={(value: any, _name: any, entry: any) => [
                  `${value}% (${formatNumber(entry.payload.count)} accounts)`,
                  entry.payload.name,
                ]}
              />
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={62}
                outerRadius={88}
                paddingAngle={4}
                dataKey="value"
                stroke="#0b0f17"
                strokeWidth={3}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>

          {/* Center stats */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-xl font-bold text-white tracking-tight">
              {formatNumber(total)}
            </span>
            <span className="text-[11px] text-slate-400 uppercase tracking-wider">
              Total Accounts
            </span>
          </div>
        </div>

        {/* Categories breakdown */}
        <div className="w-full grid grid-cols-3 gap-2 pt-3 border-t border-[#1c2638] mt-2">
          {data.map((item) => (
            <div key={item.name} className="flex flex-col items-center text-center p-1.5 rounded-lg bg-slate-900/40">
              <div className="flex items-center gap-1.5 mb-1">
                <span
                  className="w-2.5 h-2.5 rounded-full"
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-xs font-medium text-slate-300">
                  {item.name}
                </span>
              </div>
              <span className="text-sm font-semibold text-slate-100">
                {item.value}%
              </span>
              <span className="text-[11px] text-slate-400">
                {formatNumber(item.count)}
              </span>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
};