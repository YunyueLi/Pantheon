import { notFound } from "next/navigation";
import { FRANCHISES, getFranchise } from "@/lib/sport/basketball/franchises";
import { BasketballFranchiseProfile } from "@/components/basketball-franchises";

export function generateStaticParams() {
  return FRANCHISES.map((f) => ({ id: f.id }));
}

export default function FranchisePage({ params }: { params: { id: string } }) {
  if (!getFranchise(params.id)) notFound();
  return <BasketballFranchiseProfile id={params.id} />;
}
