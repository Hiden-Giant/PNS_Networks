"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requirePermission } from "@/server/authorization";
import { verifySession } from "@/server/dal";
import { createRoute, deactivateRoute, updateRoute } from "@/server/services/route-management";

export type RouteActionState = { success: boolean; message: string };

const routeSchema = z.object({
  id: z.string().trim().optional(),
  code: z.string().trim().toUpperCase().min(3, "라우트 코드는 3자 이상이어야 합니다.").max(40).regex(/^[A-Z0-9-]+$/, "라우트 코드는 영문 대문자, 숫자, 하이픈만 사용할 수 있습니다."),
  originId: z.string().min(1, "출발지를 선택하세요."),
  destinationId: z.string().min(1, "도착지를 선택하세요."),
  transportMode: z.enum(["SEA", "AIR", "ROAD", "RAIL"]),
  transshipmentAllowed: z.string().optional().transform((value) => value === "on"),
}).refine((value) => value.originId !== value.destinationId, { path: ["destinationId"], message: "출발지와 도착지는 달라야 합니다." });

function actionError(error: unknown): RouteActionState {
  const message = error instanceof Error ? error.message : "요청을 처리하지 못했습니다.";
  if (message.includes("Unique constraint")) return { success: false, message: "동일한 라우트 코드 또는 출발지·도착지·운송 조합이 이미 존재합니다." };
  return { success: false, message };
}

export async function saveRouteAction(_state: RouteActionState, formData: FormData): Promise<RouteActionState> {
  const parsed = routeSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { success: false, message: parsed.error.issues[0]?.message ?? "입력값을 확인하세요." };
  try {
    const user = requirePermission(await verifySession(), parsed.data.id ? "route.update" : "route.create");
    const { id, ...input } = parsed.data;
    if (id) await updateRoute(id, input, user.id);
    else await createRoute(input, user.id);
    revalidatePath("/master-data/routes");
    return { success: true, message: id ? "라우트가 수정되었습니다." : "라우트가 등록되었습니다." };
  } catch (error) { return actionError(error); }
}

export async function deactivateRouteAction(id: string): Promise<RouteActionState> {
  try {
    const user = requirePermission(await verifySession(), "route.delete");
    await deactivateRoute(id, user.id);
    revalidatePath("/master-data/routes");
    return { success: true, message: "라우트가 비활성화되었습니다." };
  } catch (error) { return actionError(error); }
}
