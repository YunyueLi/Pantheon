import { getPlayer } from "@/lib/data";
import { CompareView } from "@/components/compare-view";

function resolve(id: string | undefined, fallback: string) {
  return id && getPlayer(id) ? id : fallback;
}

export default function ComparePage({ searchParams }: { searchParams: { a?: string; b?: string } }) {
  const a = resolve(searchParams.a, "faker");
  const b = resolve(searchParams.b, "chovy");

  return (
    <div className="mx-auto max-w-4xl px-5 py-10">
      <CompareView initialA={a} initialB={b} />
    </div>
  );
}
