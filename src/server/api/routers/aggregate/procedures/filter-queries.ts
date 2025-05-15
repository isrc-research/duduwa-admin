import { publicProcedure } from "@/server/api/trpc";
import { sql } from "drizzle-orm";
import { duduwaAggregateBuilding } from "@/server/db/schema/aggregate-building";

export const getDistinctWardNumbers = publicProcedure.query(async ({ ctx }) => {
  const results = await ctx.db
    .selectDistinct({
      wardNumber: duduwaAggregateBuilding.ward_number,
    })
    .from(duduwaAggregateBuilding)
    .where(sql`${duduwaAggregateBuilding.ward_number} IS NOT NULL`)
    .orderBy(duduwaAggregateBuilding.ward_number);

  return results
    .filter(({ wardNumber }) => wardNumber !== null)
    .map(({ wardNumber }) => ({
      id: wardNumber!.toString(),
      wardNumber: wardNumber!,
    }));
});

export const getDistinctAreaCodes = publicProcedure.query(async ({ ctx }) => {
  const results = await ctx.db
    .selectDistinct({
      areaCode: duduwaAggregateBuilding.area_code,
    })
    .from(duduwaAggregateBuilding)
    .where(sql`${duduwaAggregateBuilding.area_code} IS NOT NULL`)
    .orderBy(duduwaAggregateBuilding.area_code);

  return results
    .filter(({ areaCode }) => areaCode !== null)
    .map(({ areaCode }) => ({
      id: areaCode!.toString(),
      areaCode: areaCode!,
    }));
});

export const getDistinctEnumerators = publicProcedure.query(async ({ ctx }) => {
  const results = await ctx.db
    .selectDistinct({
      enumeratorId: duduwaAggregateBuilding.enumerator_id,
      enumeratorName: duduwaAggregateBuilding.enumerator_name,
    })
    .from(duduwaAggregateBuilding)
    .where(sql`${duduwaAggregateBuilding.enumerator_id} IS NOT NULL`)
    .orderBy(duduwaAggregateBuilding.enumerator_name);

  return results
    .filter(({ enumeratorId }) => enumeratorId !== null)
    .map(({ enumeratorId, enumeratorName }) => ({
      id: enumeratorId!,
      name: enumeratorName || "Unknown Enumerator",
    }));
});

export const getDistinctMapStatuses = publicProcedure.query(async ({ ctx }) => {
  const results = await ctx.db
    .selectDistinct({
      mapStatus: duduwaAggregateBuilding.map_status,
    })
    .from(duduwaAggregateBuilding)
    .where(sql`${duduwaAggregateBuilding.map_status} IS NOT NULL`)
    .orderBy(duduwaAggregateBuilding.map_status);

  return results
    .filter(({ mapStatus }) => mapStatus !== null)
    .map(({ mapStatus }) => ({
      id: mapStatus!,
      name: mapStatus!,
    }));
});

export const getDistinctBuildingOwnerships = publicProcedure.query(
  async ({ ctx }) => {
    const results = await ctx.db
      .selectDistinct({
        buildingOwnership: duduwaAggregateBuilding.building_ownership_status,
      })
      .from(duduwaAggregateBuilding)
      .where(
        sql`${duduwaAggregateBuilding.building_ownership_status} IS NOT NULL`,
      )
      .orderBy(duduwaAggregateBuilding.building_ownership_status);

    return results
      .filter(({ buildingOwnership }) => buildingOwnership !== null)
      .map(({ buildingOwnership }) => ({
        id: buildingOwnership!,
        name: buildingOwnership!.replace(/_/g, " "),
      }));
  },
);

export const getDistinctBuildingBases = publicProcedure.query(
  async ({ ctx }) => {
    const results = await ctx.db
      .selectDistinct({
        buildingBase: duduwaAggregateBuilding.building_base,
      })
      .from(duduwaAggregateBuilding)
      .where(sql`${duduwaAggregateBuilding.building_base} IS NOT NULL`)
      .orderBy(duduwaAggregateBuilding.building_base);

    return results
      .filter(({ buildingBase }) => buildingBase !== null)
      .map(({ buildingBase }) => ({
        id: buildingBase!,
        name: buildingBase!.replace(/_/g, " "),
      }));
  },
);
