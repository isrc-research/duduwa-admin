"use client";

import { ContentLayout } from "@/components/admin-panel/content-layout";
import { api } from "@/trpc/react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";
import { MapPin, Building2, Home, Key } from "lucide-react";
import dynamic from "next/dynamic";
import TokenStats from "@/components/token-stats";
import { TokenList } from "@/components/tokens/token-list";

const Map = dynamic(() => import("@/components/map/view-area-map"), {
  ssr: false,
  loading: () => (
    <div className="h-[400px] w-full animate-pulse rounded-lg bg-muted z-20" />
  ),
});

const InfoItem = ({
  icon: Icon,
  label,
  value,
}: {
  icon: any;
  label: string;
  value: string | number | null;
}) => (
  <div className="flex items-start space-x-3">
    <div className="mt-0.5">
      <Icon className="h-4 w-4 text-muted-foreground" />
    </div>
    <div>
      <p className="text-sm font-medium text-muted-foreground">{label}</p>
      <p className="mt-1 font-medium">{value || "-"}</p>
    </div>
  </div>
);

export default function AreaDetailsPage({
  params,
}: {
  params: { id: string };
}) {
  const router = useRouter();
  const { data: area, isLoading } = api.area.getAreaById.useQuery({
    id: params.id,
  });
  const { data: tokenStats, isLoading: isTokenStatsLoading } =
    api.area.getTokenStatsByAreaId.useQuery({
      areaId: params.id,
    });

  if (isLoading) {
    return (
      <ContentLayout title="Area Details">
        <div className="space-y-6">
          {[1, 2].map((i) => (
            <Skeleton key={i} className="h-[200px] rounded-lg" />
          ))}
        </div>
      </ContentLayout>
    );
  }

  if (!area) {
    return (
      <ContentLayout title="Area Not Found">
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-10">
            <MapPin className="h-12 w-12 text-muted-foreground/50" />
            <p className="mt-4 text-lg font-medium text-muted-foreground">
              The requested area could not be found
            </p>
          </CardContent>
        </Card>
      </ContentLayout>
    );
  }

  return (
    <ContentLayout
      title="Area Details"
      subtitle={`Ward ${area.wardNumber} - Area ${area.code}`}
      actions={
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => router.push("/area")}>
            Back to List
          </Button>
          <Button onClick={() => router.push(`/area/update/${params.id}`)}>
            Edit Area
          </Button>
        </div>
      }
    >
      <div className="space-y-6 px-2 lg:px-10">
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
            <CardDescription>
              Details about the area and its coverage
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              <InfoItem
                icon={MapPin}
                label="Ward Number"
                value={`Ward ${area.wardNumber}`}
              />
              <InfoItem icon={Building2} label="Area Code" value={area.code} />
              <InfoItem
                icon={Home}
                label="Total Buildings"
                // @ts-ignore
                value={area.buildings || 0}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Token Statistics</CardTitle>
            <CardDescription>
              Overview of building tokens in this area
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isTokenStatsLoading ? (
              <Skeleton className="h-[200px] rounded-lg" />
            ) : (
              <TokenStats
                stats={
                  tokenStats || {
                    totalTokens: 0,
                    allocatedTokens: 0,
                    unallocatedTokens: 0,
                  }
                }
              />
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Area Map</CardTitle>
            <CardDescription>
              Geographical boundaries of the area
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[400px] w-full rounded-lg overflow-hidden">
              <Map area={area} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Building Tokens</CardTitle>
            <CardDescription>
              List of all building tokens for this area
            </CardDescription>
          </CardHeader>
          <CardContent>
            <TokenList areaId={params.id} />
          </CardContent>
        </Card>
      </div>
    </ContentLayout>
  );
}
