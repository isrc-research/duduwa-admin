import { protectedProcedure } from "@/server/api/trpc";
import { TRPCError } from "@trpc/server";
import * as z from "zod";
import { env } from "@/env";

export const enumeratorFormPhotoProcedures = {
  uploadFormPhoto: protectedProcedure
    .input(
      z.object({
        photo: z.string().regex(/^data:image\/(jpeg|jpg|png);base64,/),
        areaCode: z.string().min(1, "Area code is required"),
        formType: z.enum(["building", "family"], {
          errorMap: () => ({ message: "Form type must be either 'building' or 'family'" })
        }),
        pageNumber: z.number().min(1, "Page number must be at least 1").optional(),
        description: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      if (!env.BUCKET_NAME) {
        throw new Error("Bucket name not configured");
      }

      try {
        const matches = input.photo.match(/^data:image\/([a-zA-Z]+);base64,/);
        if (!matches) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Invalid image format",
          });
        }

        const fileExtension = matches[1];
        const base64Data = input.photo.replace(/^data:image\/\w+;base64,/, "");
        const buffer = Buffer.from(base64Data, "base64");
        
        // Generate organized filename: form-archive/enumerator/area-code/form-type/timestamp-page.ext
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const pageInfo = input.pageNumber ? `-page${input.pageNumber}` : '';
        const fileName = `form-archive/${ctx.user.id}/${input.areaCode}/${input.formType}/${timestamp}${pageInfo}.${fileExtension}`;

        // Add content type metadata
        const metaData = {
          "Content-Type": `image/${fileExtension}`,
          "enumerator-id": ctx.user.id,
          "enumerator-name": ctx.user.name || '',
          "area-code": input.areaCode,
          "form-type": input.formType,
          "page-number": input.pageNumber?.toString() || '',
          "description": input.description || '',
          "upload-date": new Date().toISOString(),
        };

        await ctx.minio.putObject(
          env.BUCKET_NAME,
          fileName,
          buffer,
          buffer.length,
          metaData,
        );

        return { 
          success: true, 
          fileName,
          uploadedAt: new Date().toISOString(),
          areaCode: input.areaCode,
          formType: input.formType,
          pageNumber: input.pageNumber
        };
      } catch (error) {
        console.error("Failed to upload form photo:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to upload form photo. Please try again.",
        });
      }
    }),

  getFormPhotos: protectedProcedure
    .input(z.object({
      areaCode: z.string().optional(),
      formType: z.enum(["building", "family"]).optional(),
      enumeratorId: z.string().optional(),
    }))
    .query(async ({ ctx, input }) => {
      try {
        const targetEnumeratorId = input.enumeratorId || ctx.user.id;
        let prefix = `form-archive/${targetEnumeratorId}/`;
        
        if (input.areaCode) {
          prefix += `${input.areaCode}/`;
          if (input.formType) {
            prefix += `${input.formType}/`;
          }
        }

        const objects = await ctx.minio.listObjectsV2(env.BUCKET_NAME, prefix, true);
        
        const photos = [];
        for await (const obj of objects) {
          if (obj.name) {
            try {
              const presignedUrl = await ctx.minio.presignedGetObject(
                env.BUCKET_NAME,
                obj.name,
                24 * 60 * 60, // 24 hours expiry
              );

              // Get metadata
              const metadata = await ctx.minio.statObject(env.BUCKET_NAME, obj.name);
              
              photos.push({
                fileName: obj.name,
                url: presignedUrl,
                uploadedAt: obj.lastModified,
                size: obj.size,
                areaCode: metadata.metaData?.["area-code"] || "",
                formType: metadata.metaData?.["form-type"] || "",
                pageNumber: metadata.metaData?.["page-number"] ? parseInt(metadata.metaData["page-number"]) : null,
                description: metadata.metaData?.["description"] || "",
                enumeratorName: metadata.metaData?.["enumerator-name"] || "",
              });
            } catch (urlError) {
              console.error(`Failed to generate URL for ${obj.name}:`, urlError);
            }
          }
        }

        // Sort by upload date (newest first)
        photos.sort((a, b) => new Date(b.uploadedAt || 0).getTime() - new Date(a.uploadedAt || 0).getTime());

        return photos;
      } catch (error) {
        console.error("Failed to retrieve form photos:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to retrieve form photos",
        });
      }
    }),

  getFormPhotosByArea: protectedProcedure
    .input(z.object({
      enumeratorId: z.string().optional(),
    }))
    .query(async ({ ctx, input }) => {
      try {
        const targetEnumeratorId = input.enumeratorId || ctx.user.id;
        const prefix = `form-archive/${targetEnumeratorId}/`;

        const objects = await ctx.minio.listObjectsV2(env.BUCKET_NAME, prefix, true);
        
        const areaStats: Record<string, {
          areaCode: string;
          buildingCount: number;
          familyCount: number;
          totalCount: number;
          lastUpload: Date | null;
        }> = {};

        for await (const obj of objects) {
          if (obj.name) {
            try {
              const metadata = await ctx.minio.statObject(env.BUCKET_NAME, obj.name);
              const areaCode = metadata.metaData?.["area-code"];
              const formType = metadata.metaData?.["form-type"];

              if (areaCode) {
                if (!areaStats[areaCode]) {
                  areaStats[areaCode] = {
                    areaCode,
                    buildingCount: 0,
                    familyCount: 0,
                    totalCount: 0,
                    lastUpload: null,
                  };
                }

                areaStats[areaCode].totalCount++;
                if (formType === "building") {
                  areaStats[areaCode].buildingCount++;
                } else if (formType === "family") {
                  areaStats[areaCode].familyCount++;
                }

                if (obj.lastModified && (!areaStats[areaCode].lastUpload || obj.lastModified > areaStats[areaCode].lastUpload!)) {
                  areaStats[areaCode].lastUpload = obj.lastModified;
                }
              }
            } catch (metaError) {
              console.error(`Failed to get metadata for ${obj.name}:`, metaError);
            }
          }
        }

        return Object.values(areaStats).sort((a, b) => a.areaCode.localeCompare(b.areaCode));
      } catch (error) {
        console.error("Failed to retrieve area statistics:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to retrieve area statistics",
        });
      }
    }),
};
