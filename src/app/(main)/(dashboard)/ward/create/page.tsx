"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { LoadingButton } from "@/components/loading-button";
import { api } from "@/trpc/react";
import { toast } from "sonner";
import {
  Form,
  FormControl,
  FormField,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { ContentLayout } from "@/components/admin-panel/content-layout";

const formSchema = z.object({
  wardNumber: z.string().min(1, "Ward number is required"),
  areaCode: z.string().min(1, "Area code is required"),
});

const CreateWardPage = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const createWard = api.ward.createWard.useMutation();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      wardNumber: "",
      areaCode: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    try {
      const payload = {
        wardNumber: parseInt(values.wardNumber),
        wardAreaCode: parseInt(values.areaCode),
      };
      await createWard.mutateAsync(payload);
      toast.success("Ward created successfully");
      router.push("/ward");
    } catch (error) {
      toast.error("Failed to create ward");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <ContentLayout title="Create Ward">
      <Card className="max-w[600px] pt-10">
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-4">
                <FormField
                  name="wardNumber"
                  control={form.control}
                  render={({ field }) => (
                    <FormControl>
                      <div>
                        <FormLabel>Ward Number</FormLabel>
                        <Input {...field} />
                        <FormMessage />
                      </div>
                    </FormControl>
                  )}
                />
                <FormField
                  name="areaCode"
                  control={form.control}
                  render={({ field }) => (
                    <FormControl>
                      <div>
                        <FormLabel>Area Code</FormLabel>
                        <Input {...field} />
                        <FormMessage />
                      </div>
                    </FormControl>
                  )}
                />
              </div>
              <div className="flex justify-end">
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? <LoadingButton /> : "Save Changes"}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </ContentLayout>
  );
};

export default CreateWardPage;
