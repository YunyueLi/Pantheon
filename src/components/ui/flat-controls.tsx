"use client";

import { useEffect, useId, useRef, useState, type KeyboardEvent } from "react";

export type FlatOption = { value: string; label: string };

/** Flat serif toggle — a hairline-joined row of options, the live one underscored.
 *  Styled by `.ftog*` in globals.css. */
export function FlatToggle({
  options,
  value,
  onChange,
}: {
  options: FlatOption[];
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="ftog">
      {options.map((o) => (
        <button key={o.value} type="button" onClick={() => onChange(o.value)} data-on={o.value === value} className="ftog-b label">
          {o.label}
        </button>
      ))}
    </div>
  );
}

/** Flat serif dropdown — a fully self-drawn listbox (no native OS popup) so the menu
 *  matches the monument aesthetic. Closes on outside-click / Escape, with arrow-key +
 *  Home/End navigation and ARIA listbox semantics. Styled by `.fsel*` in globals.css. */
export function FlatSelect({
  value,
  onChange,
  options,
  label,
}: {
  value: string;
  onChange: (v: string) => void;
  options: FlatOption[];
  label: string;
}) {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const rootRef = useRef<HTMLDivElement>(null);
  const uid = useId();
  const current = options.find((o) => o.value === value) ?? options[0];

  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [open]);

  const openMenu = () => {
    setActive(Math.max(0, options.findIndex((o) => o.value === value)));
    setOpen(true);
  };
  const choose = (v: string) => {
    onChange(v);
    setOpen(false);
  };
  const onKeyDown = (e: KeyboardEvent) => {
    if (!open) {
      if (e.key === "ArrowDown" || e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        openMenu();
      }
      return;
    }
    if (e.key === "Escape") setOpen(false);
    else if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((a) => Math.min(options.length - 1, a + 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((a) => Math.max(0, a - 1));
    } else if (e.key === "Home") {
      e.preventDefault();
      setActive(0);
    } else if (e.key === "End") {
      e.preventDefault();
      setActive(options.length - 1);
    } else if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      if (options[active]) choose(options[active].value);
    }
  };

  return (
    <div className="fsel" ref={rootRef}>
      <span className="fsel-cap label" id={`${uid}-lab`}>
        {label}
      </span>
      <button
        type="button"
        className="fsel-btn label"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-labelledby={`${uid}-lab`}
        onClick={() => (open ? setOpen(false) : openMenu())}
        onKeyDown={onKeyDown}
      >
        <span className="fsel-val">{current?.label}</span>
        <span aria-hidden className="fsel-caret">
          ▾
        </span>
      </button>
      {open && (
        <ul className="fsel-menu" role="listbox" aria-labelledby={`${uid}-lab`}>
          {options.map((o, i) => (
            <li
              key={o.value}
              id={`${uid}-opt-${i}`}
              role="option"
              aria-selected={o.value === value}
              data-active={i === active}
              className="fsel-opt label"
              onMouseEnter={() => setActive(i)}
              onClick={() => choose(o.value)}
            >
              {o.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
