import { ServiceCodeManagementPage } from "@/components/service-code-management-page";
import { requirePermission } from "@/server/authorization";
import { verifySession } from "@/server/dal";
import { listServiceCodesForManagement } from "@/server/repositories/codebook";

export default async function ServicesPage() {
  requirePermission(await verifySession(), "service-code.read");
  const serviceCodes = await listServiceCodesForManagement();
  return <ServiceCodeManagementPage serviceCodes={serviceCodes} />;
}
