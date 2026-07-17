"use server";

import { redirect } from "next/navigation";
import { getBypassLoginUser } from "@/server/services/authentication";
import { createSession, deleteSession } from "@/server/session";

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
  let user;
  try {
    user = await getBypassLoginUser();
  } catch (error) {
    console.error(error);
    return {
      message: "인증 서비스에 연결할 수 없습니다. 잠시 후 다시 시도하세요.",
    };
  }

  if (!user) {
    return { message: "로그인에 사용할 활성 관리자 계정이 없습니다." };
  }

  await createSession(user.id, { persistent: formData.get("remember") === "on" });
  redirect("/dashboard");
}

export async function logout() {
  await deleteSession();
  redirect("/login");
}
