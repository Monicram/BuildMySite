// ============================================================
// BuildMySite Admin — StatCard
// ============================================================
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Minus, type LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: number;        // +/- percentage
  trendLabel?: string;   // e.g. "vs last month"
  color?: 'gold' | 'blue' | 'green' | 'purple' | 'red' | 'orange';
  index?: number;        // stagger animation delay
}

const colorMap = {
  gold:   { bg: 'bg-gold-500/10',   icon: 'text-gold-400',   border: 'border-gold-500/20'   },
  blue:   { bg: 'bg-blue-500/10',   icon: 'text-blue-400',   border: 'border-blue-500/20'   },
  green:  { bg: 'bg-green-500/10',  icon: 'text-green-400',  border: 'border-green-500/20'  },
  purple: { bg: 'bg-purple-500/10', icon: 'text-purple-400', border: 'border-purple-500/20' },
  red:    { bg: 'bg-red-500/10',    icon: 'text-red-400',    border: 'border-red-500/20'    },
  orange: { bg: 'bg-orange-500/10', icon: 'text-orange-400', border: 'border-orange-500/20' },
};

const StatCard = ({
  title,
  value,
  icon: Icon,
  trend,
  trendLabel = 'vs last month',
  color = 'gold',
  index = 0,
}: StatCardProps) => {
  const colors = colorMap[color];

  const TrendIcon =
    trend === undefined || trend === 0
      ? Minus
      : trend > 0
      ? TrendingUp
      : TrendingDown;

  const trendColor =
    trend === undefined || trend === 0
      ? 'text-obsidian-400'
      : trend > 0
      ? 'text-green-400'
      : 'text-red-400';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.07, ease: [0.4, 0, 0.2, 1] }}
      className="relative bg-obsidian-800/60 border border-obsidian-700/50 rounded-xl p-5 overflow-hidden group hover:border-obsidian-600 transition-all duration-300"
    >
      {/* Subtle glow on hover */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br from-gold-500/3 to-transparent rounded-xl" />

      <div className="relative flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <p className="text-xs font-medium text-obsidian-400 uppercase tracking-wider mb-2">
            {title}
          </p>
          <motion.p
            key={String(value)}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-2xl font-bold text-obsidian-50 leading-none mb-3"
          >
            {value}
          </motion.p>

          {trend !== undefined && (
            <div className={`flex items-center gap-1.5 text-xs ${trendColor}`}>
              <TrendIcon size={13} />
              <span className="font-medium">{Math.abs(trend)}%</span>
              <span className="text-obsidian-500">{trendLabel}</span>
            </div>
          )}
        </div>

        <div className={`flex-shrink-0 w-11 h-11 rounded-xl ${colors.bg} border ${colors.border} flex items-center justify-center`}>
          <Icon size={20} className={colors.icon} />
        </div>
      </div>
    </motion.div>
  );
};

export default StatCard;
