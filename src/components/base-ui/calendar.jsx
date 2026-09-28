import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const WEEKDAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

export function Calendar({
  mode = 'single',
  selected,
  onSelect,
  className = '',
  theme = 'light',
  minDate,
}) {
  const [currentMonth, setCurrentMonth] = useState(() => {
    return selected instanceof Date && !isNaN(selected) ? new Date(selected) : new Date();
  });

  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();

  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysInPrevMonth = new Date(year, month, 0).getDate();

  const handlePrevMonth = (e) => {
    e.stopPropagation();
    setCurrentMonth(new Date(year, month - 1, 1));
  };

  const handleNextMonth = (e) => {
    e.stopPropagation();
    setCurrentMonth(new Date(year, month + 1, 1));
  };

  const isSameDay = (d1, d2) => {
    if (!d1 || !d2) return false;
    return (
      d1.getFullYear() === d2.getFullYear() &&
      d1.getMonth() === d2.getMonth() &&
      d1.getDate() === d2.getDate()
    );
  };

  const today = new Date();

  const handleSelectDay = (dayDate) => {
    if (onSelect) {
      onSelect(dayDate);
    }
  };

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  // Build calendar matrix
  const calendarCells = [];

  // Previous month padding days
  for (let i = firstDayOfMonth - 1; i >= 0; i--) {
    const prevDate = new Date(year, month - 1, daysInPrevMonth - i);
    calendarCells.push({
      date: prevDate,
      dayNum: daysInPrevMonth - i,
      isCurrentMonth: false,
    });
  }

  // Current month days
  for (let d = 1; d <= daysInMonth; d++) {
    const thisDate = new Date(year, month, d);
    calendarCells.push({
      date: thisDate,
      dayNum: d,
      isCurrentMonth: true,
    });
  }

  // Next month padding days to complete grid (42 cells total for consistent 6 rows)
  const remainingCells = 42 - calendarCells.length;
  for (let n = 1; n <= remainingCells; n++) {
    const nextDate = new Date(year, month + 1, n);
    calendarCells.push({
      date: nextDate,
      dayNum: n,
      isCurrentMonth: false,
    });
  }

  const isDark = theme === 'dark';

  return (
    <div
      className={`p-4 select-none ${
        isDark ? 'bg-surface text-paper' : 'bg-white text-gray-900'
      } ${className}`}
    >
      {/* Month/Year Header */}
      <div
        className={`flex items-center justify-between pb-3 mb-2 border-b ${
          isDark ? 'border-border/50' : 'border-gray-100'
        }`}
      >
        <button
          type="button"
          onClick={handlePrevMonth}
          className={`size-8 inline-flex items-center justify-center rounded-lg border transition-all ${
            isDark
              ? 'border-border/40 text-paper/70 hover:text-primary hover:border-primary/50 hover:bg-surface-raised'
              : 'border-gray-200 text-gray-600 hover:text-black hover:border-gold hover:bg-amber-50/50'
          }`}
          aria-label="Previous month"
        >
          <ChevronLeft className="size-4" />
        </button>
        <span className={`text-sm font-bold tracking-wide ${isDark ? 'text-paper' : 'text-gray-900'}`}>
          {monthNames[month]} <span className="text-primary font-mono">{year}</span>
        </span>
        <button
          type="button"
          onClick={handleNextMonth}
          className={`size-8 inline-flex items-center justify-center rounded-lg border transition-all ${
            isDark
              ? 'border-border/40 text-paper/70 hover:text-primary hover:border-primary/50 hover:bg-surface-raised'
              : 'border-gray-200 text-gray-600 hover:text-black hover:border-gold hover:bg-amber-50/50'
          }`}
          aria-label="Next month"
        >
          <ChevronRight className="size-4" />
        </button>
      </div>

      {/* Weekday Labels */}
      <div className="grid grid-cols-7 gap-1 text-center mb-1">
        {WEEKDAYS.map((wd) => (
          <div
            key={wd}
            className={`text-[11px] font-bold uppercase tracking-wider py-1 ${
              isDark ? 'text-muted' : 'text-gray-400'
            }`}
          >
            {wd}
          </div>
        ))}
      </div>

      {/* Day Cells Grid */}
      <div className="grid grid-cols-7 gap-1">
        {calendarCells.map((cell, idx) => {
          const isSelected = selected && isSameDay(cell.date, selected);
          const isToday = isSameDay(cell.date, today);

          let cellStyle = '';

          if (isSelected) {
            cellStyle = 'bg-primary text-ink font-extrabold shadow-md shadow-primary/30 ring-1 ring-primary';
          } else if (!cell.isCurrentMonth) {
            cellStyle = isDark
              ? 'text-muted/30 hover:text-muted/70 hover:bg-surface-raised/40'
              : 'text-gray-300 hover:text-gray-500 hover:bg-gray-50';
          } else if (isToday) {
            cellStyle = isDark
              ? 'text-primary font-bold ring-1 ring-primary/40 hover:bg-primary/20'
              : 'text-amber-700 font-bold ring-1 ring-primary/60 hover:bg-amber-50';
          } else {
            cellStyle = isDark
              ? 'text-paper hover:bg-surface-raised hover:text-primary'
              : 'text-gray-700 hover:bg-amber-50 hover:text-gray-900';
          }

          return (
            <button
              key={idx}
              type="button"
              onClick={() => handleSelectDay(cell.date)}
              className={`size-8 text-xs rounded-xl flex items-center justify-center transition-all ${cellStyle}`}
            >
              {cell.dayNum}
            </button>
          );
        })}
      </div>

      {/* Quick Today jump action */}
      <div
        className={`mt-3 pt-2.5 border-t flex items-center justify-between text-xs ${
          isDark ? 'border-border/40' : 'border-gray-100'
        }`}
      >
        <button
          type="button"
          onClick={() => {
            const now = new Date();
            setCurrentMonth(new Date(now.getFullYear(), now.getMonth(), 1));
            handleSelectDay(now);
          }}
          className="text-primary hover:underline font-semibold tracking-wide"
        >
          Today
        </button>
        {selected && (
          <button
            type="button"
            onClick={() => handleSelectDay(undefined)}
            className={`font-medium ${isDark ? 'text-muted hover:text-paper' : 'text-gray-500 hover:text-gray-900'}`}
          >
            Clear
          </button>
        )}
      </div>
    </div>
  );
}

export default Calendar;
