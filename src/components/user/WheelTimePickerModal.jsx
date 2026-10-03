import React, { useState, useEffect, useRef } from 'react';
import './WheelTimePickerModal.css';

/**
 * WheelTimePickerModal
 * Matches the iOS / modern drum roller time picker bottom sheet reference design.
 */
export default function WheelTimePickerModal({
  isOpen,
  onClose,
  initialTime = '08:30',
  onConfirm,
  type = 'entry', // 'entry' | 'exit'
  heading,
  pairedTime, // e.g. entryTime if this is exit picker
}) {
  // Parse initial 24h time into 12h, min, and AM/PM
  const parseTime = (timeStr) => {
    if (!timeStr) return { hour12: 8, minute: 30, period: 'AM' };
    const [hStr, mStr] = timeStr.split(':');
    let h = parseInt(hStr, 10);
    const m = parseInt(mStr, 10) || 0;
    if (isNaN(h)) h = 8;
    const period = h >= 12 ? 'PM' : 'AM';
    const hour12 = h % 12 || 12;
    return { hour12, minute: m, period };
  };

  const [hour, setHour] = useState(8);
  const [minute, setMinute] = useState(30);
  const [period, setPeriod] = useState('AM');
  const [activeChip, setActiveChip] = useState(null);

  const drumContainerRef = useRef(null);
  const hourColRef = useRef(null);
  const minColRef = useRef(null);

  // Sync state when modal opens
  useEffect(() => {
    if (isOpen) {
      const parsed = parseTime(initialTime);
      setHour(parsed.hour12);
      setMinute(parsed.minute);
      setPeriod(parsed.period);
      setActiveChip(null);
    }
  }, [isOpen, initialTime]);

  // Complete background scroll lock while time picker modal is open
  useEffect(() => {
    if (!isOpen) return;

    const scrollY = window.scrollY || window.pageYOffset || 0;
    const prevBodyOverflow = document.body.style.overflow;
    const prevBodyPosition = document.body.style.position;
    const prevBodyTop = document.body.style.top;
    const prevBodyWidth = document.body.style.width;
    const prevTouchAction = document.body.style.touchAction;
    const prevHtmlOverflow = document.documentElement.style.overflow;

    // Freeze both body and html scroll
    document.body.style.overflow = 'hidden';
    document.body.style.position = 'fixed';
    document.body.style.top = `-${scrollY}px`;
    document.body.style.width = '100%';
    document.body.style.touchAction = 'none';
    document.documentElement.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = prevBodyOverflow;
      document.body.style.position = prevBodyPosition;
      document.body.style.top = prevBodyTop;
      document.body.style.width = prevBodyWidth;
      document.body.style.touchAction = prevTouchAction;
      document.documentElement.style.overflow = prevHtmlOverflow;
      window.scrollTo(0, scrollY);
    };
  }, [isOpen]);

  // Non-passive wheel and touch listeners to prevent background scroll chaining
  useEffect(() => {
    if (!isOpen) return;

    const drum = drumContainerRef.current;
    const hourCol = hourColRef.current;
    const minCol = minColRef.current;

    const preventDefaultScroll = (e) => {
      e.preventDefault();
      e.stopPropagation();
    };

    const handleHourWheelNative = (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (e.deltaY > 0) {
        setHour((prev) => (prev === 12 ? 1 : prev + 1));
      } else {
        setHour((prev) => (prev === 1 ? 12 : prev - 1));
      }
      setActiveChip(null);
    };

    const handleMinWheelNative = (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (e.deltaY > 0) {
        setMinute((prev) => (prev === 59 ? 0 : prev + 1));
      } else {
        setMinute((prev) => (prev === 0 ? 59 : prev - 1));
      }
      setActiveChip(null);
    };

    if (drum) {
      drum.addEventListener('wheel', preventDefaultScroll, { passive: false });
      drum.addEventListener('touchmove', preventDefaultScroll, { passive: false });
    }
    if (hourCol) {
      hourCol.addEventListener('wheel', handleHourWheelNative, { passive: false });
    }
    if (minCol) {
      minCol.addEventListener('wheel', handleMinWheelNative, { passive: false });
    }

    return () => {
      if (drum) {
        drum.removeEventListener('wheel', preventDefaultScroll);
        drum.removeEventListener('touchmove', preventDefaultScroll);
      }
      if (hourCol) {
        hourCol.removeEventListener('wheel', handleHourWheelNative);
      }
      if (minCol) {
        minCol.removeEventListener('wheel', handleMinWheelNative);
      }
    };
  }, [isOpen]);

  const prevHour = hour === 1 ? 12 : hour - 1;
  const nextHour = hour === 12 ? 1 : hour + 1;

  const prevMinute = minute === 0 ? 59 : minute - 1;
  const nextMinute = minute === 59 ? 0 : minute + 1;

  // Touch drag support for mobile
  const hourTouchStartY = useRef(null);
  const minuteTouchStartY = useRef(null);

  const handleHourTouchStart = (e) => {
    hourTouchStartY.current = e.touches[0].clientY;
  };
  const handleHourTouchMove = (e) => {
    if (hourTouchStartY.current === null) return;
    const diff = hourTouchStartY.current - e.touches[0].clientY;
    if (Math.abs(diff) > 28) {
      if (diff > 0) {
        setHour((prev) => (prev === 12 ? 1 : prev + 1));
      } else {
        setHour((prev) => (prev === 1 ? 12 : prev - 1));
      }
      hourTouchStartY.current = e.touches[0].clientY;
      setActiveChip(null);
    }
  };

  const handleMinuteTouchStart = (e) => {
    minuteTouchStartY.current = e.touches[0].clientY;
  };
  const handleMinuteTouchMove = (e) => {
    if (minuteTouchStartY.current === null) return;
    const diff = minuteTouchStartY.current - e.touches[0].clientY;
    if (Math.abs(diff) > 28) {
      if (diff > 0) {
        setMinute((prev) => (prev === 59 ? 0 : prev + 1));
      } else {
        setMinute((prev) => (prev === 0 ? 59 : prev - 1));
      }
      minuteTouchStartY.current = e.touches[0].clientY;
      setActiveChip(null);
    }
  };

  // Preset chips logic
  const handlePresetSelect = (presetId, offsetMinutes) => {
    setActiveChip(presetId);
    let baseDate = new Date();

    if (type === 'exit' && pairedTime) {
      const [phStr, pmStr] = pairedTime.split(':');
      baseDate.setHours(parseInt(phStr, 10) || 0, parseInt(pmStr, 10) || 0, 0, 0);
    }

    baseDate = new Date(baseDate.getTime() + offsetMinutes * 60 * 1000);
    let h24 = baseDate.getHours();
    let m = baseDate.getMinutes();

    // Round to 5 mins
    m = Math.round(m / 5) * 5;
    if (m >= 60) {
      h24 = (h24 + 1) % 24;
      m = 0;
    }

    const p = h24 >= 12 ? 'PM' : 'AM';
    const h12 = h24 % 12 || 12;

    setHour(h12);
    setMinute(m);
    setPeriod(p);
  };

  // Convert back to 24h string
  const handleDone = () => {
    let h24 = hour;
    if (period === 'AM') {
      h24 = hour === 12 ? 0 : hour;
    } else {
      h24 = hour === 12 ? 12 : hour + 12;
    }
    const finalTimeStr = `${String(h24).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
    if (onConfirm) {
      onConfirm(finalTimeStr);
    }
    onClose();
  };

  if (!isOpen) return null;

  const defaultHeading = type === 'entry' ? 'Entry Set Time' : 'Exit Set Time';
  const displayHeading = heading || defaultHeading;

  return (
    <div
      className="wheel-picker-overlay"
      onClick={onClose}
      onWheel={(e) => {
        e.preventDefault();
        e.stopPropagation();
      }}
      onTouchMove={(e) => {
        e.preventDefault();
        e.stopPropagation();
      }}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="wheel-picker-sheet"
        onClick={(e) => e.stopPropagation()}
        onWheel={(e) => e.stopPropagation()}
        onTouchMove={(e) => e.stopPropagation()}
      >
        {/* Top iOS pill drag handle */}
        <div className="wheel-picker-handle" />

        {/* Heading Row with Tag */}
        <div className="wheel-picker-header">
          <div className="wheel-picker-title-group">
            <span className={`wheel-picker-tag ${type === 'entry' ? 'entry' : 'exit'}`}>
              {type === 'entry' ? 'ENTRY TIME' : 'EXIT TIME'}
            </span>
            <h3 className="wheel-picker-heading">{displayHeading}</h3>
          </div>

          {/* AM / PM Segmented Control */}
          <div className="wheel-ampm-toggle">
            <button
              type="button"
              className={`wheel-ampm-btn ${period === 'AM' ? 'active' : ''}`}
              onClick={() => {
                setPeriod('AM');
                setActiveChip(null);
              }}
            >
              AM
            </button>
            <button
              type="button"
              className={`wheel-ampm-btn ${period === 'PM' ? 'active' : ''}`}
              onClick={() => {
                setPeriod('PM');
                setActiveChip(null);
              }}
            >
              PM
            </button>
          </div>
        </div>

        {/* Quick Presets Ribbon (Matching Reference Image) */}
        <div className="wheel-presets-row">
          {type === 'entry' ? (
            <>
              <button
                type="button"
                className={`wheel-preset-chip ${activeChip === 'now' ? 'active' : ''}`}
                onClick={() => handlePresetSelect('now', 0)}
              >
                Right Now
              </button>
              <button
                type="button"
                className={`wheel-preset-chip ${activeChip === '15min' ? 'active' : ''}`}
                onClick={() => handlePresetSelect('15min', 15)}
              >
                In 15 Mins
              </button>
              <button
                type="button"
                className={`wheel-preset-chip ${activeChip === '1hr' ? 'active' : ''}`}
                onClick={() => handlePresetSelect('1hr', 60)}
              >
                In an Hour
              </button>
              <button
                type="button"
                className={`wheel-preset-chip ${activeChip === '2hr' ? 'active' : ''}`}
                onClick={() => handlePresetSelect('2hr', 120)}
              >
                In Two Hours
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                className={`wheel-preset-chip ${activeChip === '1hr' ? 'active' : ''}`}
                onClick={() => handlePresetSelect('1hr', 60)}
              >
                In an Hour
              </button>
              <button
                type="button"
                className={`wheel-preset-chip ${activeChip === '2hr' ? 'active' : ''}`}
                onClick={() => handlePresetSelect('2hr', 120)}
              >
                In Two Hours
              </button>
              <button
                type="button"
                className={`wheel-preset-chip ${activeChip === '3hr' ? 'active' : ''}`}
                onClick={() => handlePresetSelect('3hr', 180)}
              >
                In 3 Hours
              </button>
              <button
                type="button"
                className={`wheel-preset-chip ${activeChip === '4hr' ? 'active' : ''}`}
                onClick={() => handlePresetSelect('4hr', 240)}
              >
                In 4 Hours
              </button>
            </>
          )}
        </div>

        {/* Drum Roller Time Picker Container (Reference Image) */}
        <div className="wheel-drum-container" ref={drumContainerRef}>
          {/* Left Ruler Graduation Ticks */}
          <div className="wheel-ruler left" aria-hidden="true">
            <span className="wheel-ruler-tick small" />
            <span className="wheel-ruler-tick small" />
            <span className="wheel-ruler-tick medium" />
            <span className="wheel-ruler-tick small" />
            <span className="wheel-ruler-tick small" />
            <span className="wheel-ruler-tick major" />
            <span className="wheel-ruler-tick small" />
            <span className="wheel-ruler-tick small" />
            <span className="wheel-ruler-tick medium" />
            <span className="wheel-ruler-tick small" />
            <span className="wheel-ruler-tick small" />
          </div>

          {/* Active Center Horizontal Guidelines */}
          <div className="wheel-center-guide top" />
          <div className="wheel-center-guide bottom" />

          {/* Wheel Columns */}
          <div className="wheel-drum-columns">
            {/* Hours Column */}
            <div
              className="wheel-column"
              ref={hourColRef}
              onTouchStart={handleHourTouchStart}
              onTouchMove={handleHourTouchMove}
            >
              <div
                className="wheel-cell faded"
                onClick={() => setHour(prevHour)}
                role="button"
                tabIndex={0}
              >
                {String(prevHour).padStart(2, '0')}
              </div>
              <div className="wheel-cell active">{String(hour).padStart(2, '0')}</div>
              <div
                className="wheel-cell faded"
                onClick={() => setHour(nextHour)}
                role="button"
                tabIndex={0}
              >
                {String(nextHour).padStart(2, '0')}
              </div>
            </div>

            {/* Colon Separator */}
            <div className="wheel-colon">:</div>

            {/* Minutes Column */}
            <div
              className="wheel-column"
              ref={minColRef}
              onTouchStart={handleMinuteTouchStart}
              onTouchMove={handleMinuteTouchMove}
            >
              <div
                className="wheel-cell faded"
                onClick={() => setMinute(prevMinute)}
                role="button"
                tabIndex={0}
              >
                {String(prevMinute).padStart(2, '0')}
              </div>
              <div className="wheel-cell active">{String(minute).padStart(2, '0')}</div>
              <div
                className="wheel-cell faded"
                onClick={() => setMinute(nextMinute)}
                role="button"
                tabIndex={0}
              >
                {String(nextMinute).padStart(2, '0')}
              </div>
            </div>
          </div>

          {/* Right Ruler Graduation Ticks */}
          <div className="wheel-ruler right" aria-hidden="true">
            <span className="wheel-ruler-tick small" />
            <span className="wheel-ruler-tick small" />
            <span className="wheel-ruler-tick medium" />
            <span className="wheel-ruler-tick small" />
            <span className="wheel-ruler-tick small" />
            <span className="wheel-ruler-tick major" />
            <span className="wheel-ruler-tick small" />
            <span className="wheel-ruler-tick small" />
            <span className="wheel-ruler-tick medium" />
            <span className="wheel-ruler-tick small" />
            <span className="wheel-ruler-tick small" />
          </div>
        </div>

        {/* Action Buttons (Cancel & Done) */}
        <div className="wheel-picker-actions">
          <button type="button" className="wheel-btn-cancel" onClick={onClose}>
            Cancel
          </button>
          <button type="button" className="wheel-btn-done" onClick={handleDone}>
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
