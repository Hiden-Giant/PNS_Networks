import { z } from "zod";
import { requirePermission } from "@/server/authorization";
import { apiErrorResponse } from "@/server/api-response";
import { verifySession } from "@/server/dal";
import { listLocations } from "@/server/repositories/codebook";

const querySchema = z.object({
  countryId: z.string().min(1).optional(),
  type: z.enum(["PORT", "AIRPORT", "CITY"]).optional(),
  status: z.enum(["ACTIVE", "INACTIVE"]).optional(),
  query: z.string().trim().max(100).optional(),
  limit: z.coerce.number().int().min(1).max(100).optional(),
});

export async function GET(request: Request) {
  try {
    const user = requirePermission(await verifySession(), "location.read");
    const url = new URL(request.url);
    const parsed = querySchema.safeParse(Object.fromEntries(url.searchParams));

    if (!parsed.success) {
      return Response.json(
        { error: "조회 조건이 올바르지 않습니다.", details: parsed.error.flatten() },
        { status: 400 },
      );
    }

    return Response.json({
      data: await listLocations(parsed.data),
      meta: { requestedBy: user.id },
    });
  } catch (error) {
    return apiErrorResponse(error);
  }
}
