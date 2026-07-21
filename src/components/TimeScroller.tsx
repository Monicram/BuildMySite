import React, { useEffect, useState, useRef } from 'react';
import { AvailabilityResponse } from '../lib/api';
import { CALL_DURATION, minutesToTime, timeToMinutes, rangesOverlap } from '../lib/availabilityUtils';

interface TimeScrollerProps {
  availability: AvailabilityResponse | null;
  value: string; // "HH:MM" 24h
  onChange: (val: string) => void;
  disabled?: boolean;
}

const BUSINESS_START = 9 * 60; // 09:00
const BUSINESS_END = 21 * 60; // 21:00 (so latest start is 20:00)

// We'll offer slots in 15-minute increments for sanity, otherwise 60 mins of scrolling is crazy.
const INTERVAL = 15;

const generateAllSlots = () => {
  const slots: string[] = [];
  for (let m = BUSINESS_START; m <= BUSINESS_END - CALL_DURATION; m += INTERVAL) {
    slots.push(minutesToTime(m));
  }
  return slots;
};

const Wheel = ({ 
  options, 
  value, 
  onChange,
}: { 
  options: { label: string; value: string }[];
  value: string;
  onChange: (val: string) => void;
  label?: string;
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const idx = options.findIndex(o => o.value === value);
    if (idx >= 0 && scrollRef.current) {
      scrollRef.current.scrollTop = idx * 40;
    }
  }, [value, options]);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const el = e.currentTarget;
    const idx = Math.round(el.scrollTop / 40);
    if (options[idx] && options[idx].value !== value) {
      onChange(options[idx].value);
    }
  };

  return (
    <div className="relative h-[120px] overflow-hidden flex-1 select-none">
      <div className="absolute top-[40px] left-0 right-0 h-[40px] border-t border-b border-gold-500/30 bg-gold-500/5 pointer-events-none" />
      <div 
        ref={scrollRef}
        onScroll={handleScroll}
        className="h-full overflow-y-auto snap-y snap-mandatory hide-scrollbar relative z-10"
        style={{ scrollBehavior: 'smooth' }}
      >
        <div className="h-[40px]" /> {/* Top padding */}
        {options.map((opt) => (
          <div 
            key={opt.value} 
            className={`h-[40px] snap-center flex items-center justify-center text-lg font-medium transition-colors cursor-pointer ${
              opt.value === value ? 'text-gold-400 scale-110' : 'text-obsidian-400'
            }`}
            onClick={() => onChange(opt.value)}
          >
            {opt.label}
          </div>
        ))}
        <div className="h-[40px]" /> {/* Bottom padding */}
      </div>
    </div>
  );
};

export default function TimeScroller({ availability, value, onChange, disabled }: TimeScrollerProps) {
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);
  
  // Format parsed
  const [period, setPeriod] = useState(value >= '12:00' ? 'PM' : 'AM');
  const [hour, setHour] = useState(() => {
    if (!value) return '09';
    let h = parseInt(value.substring(0,2));
    if (h === 0) h = 12;
    if (h > 12) h -= 12;
    return h.toString().padStart(2, '0');
  });
  const [minute, setMinute] = useState(value ? value.substring(3,5) : '00');

  useEffect(() => {
    const all = generateAllSlots();
    if (!availability || availability.dayDisabled) {
      setAvailableSlots([]);
      return;
    }
    const valid = all.filter(timeStr => {
      const startMins = timeToMinutes(timeStr);
      const endMins = startMins + CALL_DURATION;
      const endTimeStr = minutesToTime(endMins);

      if (rangesOverlap(timeStr, endTimeStr, availability.disabledRanges)) return false;
      if (rangesOverlap(timeStr, endTimeStr, availability.bookedRanges)) return false;
      return true;
    });
    setAvailableSlots(valid);
  }, [availability]);

  // Compute available periods
  const availablePeriods = ['AM', 'PM'].filter(p => {
    return availableSlots.some(slot => {
      const h = parseInt(slot.substring(0,2));
      return p === 'AM' ? (h < 12) : (h >= 12);
    });
  });

  const currentPeriod = availablePeriods.includes(period) ? period : (availablePeriods[0] || 'AM');
  
  if (currentPeriod !== period && availablePeriods.length > 0) {
    setPeriod(currentPeriod);
  }

  // Compute available hours for current period
  const availableHours = Array.from(new Set(availableSlots.filter(slot => {
    const h = parseInt(slot.substring(0,2));
    return currentPeriod === 'AM' ? (h < 12) : (h >= 12);
  }).map(slot => {
    let h = parseInt(slot.substring(0,2));
    if (h === 0) h = 12;
    if (h > 12) h -= 12;
    return h.toString().padStart(2, '0');
  }))).sort((a,b) => parseInt(a) - parseInt(b));

  const currentHour = availableHours.includes(hour) ? hour : (availableHours[0] || '09');
  
  if (currentHour !== hour && availableHours.length > 0) {
    setHour(currentHour);
  }

  // Compute available minutes for current hour + period
  const availableMinutes = Array.from(new Set(availableSlots.filter(slot => {
    const h24 = parseInt(slot.substring(0,2));
    const h12 = h24 === 0 ? 12 : (h24 > 12 ? h24 - 12 : h24);
    const p = h24 < 12 ? 'AM' : 'PM';
    return h12.toString().padStart(2, '0') === currentHour && p === currentPeriod;
  }).map(slot => slot.substring(3,5)))).sort();

  const currentMinute = availableMinutes.includes(minute) ? minute : (availableMinutes[0] || '00');
  
  if (currentMinute !== minute && availableMinutes.length > 0) {
    setMinute(currentMinute);
  }

  // Update parent value
  useEffect(() => {
    if (availableSlots.length > 0) {
      let h24 = parseInt(currentHour);
      if (currentPeriod === 'PM' && h24 !== 12) h24 += 12;
      if (currentPeriod === 'AM' && h24 === 12) h24 = 0;
      const newVal = `${h24.toString().padStart(2, '0')}:${currentMinute}`;
      if (newVal !== value) {
        onChange(newVal);
      }
    } else {
      if (value !== '') onChange('');
    }
  }, [currentHour, currentMinute, currentPeriod, availableSlots]);

  if (disabled || availableSlots.length === 0) {
    return (
      <div className="h-[120px] bg-obsidian-900/50 rounded-xl border border-obsidian-700/50 flex flex-col items-center justify-center text-obsidian-500">
        <span className="text-sm">No times available</span>
      </div>
    );
  }

  return (
    <div className="flex bg-obsidian-900 rounded-xl border border-obsidian-700 overflow-hidden shadow-inner w-full max-w-sm mx-auto">
      <Wheel 
        options={availableHours.map(h => ({ label: h, value: h }))}
        value={currentHour}
        onChange={setHour}
      />
      <div className="flex items-center text-obsidian-500 text-lg font-bold pb-1">:</div>
      <Wheel 
        options={availableMinutes.map(m => ({ label: m, value: m }))}
        value={currentMinute}
        onChange={setMinute}
      />
      <div className="flex items-center text-obsidian-700 w-px h-full bg-obsidian-700 mx-2" />
      <Wheel 
        options={availablePeriods.map(p => ({ label: p, value: p }))}
        value={currentPeriod}
        onChange={setPeriod}
      />
      
      <style dangerouslySetInnerHTML={{__html: `
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}} />
    </div>
  );
}
