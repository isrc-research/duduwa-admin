"use client";

import { useState } from "react";
import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LoadingButton } from "@/components/loading-button";
import { api } from "@/trpc/react";
import { toast } from "sonner";
import {
  Form,
  FormControl,
  FormField,
  FormMessage,
} from "@/components/ui/form";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ContentLayout } from "@/components/admin-panel/content-layout";
import { MapPin, ArrowLeft, Save, Home, Hash, Loader2 } from "lucide-react";
import dynamic from "next/dynamic";

// Replace static import with dynamic imports
const MapStateProvider = dynamic(
  () =>
    import("@/components/dashboard/create-area").then(
      (mod) => mod.MapStateProvider,
    ),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-[600px] items-center justify-center bg-muted/10">
        <div className="text-center space-y-2">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground mx-auto" />
          <p className="text-muted-foreground">Loading map components...</p>
        </div>
      </div>
    ),
  },
);

const DynamicCreateAreaMap = dynamic(
  () =>
    import("@/components/dashboard/create-area").then(
      (mod) => mod.CreateAreaMap,
    ),
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

const wards = [
  { value: "1", label: "1" },
  { value: "2", label: "2" },
  { value: "3", label: "3" },
  { value: "4", label: "4" },
  { value: "5", label: "5" },
  { value: "6", label: "6" },
  { value: "7", label: "7" },
  { value: "8", label: "8" },
  { value: "9", label: "9" },
  { value: "10", label: "10" },
];

const createAreaSchema = z.object({
  code: z.number().int().min(1, "Area code is required"),
  wardNumber: z.number().int().min(1, "Ward number is required"),
  geometry: z.any().optional(),
});

const CreateAreaPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedWard, setSelectedWard] = useState<number | null>(null);
  const { data: availableAreaCodes } = api.area.getAvailableAreaCodes.useQuery(
    { wardNumber: selectedWard ?? 0 },
    { enabled: !!selectedWard },
  );
  const createArea = api.area.createArea.useMutation();
  const router = useRouter();

  const form = useForm<z.infer<typeof createAreaSchema>>({
    resolver: zodResolver(createAreaSchema),
    defaultValues: {
      code: 0,
      wardNumber: 0,
    },
  });

  async function onSubmit(values: z.infer<typeof createAreaSchema>) {
    setIsLoading(true);
    try {
      const dataToSend = {
        ...values,
        code: parseInt(values.code as unknown as string),
      };
      await createArea.mutateAsync(dataToSend);
      toast.success("Area created successfully");
      router.push("/area");
    } catch (error) {
      toast.error("Failed to create area");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <ContentLayout
      title="Create New Area"
      subtitle="Add a new area with its ward number and geographical boundaries"
      actions={
        <Button variant="outline" asChild>
          <Link href="/area">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Areas
          </Link>
        </Button>
      }
    >
      <div className="space-y-6">
        <MapStateProvider>
          {/* Basic Information Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Home className="h-5 w-5" />
                Basic Information
              </CardTitle>
              <CardDescription>
                Enter the ward number and area code for the new area
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-6"
                >
                  <div className="grid gap-6 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label className="flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        Ward Number
                      </Label>
                      <Controller
                        name="wardNumber"
                        control={form.control}
                        render={({ field }) => (
                          <Select
                            value={field.value?.toString()}
                            onValueChange={(value) => {
                              const wardNum = parseInt(value);
                              setSelectedWard(wardNum);
                              field.onChange(wardNum);
                              form.setValue("code", 0);
                            }}
                            required
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select ward number" />
                            </SelectTrigger>
                            <SelectContent className="z-[10000]">
                              <SelectGroup>
                                {wards.map((ward) => (
                                  <SelectItem
                                    key={ward.value}
                                    value={ward.value}
                                  >
                                    Ward {ward.label}
                                  </SelectItem>
                                ))}
                              </SelectGroup>
                            </SelectContent>
                          </Select>
                        )}
                      />
                    </div>

                    <FormField
                      name="code"
                      control={form.control}
                      render={({ field }) => (
                        <FormControl>
                          <div className="space-y-2">
                            <Label className="flex items-center gap-2">
                              <Hash className="h-4 w-4" />
                              Area Code
                            </Label>
                            <Select
                              disabled={!selectedWard}
                              value={field.value?.toString()}
                              onValueChange={(value) =>
                                field.onChange(parseInt(value))
                              }
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select area code" />
                              </SelectTrigger>
                              <SelectContent className="max-h-[200px] z-[10000]">
                                <SelectGroup>
                                  {availableAreaCodes?.map((code) => (
                                    <SelectItem
                                      key={code}
                                      value={code.toString()}
                                    >
                                      {code}
                                    </SelectItem>
                                  ))}
                                </SelectGroup>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </div>
                        </FormControl>
                      )}
                    />
                  </div>

                  {/* Map Card */}
                  <Card className="mt-6">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <MapPin className="h-5 w-5" />
                        Area Boundary
                      </CardTitle>
                      <CardDescription>
                        Draw the geographical boundary for this area on the map
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <DynamicCreateAreaMap
                        id="new-area"
                        onGeometryChange={(geometry) =>
                          form.setValue("geometry", geometry)
                        }
                      />
                    </CardContent>
                  </Card>

                  <div className="flex justify-end gap-4">
                    <Button variant="outline" asChild>
                      <Link href="/area">Cancel</Link>
                    </Button>
                    <Button type="submit" disabled={isLoading}>
                      {isLoading ? (
                        <LoadingButton />
                      ) : (
                        <>
                          <Save className="mr-2 h-4 w-4" />
                          Save Area
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </MapStateProvider>
      </div>
    </ContentLayout>
  );
};

export default CreateAreaPage;
