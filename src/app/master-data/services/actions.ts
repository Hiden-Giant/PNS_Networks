"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requirePermission } from "@/server/authorization";
import { verifySession } from "@/server/dal";
import { createServiceCode, deactivateServiceCode, updateServiceCode } from "@/server/services/service-code-management";

export type ServiceCodeActionState = { success: boolean; message: string };

const serviceCodeSchema = z.object({
  id: z.string().trim().optional(),
  code: z.string().trim().toUpperCase().min(2, "서비스 코드는 2자 이상이어야 합니다.").max(30).regex(/^[A-Z0-9_\-]+$/, "서비스 코드는 영문 대문자, 숫자, 밑줄, 하이픈만 사용할 수 있습니다."),
  nameKo: z.string().trim().min(1, "한글명을 입력하세요.").max(100),
  nameEn: z.string().trim().min(1, "영문명을 입력하세요.").max(150),
  defaultUnit: z.enum(["SHIPMENT", "KG", "TON", "CBM", "CONTAINER_20", "CONTAINER_40", "CONTAINER_40_HC"]),
  taxable: z.string().optional().transform((value) => value === "on"),
});

function actionError(error: unknown): ServiceCodeActionState {
  const message = error instanceof Error ? error.message : "요청을 처리하지 못했습니다.";
  if (message.includes("Unique constraint")) return { success: false, message: "이미 사용 중인 서비스 코드입니다." };
  return { success: false, message };
}

export async function saveServiceCodeAction(_state: ServiceCodeActionState, formData: FormData): Promise<ServiceCodeActionState> {
  const parsed = serviceCodeSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { success: false, message: parsed.error.issues[0]?.message ?? "입력값을 확인하세요." };
  try {
    const user = requirePermission(await verifySession(), parsed.data.id ? "service-code.update" : "service-code.create");
    const { id, ...input } = parsed.data;
    if (id) await updateServiceCode(id, input, user.id);
    else await createServiceCode(input, user.id);
    revalidatePath("/master-data/services");
    return { success: true, message: id ? "서비스 코드가 수정되었습니다." : "서비스 코드가 등록되었습니다." };
  } catch (error) { return actionError(error); }
}

export async function deactivateServiceCodeAction(id: string): Promise<ServiceCodeActionState> {
  try {
    const user = requirePermission(await verifySession(), "service-code.delete");
    await deactivateServiceCode(id, user.id);
    revalidatePath("/master-data/services");
    return { success: true, message: "서비스 코드가 비활성화되었습니다." };
  } catch (error) { return actionError(error); }
}
