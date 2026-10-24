import React, { useState } from 'react';
import {
  Radio,
  HeartHandshake,
  ShieldAlert,
  Sparkles,
  ArrowRight,
  Info,
} from 'lucide-react';
import { Card } from '../ui/Card';
import { DEMO_INTELLIGENCE_FLOW, IntelligenceFlowStep } from '../../data/demoData';
import { cn } from '../../lib/utils';

export const IntelligenceFlow: React.FC = () => {
  const [activeStep, setActiveStep] = useState<string | null>(null);

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Radio':
        return Radio;
      case 'HeartHandshake':
        return HeartHandshake;
      case 'ShieldAlert':
        return ShieldAlert;
      case 'Sparkles':
        return Sparkles;
      default:
        return Radio;
    }
  };

  return (
    <Card className="relative overflow-hidden border-[#1e2a3f] bg-gradient-to-b from-[#111726] to-[#0c101a]">
      {/* Background ambient mesh */}
      <div className="absolute top-0 right-1/4 w-96 h-32 bg-indigo-500/5 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-96 h-32 bg-teal-500/5 blur-3xl pointer-events-none" />

      <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 mb-4 border-b border-[#1c2638] gap-2">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-semibold text-white tracking-tight">
              CEIP Intelligence Flow
            </h2>
            <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-indigo-500/15 text-indigo-300 border border-indigo-500/30">
              End-to-End Pipeline
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Turn customer signals into intelligent retention decisions.
          </p>
        </div>
        <div className="text-[11px] text-slate-500 flex items-center gap-1.5">
          <Info className="w-3.5 h-3.5 text-slate-400" />
          <span>Continuous multi-source inference loop</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 relative">
        {DEMO_INTELLIGENCE_FLOW.map((step, idx) => {
          const Icon = getIcon(step.icon);
          const isSelected = activeStep === step.id;

          return (
            <div
              key={step.id}
              onMouseEnter={() => setActiveStep(step.id)}
              onMouseLeave={() => setActiveStep(null)}
              className={cn(
                'group relative rounded-xl p-4 transition-all duration-200 cursor-default border',
                isSelected
                  ? 'bg-[#151e33] border-indigo-500/50 shadow-glowIndigo'
                  : 'bg-[#111726]/60 border-[#1c2638] hover:border-slate-600'
              )}
            >
              {/* Connector arrow for desktop */}
              {idx < DEMO_INTELLIGENCE_FLOW.length - 1 && (
                <div className="hidden lg:flex absolute -right-3 top-1/2 -translate-y-1/2 z-10 w-6 h-6 rounded-full bg-[#0b0f17] border border-[#1f2a3f] items-center justify-center text-slate-500 group-hover:text-indigo-400 transition-colors">
                  <ArrowRight className="w-3 h-3" />
                </div>
              )}

              <div className="flex items-center justify-between mb-3">
                <span className="text-[11px] font-mono font-bold text-slate-400 group-hover:text-indigo-300 transition-colors">
                  STAGE {step.stepNumber}
                </span>
                <div
                  className={cn(
                    'p-2 rounded-lg transition-colors border',
                    isSelected
                      ? 'bg-indigo-600/20 text-indigo-300 border-indigo-500/30'
                      : 'bg-slate-800/60 text-slate-400 border-slate-700/60 group-hover:text-slate-200'
                  )}
                >
                  <Icon className="w-4 h-4" />
                </div>
              </div>

              <h4 className="text-sm font-semibold text-slate-100 group-hover:text-white transition-colors mb-1">
                {step.title}
              </h4>
              <p className="text-xs text-slate-400 group-hover:text-slate-300 leading-relaxed mb-2">
                {step.shortDesc}
              </p>

              <p className="text-[11px] text-slate-500 group-hover:text-slate-400 leading-normal pt-2 border-t border-[#1c2638]">
                {step.details}
              </p>
            </div>
          );
        })}
      </div>
    </Card>
  );
};