import { ShowWard } from "@/components/dashboard/show-ward";
import { ContentLayout } from "@/components/admin-panel/content-layout";

export default function WardPage({ params }: { params: { id: string } }) {
  const wardNumber = parseInt(params.id);

  return (
    <ContentLayout title="Ward">
      <ShowWard wardNumber={wardNumber} />
    </ContentLayout>
  );
}
