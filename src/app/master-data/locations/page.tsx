import { LocationManagementPage } from "@/components/location-management-page";
import { requirePermission } from "@/server/authorization";
import { verifySession } from "@/server/dal";
import { listCountries, listLocationsForManagement } from "@/server/repositories/codebook";

export default async function LocationsPage() {
  requirePermission(await verifySession(), "location.read");
  const [locations, countries] = await Promise.all([
    listLocationsForManagement(),
    listCountries(),
  ]);
  return <LocationManagementPage locations={locations} countries={countries} />;
}
