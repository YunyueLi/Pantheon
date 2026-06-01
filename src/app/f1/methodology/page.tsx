import { Methodology } from "@/components/methodology";
import { SportProvider } from "@/lib/sport/provider";

export default function MethodologyPage() {
  return (
    <SportProvider sportId="f1">
      <Methodology />
    </SportProvider>
  );
}
