import type { LucideIcon } from "lucide-react";
import { motion } from "framer-motion";
import { ArrowUpRight, ArrowDownRight, Clock } from "lucide-react";
import { LineChart, Line, ResponsiveContainer } from "recharts";

type StatsCardProps = {
  title: string;
  value: string;
  description: string;
  Icon?: LucideIcon;
  trend?: number;
  data?: any[];
};

export const StatsCard = ({ title, value, description, Icon, trend = 12.5, data = [
  { value: 40 }, { value: 30 }, { value: 50 }, { value: 45 }, { value: 70 }, { value: 65 }, { value: 85 }
] }: StatsCardProps) => {
  const isPositive = trend >= 0;

  return (
    <motion.div 
      whileHover={{ y: -4, scale: 1.01 }}
      className="rounded-[24px] border border-slate-200/60 bg-white p-6 shadow-[0_2px_12px_rgba(0,0,0,0.02)] hover:shadow-[0_12px_30px_rgba(0,0,0,0.06)] transition-all duration-300 relative overflow-hidden group flex flex-col justify-between h-full min-h-[180px]"
    >
      <div className="absolute -right-8 -top-8 w-32 h-32 bg-emerald-500/5 rounded-full blur-[30px] group-hover:bg-emerald-500/10 transition-colors duration-500" />
      
      <div className="flex items-start justify-between relative z-10">
        <div className="flex items-center gap-3">
          {Icon && (
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-50 text-slate-600 border border-slate-100 group-hover:bg-emerald-50 group-hover:text-emerald-600 group-hover:border-emerald-100 transition-colors">
              <Icon className="h-5 w-5" strokeWidth={2.5} />
            </div>
          )}
          <p className="text-sm font-bold text-slate-500">{title}</p>
        </div>
        
        <div className={`flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-md ${isPositive ? 'bg-emerald-50 text-emerald-600 border border-emerald-100/50' : 'bg-red-50 text-red-600 border border-red-100/50'}`}>
          {isPositive ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
          {Math.abs(trend)}%
        </div>
      </div>

      <div className="mt-4 flex items-end justify-between relative z-10 gap-4">
        <div>
          <h3 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 font-display">
            {value}
          </h3>
          <div className="flex items-center gap-1.5 mt-2">
            <Clock className="w-3 h-3 text-slate-400" />
            <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-widest">
              Updated just now
            </p>
          </div>
        </div>

        {/* Sparkline Chart */}
        <div className="h-12 w-24 shrink-0 opacity-60 group-hover:opacity-100 transition-opacity duration-300">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <Line 
                type="monotone" 
                dataKey="value" 
                stroke={isPositive ? "#10b981" : "#ef4444"} 
                strokeWidth={2.5} 
                dot={false}
                isAnimationActive={true}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </motion.div>
  );
};

export default StatsCard;
