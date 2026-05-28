import { notFound } from "next/navigation";
import { DomainDashboard } from "@/components/dashboard/domain-dashboard";
import { domainBySlug, domains } from "@/lib/data";

export function generateStaticParams() {
  return domains.map((domain) => ({ domain: domain.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ domain: string }> }) {
  const { domain } = await params;
  const data = domainBySlug(domain);
  return { title: data ? `Dashboard ${data.name}` : "Dashboard domain" };
}

export default async function DomainDashboardPage({ params }: { params: Promise<{ domain: string }> }) {
  const { domain: slug } = await params;
  const domain = domainBySlug(slug);
  if (!domain) notFound();

  return <DomainDashboard domain={domain} />;
}
