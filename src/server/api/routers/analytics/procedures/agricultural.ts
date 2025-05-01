import { sql } from "drizzle-orm";
import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { and, count, eq } from "drizzle-orm";
import duduwaAgriculturalLand from "@/server/db/schema/family/agricultural-lands";
import { duduwaCrop } from "@/server/db/schema/family/crops";
import { duduwaAnimal } from "@/server/db/schema/family/animals";
import { duduwaAnimalProduct } from "@/server/db/schema/family/animal-products";

export const getAgriculturalLandStats = publicProcedure
  .input(z.object({ wardNumber: z.number().optional() }))
  .query(async ({ ctx, input }) => {
    const query = ctx.db
      .select({
        ownershipType: duduwaAgriculturalLand.landOwnershipType,
        totalArea: sql<number>`sum(${duduwaAgriculturalLand.landArea})::float`,
        count: sql<number>`count(*)::int`,
      })
      .from(duduwaAgriculturalLand);

    if (input.wardNumber) {
      query.where(eq(duduwaAgriculturalLand.wardNo, input.wardNumber));
    }

    return await query.groupBy(duduwaAgriculturalLand.landOwnershipType);
  });

export const getIrrigationStats = publicProcedure
  .input(z.object({ wardNumber: z.number().optional() }))
  .query(async ({ ctx, input }) => {
    const query = ctx.db
      .select({
        isIrrigated: duduwaAgriculturalLand.isLandIrrigated,
        totalArea: sql<number>`sum(${duduwaAgriculturalLand.irrigatedLandArea})::float`,
        count: sql<number>`count(*)::int`,
      })
      .from(duduwaAgriculturalLand);

    if (input.wardNumber) {
      query.where(eq(duduwaAgriculturalLand.wardNo, input.wardNumber));
    }

    return await query.groupBy(duduwaAgriculturalLand.isLandIrrigated);
  });

export const getCropStats = publicProcedure
  .input(z.object({ wardNumber: z.number().optional() }))
  .query(async ({ ctx, input }) => {
    const query = ctx.db
      .select({
        cropType: duduwaCrop.cropType,
        cropName: duduwaCrop.cropName,
        totalArea: sql<number>`sum(${duduwaCrop.cropArea})::float`,
        totalProduction: sql<number>`sum(${duduwaCrop.cropProduction})::float`,
        totalRevenue: sql<number>`sum(${duduwaCrop.cropRevenue})::float`,
        count: sql<number>`count(*)::int`,
      })
      .from(duduwaCrop);

    if (input.wardNumber) {
      query.where(eq(duduwaCrop.wardNo, input.wardNumber));
    }

    return await query.groupBy(duduwaCrop.cropType, duduwaCrop.cropName);
  });

export const getAnimalStats = publicProcedure
  .input(z.object({ wardNumber: z.number().optional() }))
  .query(async ({ ctx, input }) => {
    const query = ctx.db
      .select({
        animalName: duduwaAnimal.animalName,
        totalCount: sql<number>`sum(${duduwaAnimal.totalAnimals})::int`,
        totalSales: sql<number>`sum(${duduwaAnimal.animalSales})::float`,
        totalRevenue: sql<number>`sum(${duduwaAnimal.animalRevenue})::float`,
        householdCount: sql<number>`count(*)::int`,
      })
      .from(duduwaAnimal);

    if (input.wardNumber) {
      query.where(eq(duduwaAnimal.wardNo, input.wardNumber));
    }

    return await query.groupBy(duduwaAnimal.animalName);
  });

export const getAnimalProductStats = publicProcedure
  .input(z.object({ wardNumber: z.number().optional() }))
  .query(async ({ ctx, input }) => {
    const query = ctx.db
      .select({
        productName: duduwaAnimalProduct.animalProductName,
        unit: duduwaAnimalProduct.animalProductUnit,
        totalProduction: sql<number>`sum(${duduwaAnimalProduct.animalProductProduction})::float`,
        totalSales: sql<number>`sum(${duduwaAnimalProduct.animalProductSales})::float`,
        totalRevenue: sql<number>`sum(${duduwaAnimalProduct.animalProductRevenue})::float`,
        householdCount: sql<number>`count(*)::int`,
      })
      .from(duduwaAnimalProduct);

    if (input.wardNumber) {
      query.where(eq(duduwaAnimalProduct.wardNo, input.wardNumber));
    }

    return await query.groupBy(
      duduwaAnimalProduct.animalProductName,
      duduwaAnimalProduct.animalProductUnit
    );
  });

export const getAgriculturalLandOverview = publicProcedure
  .input(z.object({ wardNumber: z.number().optional() }))
  .query(async ({ ctx, input }) => {
    const query = ctx.db
      .select({
        totalLandArea: sql<number>`sum(${duduwaAgriculturalLand.landArea})::float`,
        totalIrrigatedArea: sql<number>`sum(${duduwaAgriculturalLand.irrigatedLandArea})::float`,
        householdCount: sql<number>`count(distinct ${duduwaAgriculturalLand.familyId})::int`,
      })
      .from(duduwaAgriculturalLand);

    if (input.wardNumber) {
      query.where(eq(duduwaAgriculturalLand.wardNo, input.wardNumber));
    }

    return (await query)[0];
  });

export const getAgricultureOverview = publicProcedure
  .input(z.object({ wardNumber: z.number().optional() }))
  .query(async ({ ctx, input }) => {
    const baseWhere = input.wardNumber
      ? sql`ward_no = ${input.wardNumber}`
      : sql`1=1`;

    const [crops, animals, products] = await Promise.all([
      ctx.db.execute(sql`
        SELECT 
          COUNT(DISTINCT family_id)::int as total_households,
          SUM(crop_revenue)::float as total_revenue,
          SUM(crop_area)::float as total_area
        FROM ${duduwaCrop}
        WHERE ${baseWhere}
      `),
      ctx.db.execute(sql`
        SELECT 
          COUNT(DISTINCT family_id)::int as total_households,
          SUM(animal_revenue)::float as total_revenue,
          SUM(total_animals)::int as total_count
        FROM ${duduwaAnimal}
        WHERE ${baseWhere}
      `),
      ctx.db.execute(sql`
        SELECT 
          COUNT(DISTINCT family_id)::int as total_households,
          SUM(animal_product_revenue)::float as total_revenue
        FROM ${duduwaAnimalProduct}
        WHERE ${baseWhere}
      `),
    ]);

    return {
      crops: crops[0],
      animals: animals[0],
      animalProducts: products[0],
    };
  });
