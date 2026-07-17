import { requirePermission } from "@/server/authorization";
import { apiErrorResponse } from "@/server/api-response";
import { verifySession } from "@/server/dal";
import { listServiceCodes } from "@/server/repositories/codebook";

export async function GET() {
  try {
    requirePermission(await verifySession(), "service-code.read");
    return Response.json({ data: await listServiceCodes() });
  } catch (error) {
    return apiErrorResponse(error);
  }
}
