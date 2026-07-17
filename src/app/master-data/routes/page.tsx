import { RouteManagementPage } from "@/components/route-management-page";
import { requirePermission } from "@/server/authorization";
import { verifySession } from "@/server/dal";
import { listRouteLocationOptions, listRoutesForManagement } from "@/server/repositories/codebook";

export default async function RoutesPage() {
  requirePermission(await verifySession(), "route.read");
  const [routes, locations] = await Promise.all([listRoutesForManagement(), listRouteLocationOptions()]);
  return <RouteManagementPage routes={routes} locations={locations} />;
}
