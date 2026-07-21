import { useState, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';

interface DatePickerProps {
  value: string;
  onChange: (date: string) => void;
  minDate?: string;
  disabledDays?: (date: Date) => boolean;
}

export default function DatePicker({ value, onChange, minDate, disabledDays }: DatePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const [currentMonth, setCurrentMonth] = useState(() => {
    if (value) {
      const [y, m, d] = value.split('-').map(Number);
      return new Date(y, m - 1, d);
    }
    return new Date();
  });

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const daysInMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1).getDay();

  const prevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  const isDateDisabled = (year: number, month: number, day: number) => {
    const date = new Date(year, month, day);
    date.setHours(0, 0, 0, 0);
    
    if (minDate) {
      const [y, m, d] = minDate.split('-').map(Number);
      const min = new Date(y, m - 1, d);
      min.setHours(0, 0, 0, 0);
      if (date < min) return true;
    }
    
    if (disabledDays && disabledDays(date)) return true;
    
    return false;
  };

  const getDateString = (year: number, month: number, day: number) => {
    const d = new Date(year, month, day);
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  };

  const handleSelect = (day: number) => {
    if (isDateDisabled(currentMonth.getFullYear(), currentMonth.getMonth(), day)) return;
    onChange(getDateString(currentMonth.getFullYear(), currentMonth.getMonth(), day));
    setIsOpen(false);
  };

  const days = [];
  for (let i = 0; i < firstDayOfMonth; i++) {
    days.push(<div key={`empty-${i}`} className="w-8 h-8" />);
  }
  
  for (let day = 1; day <= daysInMonth; day++) {
    const disabled = isDateDisabled(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    const dateStr = getDateString(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    const isSelected = value === dateStr;
    
    days.push(
      <button
        key={day}
        type="button"
        disabled={disabled}
        onClick={() => handleSelect(day)}
        className={`w-8 h-8 rounded-full flex items-center justify-center text-sm transition-colors
          ${disabled ? 'text-obsidian-600 cursor-not-allowed opacity-50' : 
            isSelected ? 'bg-gold-500 text-obsidian-950 font-bold' : 'text-obsidian-100 hover:bg-obsidian-700'
          }`}
      >
        {day}
      </button>
    );
  }

  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  // To display the selected value in a nice format, e.g. "2024-10-15"
  const displayValue = value ? value : '';

  return (
    <div className="relative" ref={containerRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="input-dark w-full text-left flex items-center justify-between"
      >
        <span className={displayValue ? 'text-obsidian-100' : 'text-obsidian-400'}>
          {displayValue || 'Select a date...'}
        </span>
        <CalendarIcon className="w-4 h-4 text-obsidian-400" />
      </button>
      
      {isOpen && (
        <div className="absolute top-full mt-2 left-0 z-50 bg-obsidian-900 border border-obsidian-700 p-4 rounded-xl shadow-xl w-[280px]">
          <div className="flex items-center justify-between mb-4">
            <button type="button" onClick={prevMonth} className="p-1 hover:bg-obsidian-800 rounded-lg text-obsidian-300 transition-colors">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <span className="font-semibold text-obsidian-100 text-sm">
              {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
            </span>
            <button type="button" onClick={nextMonth} className="p-1 hover:bg-obsidian-800 rounded-lg text-obsidian-300 transition-colors">
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
          
          <div className="grid grid-cols-7 gap-1 mb-2 text-center text-[10px] uppercase font-bold text-obsidian-500 tracking-wider">
            <div>Su</div><div>Mo</div><div>Tu</div><div>We</div><div>Th</div><div>Fr</div><div>Sa</div>
          </div>
          
          <div className="grid grid-cols-7 gap-1 place-items-center">
            {days}
          </div>
        </div>
      )}
    </div>
  );
}
