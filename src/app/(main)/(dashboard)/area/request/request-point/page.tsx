"use client";
import { Suspense } from "react";
import { ContentLayout } from "@/components/admin-panel/content-layout";
import { Button } from "@/components/ui/button";
import dynamic from "next/dynamic";
import { Loader2 } from "lucide-react";
import Link from "next/link";

const DynamicRequestPointMap = dynamic(
  () => import("@/components/maps/request-point-map"),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-[600px] items-center justify-center bg-muted/10">
        <div className="text-center space-y-2">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground mx-auto" />
          <p className="text-muted-foreground">Loading map...</p>
        </div>
      </div>
    ),
  },
);

export default function RequestPointPage() {
  return (
    <ContentLayout
      title="Request Area by Point"
      actions={
        <Button variant="outline" asChild>
          <Link href="/area/request">Back to Area Request</Link>
        </Button>
      }
    >
      <Suspense
        fallback={
          <div className="flex h-[600px] items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        }
      >
        <DynamicRequestPointMap />
      </Suspense>
    </ContentLayout>
  );
}
