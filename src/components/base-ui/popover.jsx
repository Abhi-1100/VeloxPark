import React, { createContext, useContext, useState, useRef, useEffect } from 'react';

const PopoverContext = createContext(null);

export function Popover({ children, open: controlledOpen, onOpenChange }) {
  const [uncontrolledOpen, setUncontrolledOpen] = useState(false);
  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : uncontrolledOpen;
  const triggerRef = useRef(null);
  const contentRef = useRef(null);

  const setOpen = (nextVal) => {
    if (typeof nextVal === 'function') {
      nextVal = nextVal(open);
    }
    if (onOpenChange) {
      onOpenChange(nextVal);
    }
    if (!isControlled) {
      setUncontrolledOpen(nextVal);
    }
  };

  useEffect(() => {
    if (!open) return;

    function handleClickOutside(event) {
      if (
        triggerRef.current &&
        !triggerRef.current.contains(event.target) &&
        contentRef.current &&
        !contentRef.current.contains(event.target)
      ) {
        setOpen(false);
      }
    }

    function handleKeyDown(event) {
      if (event.key === 'Escape') {
        setOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [open]);

  return (
    <PopoverContext.Provider value={{ open, setOpen, triggerRef, contentRef }}>
      <div className="relative inline-block w-full">{children}</div>
    </PopoverContext.Provider>
  );
}

export function PopoverTrigger({ children, asChild }) {
  const { open, setOpen, triggerRef } = useContext(PopoverContext);

  const handleClick = (e) => {
    if (children?.props?.onClick) {
      children.props.onClick(e);
    }
    setOpen(!open);
  };

  if (React.isValidElement(children)) {
    return React.cloneElement(children, {
      ref: triggerRef,
      onClick: handleClick,
      'aria-haspopup': 'dialog',
      'aria-expanded': open,
    });
  }

  return (
    <div ref={triggerRef} onClick={handleClick} className="w-full">
      {children}
    </div>
  );
}

export function PopoverContent({
  children,
  className = '',
  align = 'start',
  ...props
}) {
  const { open, contentRef } = useContext(PopoverContext);

  if (!open) return null;

  let alignClass = 'left-0';
  if (align === 'end') alignClass = 'right-0';
  if (align === 'center') alignClass = 'left-1/2 -translate-x-1/2';

  return (
    <div
      ref={contentRef}
      role="dialog"
      className={`absolute top-full mt-2 z-50 min-w-[280px] bg-surface text-paper border border-border/80 rounded-2xl shadow-2xl backdrop-blur-xl animate-in fade-in-0 zoom-in-95 duration-150 ${alignClass} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

export default Popover;
