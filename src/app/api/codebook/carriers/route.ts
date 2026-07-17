import { requirePermission } from "@/server/authorization";
import { apiErrorResponse } from "@/server/api-response";
import { verifySession } from "@/server/dal";
import { listCarriers } from "@/server/repositories/codebook";

export async function GET() {
  try {
    requirePermission(await verifySession(), "carrier.read");
    return Response.json({ data: await listCarriers() });
  } catch (error) {
    return apiErrorResponse(error);
  }
}
