import { PageHeader } from "@/components/ui-kit/page-header";
import { Tag } from "@/components/ui-kit/pill";
import { AskData } from "@/components/ask/ask-data";

export const metadata = { title: "Tanya Data" };

export default function AskDataPage() {
  return (
    <div className="space-y-4 sm:space-y-5">
      <PageHeader
        eyebrow="Insight AI"
        title="Tanya Data"
        subtitle="Ajukan pertanyaan dengan bahasa natural dan dapatkan angka, grafik, serta dasar jawaban — tanpa menunggu analis."
        actions={
          <>
            <Tag tone="mint">Akurasi benchmark 92%</Tag>
            <Tag tone="neutral">Bahasa Indonesia & Inggris</Tag>
          </>
        }
      />
      <AskData />
    </div>
  );
}
