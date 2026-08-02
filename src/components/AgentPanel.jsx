import React from 'react';
import { Cpu, Activity, CheckCircle, ShieldAlert } from 'lucide-react';

const AgentPanel = ({ agents, activeAgent, onSelectAgent }) => {
  return (
    <div className="w-full bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-xl">
      <div className="flex items-center justify-between mb-4 border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <Cpu className="w-5 h-5 text-emerald-400 animate-pulse" />
          <h3 className="text-lg font-semibold text-slate-100">Cockroach Agent Swarm</h3>
        </div>
        <span className="px-2.5 py-1 text-xs font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full">
          {agents.filter(a => a.status === 'active').length} / {agents.length} Online
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {agents.map((agent) => {
          const isSelected = activeAgent?.id === agent.id;
          return (
            <div
              key={agent.id}
              onClick={() => onSelectAgent(agent)}
              className={`cursor-pointer p-3.5 rounded-lg border transition-all duration-200 ${
                isSelected
                  ? 'bg-emerald-950/30 border-emerald-500 shadow-lg shadow-emerald-950/50'
                  : 'bg-slate-800/50 border-slate-700/60 hover:border-slate-600 hover:bg-slate-800'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2.5">
                  <div className={`p-2 rounded-lg ${isSelected ? 'bg-emerald-500 text-slate-950' : 'bg-slate-700 text-slate-300'}`}>
                    <Activity className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-slate-200">{agent.name}</h4>
                    <p className="text-xs text-slate-400 font-mono">{agent.role}</p>
                  </div>
                </div>
                {agent.status === 'active' ? (
                  <CheckCircle className="w-4 h-4 text-emerald-400" />
                ) : (
                  <ShieldAlert className="w-4 h-4 text-amber-400" />
                )}
              </div>
              <div className="mt-3 flex items-center justify-between text-xs text-slate-400 border-t border-slate-800/80 pt-2">
                <span>Model: {agent.model || 'Mistral-Medium'}</span>
                <span className="font-mono text-emerald-400">{agent.load || '0%'} Load</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AgentPanel;
