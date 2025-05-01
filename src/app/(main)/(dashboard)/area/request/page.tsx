import RequestArea from "@/components/dashboard/request-area";
import { validateRequest } from "@/lib/auth/validate-request";
import { redirect } from "next/navigation";
import { Paths } from "@/lib/constants";

export default async function RequestAreaPage() {
  const { user } = await validateRequest();
  if (!user) redirect(Paths.Login);

  return <RequestArea user={user} />;
}
