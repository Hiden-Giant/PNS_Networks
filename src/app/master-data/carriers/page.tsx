import { CarrierManagementPage } from "@/components/carrier-management-page";
import { requirePermission } from "@/server/authorization";
import { verifySession } from "@/server/dal";
import { listCarriersForManagement } from "@/server/repositories/codebook";

export default async function CarriersPage() {
  requirePermission(await verifySession(), "carrier.read");
  const carriers = await listCarriersForManagement();
  return <CarrierManagementPage carriers={carriers} />;
}
