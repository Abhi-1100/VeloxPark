import React, { useState } from 'react';
import { ChevronDownIcon, Clock, Calendar as CalendarIcon } from 'lucide-react';

import { Calendar } from '@/components/base-ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/base-ui/popover';

const initialTimeFrom = '10:00:00';
const initialTimeTo = '14:00:00';

export const DatePicker11 = ({
  date: controlledDate,
  onDateChange,
  timeFrom: controlledTimeFrom,
  onTimeFromChange,
  timeTo: controlledTimeTo,
  onTimeToChange,
  theme = 'light',
  className = '',
}) => {
  const [open, setOpen] = useState(false);
  const [internalDate, setInternalDate] = useState(() => new Date());
  const [internalTimeFrom, setInternalTimeFrom] = useState(initialTimeFrom);
  const [internalTimeTo, setInternalTimeTo] = useState(initialTimeTo);

  const isDateControlled = controlledDate !== undefined;
  const isTimeFromControlled = controlledTimeFrom !== undefined;
  const isTimeToControlled = controlledTimeTo !== undefined;

  const date = isDateControlled ? controlledDate : internalDate;
  const timeFrom = isTimeFromControlled ? controlledTimeFrom : internalTimeFrom;
  const timeTo = isTimeToControlled ? controlledTimeTo : internalTimeTo;

  const handleDateSelect = (newDate) => {
    if (!isDateControlled) {
      setInternalDate(newDate);
    }
    if (onDateChange) {
      onDateChange(newDate);
    }
    setOpen(false);
  };

  const handleTimeFromChange = (e) => {
    const val = e.target.value;
    if (!isTimeFromControlled) {
      setInternalTimeFrom(val);
    }
    if (onTimeFromChange) {
      onTimeFromChange(val);
    }
  };

  const handleTimeToChange = (e) => {
    const val = e.target.value;
    if (!isTimeToControlled) {
      setInternalTimeTo(val);
    }
    if (onTimeToChange) {
      onTimeToChange(val);
    }
  };

  const openTimePicker = (id) => {
    const input = document.getElementById(id);
    if (input && typeof input.showPicker === 'function') {
      try {
        input.showPicker();
      } catch {
        // browser may disallow showPicker without direct user gesture
      }
    }
  };

  const isDark = theme === 'dark';

  const formatDateDisplay = (d) => {
    if (!d) return 'Pick a date';
    const dateObj = d instanceof Date ? d : new Date(d);
    if (isNaN(dateObj)) return String(d);

    const today = new Date();
    const isToday =
      dateObj.getFullYear() === today.getFullYear() &&
      dateObj.getMonth() === today.getMonth() &&
      dateObj.getDate() === today.getDate();

    const formatted = dateObj.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });

    return isToday ? `Today, ${dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}` : formatted;
  };

  // Light theme tokens
  const containerClass = isDark
    ? 'bg-surface border-line text-paper'
    : 'bg-white border-[#eee] text-[#111]';

  const hoverBorderClass = isDark
    ? 'hover:border-primary focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20'
    : 'hover:border-[#F2C230] focus-within:border-[#F2C230] focus-within:ring-2 focus-within:ring-[#F2C230]/20';

  const labelClass = isDark
    ? 'text-[11px] font-bold uppercase tracking-wider text-muted'
    : 'text-[11px] font-bold uppercase tracking-wider text-[#888]';

  return (
    <div className={`flex flex-col gap-3.5 w-full font-sans ${className}`}>
      {/* Date Picker Card (Full Width to match Destination box) */}
      <div className="w-full">
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger>
            <div
              role="button"
              tabIndex={0}
              className={`w-full flex flex-col justify-center rounded-2xl border-[1.5px] p-3.5 transition-all cursor-pointer shadow-xs ${containerClass} ${hoverBorderClass}`}
            >
              <span className={`${labelClass} mb-1.5`}>Date</span>
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-2.5">
                  <div className="text-primary flex items-center justify-center">
                    <CalendarIcon className="size-4 text-[#F2C230]" />
                  </div>
                  <span className="font-bold text-[15px] leading-tight">
                    {formatDateDisplay(date)}
                  </span>
                </div>
                <ChevronDownIcon
                  className={`size-4 text-[#F2C230] transition-transform duration-200 ${
                    open ? 'rotate-180' : ''
                  }`}
                />
              </div>
            </div>
          </PopoverTrigger>
          <PopoverContent
            className={`w-auto p-0 rounded-2xl shadow-2xl border overflow-hidden ${
              isDark ? 'bg-surface border-border/80 text-paper' : 'bg-white border-gray-200 text-gray-900'
            }`}
            align="start"
          >
            <Calendar
              mode="single"
              selected={date}
              onSelect={handleDateSelect}
              theme={theme}
            />
          </PopoverContent>
        </Popover>
      </div>

      {/* From and To Times (2 Equal Columns with matching card style) */}
      <div className="grid grid-cols-2 gap-3.5 w-full">
        {/* From Time Card */}
        <div
          className={`flex flex-col rounded-2xl border-[1.5px] p-3.5 transition-all shadow-xs cursor-pointer ${containerClass} ${hoverBorderClass}`}
          onClick={() => openTimePicker('sl-time-from')}
        >
          <label htmlFor="sl-time-from" className={`${labelClass} mb-1.5 cursor-pointer`}>
            From
          </label>
          <div className="relative flex items-center justify-between w-full">
            <input
              type="time"
              id="sl-time-from"
              step={1}
              value={timeFrom}
              onChange={handleTimeFromChange}
              className={`w-full bg-transparent font-bold text-[15px] leading-tight outline-none border-none p-0 cursor-pointer ${
                isDark ? '[color-scheme:dark] text-paper' : '[color-scheme:light] text-[#111]'
              } [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none`}
            />
            <div className="text-[#F2C230] pl-2 flex items-center pointer-events-none">
              <Clock className="size-4 text-[#F2C230]" />
            </div>
          </div>
        </div>

        {/* To Time Card */}
        <div
          className={`flex flex-col rounded-2xl border-[1.5px] p-3.5 transition-all shadow-xs cursor-pointer ${containerClass} ${hoverBorderClass}`}
          onClick={() => openTimePicker('sl-time-to')}
        >
          <label htmlFor="sl-time-to" className={`${labelClass} mb-1.5 cursor-pointer`}>
            To
          </label>
          <div className="relative flex items-center justify-between w-full">
            <input
              type="time"
              id="sl-time-to"
              step={1}
              value={timeTo}
              onChange={handleTimeToChange}
              className={`w-full bg-transparent font-bold text-[15px] leading-tight outline-none border-none p-0 cursor-pointer ${
                isDark ? '[color-scheme:dark] text-paper' : '[color-scheme:light] text-[#111]'
              } [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none`}
            />
            <div className="text-[#F2C230] pl-2 flex items-center pointer-events-none">
              <Clock className="size-4 text-[#F2C230]" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DatePicker11;
