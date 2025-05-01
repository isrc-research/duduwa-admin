"use client";
import { Suspense } from "react";
import { ContentLayout } from "@/components/admin-panel/content-layout";
import dynamic from "next/dynamic";

// Create a client-side only wrapper component
const ClientAreaNavigation = dynamic(
  () =>
    import("@/components/area/area-navigation").then((mod) => ({
      default: () => <mod.AreaNavigation />,
    })),
  { ssr: false },
);

const Loading = () => (
  <div className="container mx-auto p-8">
    <div className="animate-pulse space-y-4">
      <div className="h-8 w-1/3 bg-gray-200 rounded"></div>
      <div className="h-32 bg-gray-200 rounded"></div>
    </div>
  </div>
);

const AreaPage = () => {
  return (
    <ContentLayout title="Area Management">
      <div className="container mx-auto space-y-8 px-4 lg:px-8">
        <Suspense fallback={<Loading />}>
          <ClientAreaNavigation />
        </Suspense>
      </div>
    </ContentLayout>
  );
};

export default AreaPage;
