import "server-only";

import {
  AuthenticationError,
  AuthorizationError,
} from "@/server/authorization";

export function apiErrorResponse(error: unknown) {
  if (error instanceof AuthenticationError) {
    return Response.json({ error: error.message }, { status: 401 });
  }

  if (error instanceof AuthorizationError) {
    return Response.json({ error: error.message }, { status: 403 });
  }

  console.error(error);
  return Response.json(
    { error: "요청을 처리하는 중 오류가 발생했습니다." },
    { status: 500 },
  );
}
