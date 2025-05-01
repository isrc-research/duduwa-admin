"use client";

import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { ContentLayout } from "@/components/admin-panel/content-layout";
import { AreaEdit } from "@/components/dashboard/area-edit";
import { MapStateProvider } from "@/lib/map-state";

export default function UpdateAreaPage({ params }: { params: { id: string } }) {
  const router = useRouter();

  return (
    <ContentLayout
      title="Update Area"
      subtitle="Update area geometry and view details"
      actions={
        <Button variant="outline" onClick={() => router.push("/area")}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Areas
        </Button>
      }
    >
      <MapStateProvider>
        <AreaEdit id={params.id} />
      </MapStateProvider>
    </ContentLayout>
  );
}
