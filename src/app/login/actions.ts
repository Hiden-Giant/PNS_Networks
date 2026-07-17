"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { authenticateUser } from "@/server/services/authentication";
import { createSession, deleteSession } from "@/server/session";

const loginSchema = z.object({
  email: z.email("올바른 이메일 주소를 입력하세요.").trim().toLowerCase(),
  password: z
    .string()
    .min(8, "비밀번호는 8자 이상이어야 합니다.")
    .max(128, "비밀번호가 너무 깁니다."),
  remember: z.boolean(),
});

export type LoginState = {
  fieldErrors?: {
    email?: string[];
    password?: string[];
  };
  message?: string;
};

export async function login(
  _previousState: LoginState,
  formData: FormData,
): Promise<LoginState> {
  const parsed = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
    remember: formData.get("remember") === "on",
  });

  if (!parsed.success) {
    return { fieldErrors: parsed.error.flatten().fieldErrors };
  }

  let user;
  try {
    user = await authenticateUser(parsed.data.email, parsed.data.password);
  } catch (error) {
    console.error(error);
    return {
      message: "인증 서비스에 연결할 수 없습니다. 잠시 후 다시 시도하세요.",
    };
  }

  if (!user) {
    return { message: "이메일 또는 비밀번호를 확인하세요." };
  }

  await createSession(user.id, { persistent: parsed.data.remember });
  redirect("/dashboard");
}

export async function logout() {
  await deleteSession();
  redirect("/login");
}
