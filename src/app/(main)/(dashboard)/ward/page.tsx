import { ContentLayout } from "@/components/admin-panel/content-layout";
import { WardsList } from "@/components/dashboard/wards-list";

export default function WardPage() {
  return (
    <ContentLayout title="Wards">
      <WardsList />
    </ContentLayout>
  );
}
