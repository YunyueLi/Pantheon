import { Methodology } from "@/components/methodology";
import { SportProvider } from "@/lib/sport/provider";

export default function MethodologyPage() {
  return (
    <SportProvider sportId="dota2">
      <Methodology />
    </SportProvider>
  );
}
