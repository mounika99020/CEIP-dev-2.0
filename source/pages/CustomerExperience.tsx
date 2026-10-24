import React, { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Users,
  Activity,
  Award,
  Clock,
  Filter,
  Search,
  ChevronDown,
  ArrowUpDown,
  ExternalLink,
  ShieldAlert,
  HeartHandshake,
} from 'lucide-react';
import { PageContainer } from '../components/layout/PageContainer';
import { Card, CardHeader, CardTitle, CardDescription } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import {
  DEMO_CX_METRICS,
  DEMO_CX_CUSTOMERS,
  DEMO_SEGMENT_DISTRIBUTION,
  CustomerExperienceItem,
} from '../data/demoData';
import { formatCurrency } from '../lib/utils';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
} from 'recharts';

export const CustomerExperience: React.FC = () => {
  const [searchParams] = useSearchParams();
  const initialSearch = searchParams.get('search') || '';

  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const [selectedSegment, setSelectedSegment] = useState<string>('All');
  const [selectedRisk, setSelectedRisk] = useState<string>('All');
  const [selectedContract, setSelectedContract] = useState<string>('All');

  // Customer Detail Modal state
  const [selectedCustomer, setSelectedCustomer] = useState<CustomerExperienceItem | null>(null);

  const filteredCustomers = useMemo(() => {
    return DEMO_CX_CUSTOMERS.filter((customer) => {
      const matchSearch =
        customer.accountName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.id.toLowerCase().includes(searchTerm.toLowerCase());

      const matchSegment =
        selectedSegment === 'All' || customer.segment === selectedSegment;

      const matchRisk =
        selectedRisk === 'All' || customer.riskLevel === selectedRisk;

      const matchContract =
        selectedContract === 'All' || customer.contractType === selectedContract;

      return matchSearch && matchSegment && matchRisk && matchContract;
    });
  }, [searchTerm, selectedSegment, selectedRisk, selectedContract]);

  const segmentChartData = DEMO_SEGMENT_DISTRIBUTION.map((seg) => ({
    name: seg.name,
    count: seg.count,
    avgCES: seg.avgCES,
    arrShare: seg.arrShare,
  }));

  return (
    <PageContainer>
      {/* CX Overview & Engagement Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-[#1c2638] bg-[#111726]/80">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-medium text-slate-400 uppercase tracking-wide">
                Customer Effort Score (CES)
              </p>
              <div className="text-3xl font-bold text-white mt-1">
                {DEMO_CX_METRICS.customerEffortScore.value}
                <span className="text-xs text-slate-500 font-normal ml-1">
                  / {DEMO_CX_METRICS.customerEffortScore.max}
                </span>
              </div>
            </div>
            <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <Activity className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-center gap-2 text-xs">
            <span className="text-emerald-400 font-semibold bg-emerald-500/10 px-1.5 py-0.5 rounded text-[11px]">
              {DEMO_CX_METRICS.customerEffortScore.change}
            </span>
            <span className="text-slate-400">
              Status: {DEMO_CX_METRICS.customerEffortScore.status}
            </span>
          </div>
        </Card>

        <Card className="border-[#1c2638] bg-[#111726]/80">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-medium text-slate-400 uppercase tracking-wide">
                Net Promoter Score (NPS)
              </p>
              <div className="text-3xl font-bold text-white mt-1">
                +{DEMO_CX_METRICS.netPromoterScore.value}
              </div>
            </div>
            <div className="p-2.5 rounded-xl bg-teal-500/10 text-teal-400 border border-teal-500/20">
              <Award className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-center gap-2 text-xs">
            <span className="text-emerald-400 font-semibold bg-emerald-500/10 px-1.5 py-0.5 rounded text-[11px]">
              {DEMO_CX_METRICS.netPromoterScore.change}
            </span>
            <span className="text-slate-400">
              Classification: {DEMO_CX_METRICS.netPromoterScore.status}
            </span>
          </div>
        </Card>

        <Card className="border-[#1c2638] bg-[#111726]/80">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-medium text-slate-400 uppercase tracking-wide">
                Satisfaction Rate (CSAT)
              </p>
              <div className="text-3xl font-bold text-white mt-1">
                {DEMO_CX_METRICS.satisfactionRate.value}%
              </div>
            </div>
            <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <HeartHandshake className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-center gap-2 text-xs">
            <span className="text-emerald-400 font-semibold bg-emerald-500/10 px-1.5 py-0.5 rounded text-[11px]">
              {DEMO_CX_METRICS.satisfactionRate.change}
            </span>
            <span className="text-slate-400">Quarterly average</span>
          </div>
        </Card>

        <Card className="border-[#1c2638] bg-[#111726]/80">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-medium text-slate-400 uppercase tracking-wide">
                Avg Monthly App Usage
              </p>
              <div className="text-3xl font-bold text-white mt-1">
                {DEMO_CX_METRICS.averageActiveTime.value}
                <span className="text-xs text-slate-500 font-normal ml-1">
                  {DEMO_CX_METRICS.averageActiveTime.unit}
                </span>
              </div>
            </div>
            <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-center gap-2 text-xs">
            <span className="text-emerald-400 font-semibold bg-emerald-500/10 px-1.5 py-0.5 rounded text-[11px]">
              {DEMO_CX_METRICS.averageActiveTime.change}
            </span>
            <span className="text-slate-400">Seat engagement volume</span>
          </div>
        </Card>
      </div>

      {/* Customer Segmentation & Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8">
          <Card className="h-full flex flex-col border-[#1c2638]">
            <CardHeader>
              <div>
                <CardTitle>Customer Segmentation Breakdown</CardTitle>
                <CardDescription>
                  Distribution of customer tiers by account volume and average CES rating.
                </CardDescription>
              </div>
              <span className="text-xs font-mono text-slate-400">
                4 Tier Architecture
              </span>
            </CardHeader>

            <div className="flex-1 w-full min-h-[260px] mt-2">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={segmentChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1c2638" vertical={false} />
                  <XAxis dataKey="name" stroke="#64748b" fontSize={12} tickLine={false} />
                  <YAxis stroke="#64748b" fontSize={12} tickLine={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#111726',
                      borderColor: '#24314c',
                      borderRadius: '8px',
                      fontSize: '12px',
                      color: '#f1f5f9',
                    }}
                    formatter={(val: any, name: any) => [
                      name === 'count' ? `${val} accounts` : `${val} / 5.0`,
                      name === 'count' ? 'Account Count' : 'Avg CES',
                    ]}
                  />
                  <Bar dataKey="count" fill="#6366f1" radius={[4, 4, 0, 0]} name="count" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>

        <div className="lg:col-span-4">
          <Card className="h-full border-[#1c2638] flex flex-col justify-between">
            <div>
              <CardHeader>
                <div>
                  <CardTitle>Segment ARR Contribution</CardTitle>
                  <CardDescription>
                    Revenue share vs churn exposure
                  </CardDescription>
                </div>
              </CardHeader>
              <div className="space-y-3 mt-2">
                {DEMO_SEGMENT_DISTRIBUTION.map((seg) => (
                  <div
                    key={seg.name}
                    className="p-3 rounded-lg bg-slate-900/60 border border-[#1f2a3f] flex items-center justify-between"
                  >
                    <div>
                      <span className="text-xs font-semibold text-slate-200 block">
                        {seg.name}
                      </span>
                      <span className="text-[11px] text-slate-400">
                        Avg CES: {seg.avgCES} • Risk Rate: {seg.avgRisk}%
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-mono font-bold text-indigo-300 block">
                        {seg.arrShare}% ARR
                      </span>
                      <span className="text-[10px] text-slate-500">
                        {seg.count} accounts
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <p className="text-[11px] text-slate-500 pt-3 border-t border-[#1c2638] mt-3">
              Enterprise and Mid-Market accounts account for 75% of total recurring revenue.
            </p>
          </Card>
        </div>
      </div>

      {/* Customer Experience Filterable Table */}
      <Card className="border-[#1c2638]">
        <CardHeader>
          <div>
            <CardTitle>Monitored Accounts Telemetry</CardTitle>
            <CardDescription>
              Detailed behavioral, effort, and risk signals per customer.
            </CardDescription>
          </div>
          <div className="text-xs text-slate-400">
            Showing <span className="text-white font-mono">{filteredCustomers.length}</span> accounts
          </div>
        </CardHeader>

        {/* Filter Controls Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 py-3 border-y border-[#1c2638] mb-4">
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search account name or ID..."
              className="w-full bg-[#0b0f17] border border-[#1f2a3f] rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <select
              value={selectedSegment}
              onChange={(e) => setSelectedSegment(e.target.value)}
              className="w-full bg-[#0b0f17] border border-[#1f2a3f] rounded-lg px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
            >
              <option value="All">All Segments</option>
              <option value="Enterprise">Enterprise</option>
              <option value="Mid-Market">Mid-Market</option>
              <option value="Growth">Growth</option>
              <option value="SMB">SMB</option>
            </select>
          </div>

          <div>
            <select
              value={selectedRisk}
              onChange={(e) => setSelectedRisk(e.target.value)}
              className="w-full bg-[#0b0f17] border border-[#1f2a3f] rounded-lg px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
            >
              <option value="All">All Risk Levels</option>
              <option value="Low">Low Risk</option>
              <option value="Medium">Medium Risk</option>
              <option value="High">High Risk</option>
            </select>
          </div>

          <div>
            <select
              value={selectedContract}
              onChange={(e) => setSelectedContract(e.target.value)}
              className="w-full bg-[#0b0f17] border border-[#1f2a3f] rounded-lg px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
            >
              <option value="All">All Contract Types</option>
              <option value="Multi-Year">Multi-Year</option>
              <option value="Annual">Annual</option>
              <option value="Monthly">Monthly</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#1c2638] text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                <th className="py-2.5 px-3">Customer ID & Account</th>
                <th className="py-2.5 px-3">Segment</th>
                <th className="py-2.5 px-3">Contract</th>
                <th className="py-2.5 px-3 text-right">Engagement</th>
                <th className="py-2.5 px-3 text-right">CES</th>
                <th className="py-2.5 px-3">Sentiment</th>
                <th className="py-2.5 px-3">Churn Risk</th>
                <th className="py-2.5 px-3 text-right">Monthly Spend</th>
                <th className="py-2.5 px-3 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1c2638]/60 text-xs">
              {filteredCustomers.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-8 text-center text-slate-500">
                    No customers match current filter settings.
                  </td>
                </tr>
              ) : (
                filteredCustomers.map((cust) => (
                  <tr
                    key={cust.id}
                    className="hover:bg-slate-800/40 transition-colors group cursor-pointer"
                    onClick={() => setSelectedCustomer(cust)}
                  >
                    <td className="py-3 px-3">
                      <div className="font-medium text-slate-200 group-hover:text-indigo-300 transition-colors">
                        {cust.accountName}
                      </div>
                      <div className="text-[11px] font-mono text-slate-500">
                        {cust.id}
                      </div>
                    </td>
                    <td className="py-3 px-3">
                      <span className="text-slate-300">{cust.segment}</span>
                    </td>
                    <td className="py-3 px-3">
                      <span className="text-slate-400">{cust.contractType}</span>
                    </td>
                    <td className="py-3 px-3 text-right font-mono font-medium text-slate-200">
                      {cust.engagementScore}/100
                    </td>
                    <td className="py-3 px-3 text-right font-mono text-slate-300">
                      {cust.cesScore}
                    </td>
                    <td className="py-3 px-3">
                      <Badge
                        size="sm"
                        variant={
                          cust.sentiment === 'Positive'
                            ? 'positive'
                            : cust.sentiment === 'Negative'
                            ? 'negative'
                            : 'neutral'
                        }
                      >
                        {cust.sentiment}
                      </Badge>
                    </td>
                    <td className="py-3 px-3">
                      <Badge
                        size="sm"
                        variant={
                          cust.riskLevel === 'High'
                            ? 'high'
                            : cust.riskLevel === 'Medium'
                            ? 'medium'
                            : 'low'
                        }
                      >
                        {cust.riskLevel}
                      </Badge>
                    </td>
                    <td className="py-3 px-3 text-right font-mono font-medium text-slate-200">
                      {formatCurrency(cust.monthlySpend)}
                    </td>
                    <td className="py-3 px-3 text-center">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedCustomer(cust);
                        }}
                        className="text-[11px] px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                      >
                        Telemetry
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Customer Telemetry Detail Modal */}
      {selectedCustomer && (
        <Modal
          isOpen={!!selectedCustomer}
          onClose={() => setSelectedCustomer(null)}
          title={selectedCustomer.accountName}
          description={`Customer Identifier: ${selectedCustomer.id} • Tier: ${selectedCustomer.segment}`}
          maxWidth="lg"
        >
          <div className="space-y-4">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3 rounded-lg bg-slate-900/60 border border-[#1f2a3f]">
                <span className="text-[11px] text-slate-400 block">Risk Tier</span>
                <Badge
                  size="sm"
                  variant={
                    selectedCustomer.riskLevel === 'High'
                      ? 'high'
                      : selectedCustomer.riskLevel === 'Medium'
                      ? 'medium'
                      : 'low'
                  }
                  className="mt-1"
                >
                  {selectedCustomer.riskLevel} Risk
                </Badge>
              </div>

              <div className="p-3 rounded-lg bg-slate-900/60 border border-[#1f2a3f]">
                <span className="text-[11px] text-slate-400 block">Sentiment</span>
                <Badge
                  size="sm"
                  variant={
                    selectedCustomer.sentiment === 'Positive'
                      ? 'positive'
                      : selectedCustomer.sentiment === 'Negative'
                      ? 'negative'
                      : 'neutral'
                  }
                  className="mt-1"
                >
                  {selectedCustomer.sentiment}
                </Badge>
              </div>

              <div className="p-3 rounded-lg bg-slate-900/60 border border-[#1f2a3f]">
                <span className="text-[11px] text-slate-400 block">Effort (CES)</span>
                <span className="text-base font-bold text-white font-mono mt-0.5 block">
                  {selectedCustomer.cesScore} / 5.0
                </span>
              </div>

              <div className="p-3 rounded-lg bg-slate-900/60 border border-[#1f2a3f]">
                <span className="text-[11px] text-slate-400 block">Monthly Spend</span>
                <span className="text-base font-bold text-emerald-400 font-mono mt-0.5 block">
                  {formatCurrency(selectedCustomer.monthlySpend)}
                </span>
              </div>
            </div>

            <div className="p-3.5 rounded-lg bg-[#0b0f17] border border-[#1f2a3f] space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-400">Contract Agreement:</span>
                <span className="text-slate-200 font-medium">{selectedCustomer.contractType}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Days Since Last Session:</span>
                <span className="text-slate-200 font-medium">{selectedCustomer.lastActiveDays} days ago</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Open Escalations / Support Tickets:</span>
                <span className="text-slate-200 font-medium">{selectedCustomer.supportTickets} tickets</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Engagement Score:</span>
                <span className="text-slate-200 font-medium font-mono">{selectedCustomer.engagementScore}/100</span>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-end gap-2">
              <Button variant="outline" size="sm" onClick={() => setSelectedCustomer(null)}>
                Close
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={() => {
                  const cust = selectedCustomer;
                  setSelectedCustomer(null);
                  window.location.href = `/predictions?customerId=${cust.id}`;
                }}
              >
                Analyze in Prediction Center
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </PageContainer>
  );
};