"use client";

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

/** Flat serif dropdown — a native <select> dressed as an underlined label, OS popup
 *  for the list. Styled by `.fsel*` in globals.css. */
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
  return (
    <label className="fsel">
      <span className="fsel-cap label">{label}</span>
      <span className="fsel-wrap">
        <select value={value} onChange={(e) => onChange(e.target.value)} aria-label={label} className="fsel-s label">
          {options.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
        <span aria-hidden className="fsel-caret">▾</span>
      </span>
    </label>
  );
}
