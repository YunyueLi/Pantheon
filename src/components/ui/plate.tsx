/**
 * Section plate — the recurring "monument" section header: a roman/arabic index,
 * a serif title, and an optional note, sitting over a hairline rule. Styled by the
 * global `.plate` primitives in globals.css so every redesigned page matches.
 */
export function Plate({ n, title, note }: { n: string; title: string; note?: string }) {
  return (
    <div className="plate">
      <span className="plate-n">{n}</span>
      <h2 className="plate-t">{title}</h2>
      {note && <span className="plate-note">{note}</span>}
    </div>
  );
}
