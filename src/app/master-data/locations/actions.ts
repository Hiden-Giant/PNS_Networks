"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requirePermission } from "@/server/authorization";
import { verifySession } from "@/server/dal";
import { createLocation, deactivateLocation, updateLocation } from "@/server/services/location-management";

export type LocationActionState = { success: boolean; message: string };

const locationSchema = z.object({
  id: z.string().trim().optional(),
  countryId: z.string().min(1, "국가를 선택하세요."),
  type: z.enum(["PORT", "AIRPORT"]),
  code: z.string().trim().min(3).max(30).regex(/^[A-Z0-9-]+$/, "내부 코드는 영문 대문자, 숫자, 하이픈만 사용할 수 있습니다."),
  unLocode: z.string().trim().toUpperCase().regex(/^[A-Z]{2}[A-Z0-9]{3}$/, "UN/LOCODE는 5자리여야 합니다.").or(z.literal("")),
  iataCode: z.string().trim().toUpperCase().regex(/^[A-Z]{3}$/, "IATA 코드는 3자리여야 합니다.").or(z.literal("")),
  nameKo: z.string().trim().min(1, "한글명을 입력하세요.").max(100),
  nameEn: z.string().trim().min(1, "영문명을 입력하세요.").max(150),
  timezone: z.string().trim().min(3).max(100),
}).superRefine((value, context) => {
  if (value.type === "PORT" && !value.unLocode) context.addIssue({ code: "custom", path: ["unLocode"], message: "항구는 UN/LOCODE가 필요합니다." });
  if (value.type === "AIRPORT" && !value.iataCode) context.addIssue({ code: "custom", path: ["iataCode"], message: "공항은 IATA 코드가 필요합니다." });
  try { new Intl.DateTimeFormat("en-US", { timeZone: value.timezone }).format(); }
  catch { context.addIssue({ code: "custom", path: ["timezone"], message: "유효한 IANA 시간대를 입력하세요." }); }
});

function actionError(error: unknown): LocationActionState {
  const message = error instanceof Error ? error.message : "요청을 처리하지 못했습니다.";
  if (message.includes("Unique constraint")) return { success: false, message: "이미 사용 중인 내부 코드, UN/LOCODE 또는 IATA 코드입니다." };
  return { success: false, message };
}

export async function saveLocationAction(_state: LocationActionState, formData: FormData): Promise<LocationActionState> {
  const parsed = locationSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { success: false, message: parsed.error.issues[0]?.message ?? "입력값을 확인하세요." };

  try {
    const permission = parsed.data.id ? "location.update" : "location.create";
    const user = requirePermission(await verifySession(), permission);
    const { id, unLocode, iataCode, ...data } = parsed.data;
    const input = { ...data, unLocode: unLocode || null, iataCode: iataCode || null };
    if (id) await updateLocation(id, input, user.id);
    else await createLocation(input, user.id);
    revalidatePath("/master-data/locations");
    return { success: true, message: id ? "Location을 수정했습니다." : "Location을 등록했습니다." };
  } catch (error) { return actionError(error); }
}

export async function deactivateLocationAction(id: string): Promise<LocationActionState> {
  try {
    const user = requirePermission(await verifySession(), "location.delete");
    await deactivateLocation(id, user.id);
    revalidatePath("/master-data/locations");
    return { success: true, message: "Location을 비활성 처리했습니다." };
  } catch (error) { return actionError(error); }
}
