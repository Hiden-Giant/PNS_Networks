"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requirePermission } from "@/server/authorization";
import { verifySession } from "@/server/dal";
import { createCarrier, deactivateCarrier, updateCarrier } from "@/server/services/carrier-management";

export type CarrierActionState = { success: boolean; message: string };

const carrierSchema = z.object({
  id: z.string().trim().optional(),
  code: z.string().trim().toUpperCase().min(3, "내부 코드는 3자 이상이어야 합니다.").max(30).regex(/^[A-Z0-9-]+$/, "내부 코드는 영문 대문자, 숫자, 하이픈만 사용할 수 있습니다."),
  type: z.enum(["OCEAN", "AIRLINE", "TRUCKING", "RAIL"]),
  nameKo: z.string().trim().min(1, "한글명을 입력하세요.").max(100),
  nameEn: z.string().trim().min(1, "영문명을 입력하세요.").max(150),
  scac: z.string().trim().toUpperCase().regex(/^[A-Z]{4}$/, "SCAC는 영문 4자리여야 합니다.").or(z.literal("")),
  iataCode: z.string().trim().toUpperCase().regex(/^[A-Z0-9]{2}$/, "IATA 항공사 코드는 영문·숫자 2자리여야 합니다.").or(z.literal("")),
}).superRefine((value, context) => {
  if (value.type === "OCEAN" && !value.scac) context.addIssue({ code: "custom", path: ["scac"], message: "선사는 SCAC 코드가 필요합니다." });
  if (value.type === "AIRLINE" && !value.iataCode) context.addIssue({ code: "custom", path: ["iataCode"], message: "항공사는 IATA 항공사 코드가 필요합니다." });
});

function actionError(error: unknown): CarrierActionState {
  const message = error instanceof Error ? error.message : "요청을 처리하지 못했습니다.";
  if (message.includes("Unique constraint")) return { success: false, message: "이미 사용 중인 내부 코드, SCAC 또는 IATA 코드입니다." };
  return { success: false, message };
}

export async function saveCarrierAction(_state: CarrierActionState, formData: FormData): Promise<CarrierActionState> {
  const parsed = carrierSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { success: false, message: parsed.error.issues[0]?.message ?? "입력값을 확인하세요." };
  try {
    const user = requirePermission(await verifySession(), parsed.data.id ? "carrier.update" : "carrier.create");
    const { id, scac, iataCode, ...data } = parsed.data;
    const input = { ...data, scac: scac || null, iataCode: iataCode || null };
    if (id) await updateCarrier(id, input, user.id);
    else await createCarrier(input, user.id);
    revalidatePath("/master-data/carriers");
    return { success: true, message: id ? "운송사가 수정되었습니다." : "운송사가 등록되었습니다." };
  } catch (error) { return actionError(error); }
}

export async function deactivateCarrierAction(id: string): Promise<CarrierActionState> {
  try {
    const user = requirePermission(await verifySession(), "carrier.delete");
    await deactivateCarrier(id, user.id);
    revalidatePath("/master-data/carriers");
    return { success: true, message: "운송사가 비활성화되었습니다." };
  } catch (error) { return actionError(error); }
}
