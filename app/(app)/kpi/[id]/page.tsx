import { notFound } from "next/navigation";
import { KpiDetail } from "@/components/kpi/kpi-detail";
import { kpiById, kpis } from "@/lib/data";

export function generateStaticParams() {
  return kpis.map((kpi) => ({ id: kpi.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const kpi = kpiById(id);
  return { title: kpi ? kpi.name : "Detail KPI" };
}

export default async function KpiDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const kpi = kpiById(id);
  if (!kpi) notFound();

  return <KpiDetail kpi={kpi} />;
}
