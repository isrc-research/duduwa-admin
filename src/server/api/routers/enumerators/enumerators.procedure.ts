import { createTRPCRouter } from "@/server/api/trpc";
import { enumeratorAuthProcedures } from "./procedures/auth";
import { enumeratorAreaProcedures } from "./procedures/area";
import { enumeratorPhotoProcedures } from "./procedures/photo";
import { enumeratorIdCardProcedures } from "./procedures/idCard";

export const enumeratorRouter = createTRPCRouter({
  ...enumeratorAuthProcedures,
  ...enumeratorAreaProcedures,
  ...enumeratorPhotoProcedures,
  ...enumeratorIdCardProcedures,
});
