"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Box, User, Key, Eye, EyeOff } from "@/components/icons";

const TEST_ID = "pns@pns.com";
const TEST_PW = "1234!";

export default function LoginPage() {
  const router = useRouter();
  const [id, setId] = useState(TEST_ID);
  const [pw, setPw] = useState(TEST_PW);
  const [remember, setRemember] = useState(true);
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // 목업 로그인: 자격 증명 검증 없이 전사 현황으로 랜딩
    setTimeout(() => {
      router.push("/dashboard");
    }, 500);
  };

  return (
    <div className="relative flex min-h-screen w-full overflow-hidden bg-navy">
      {/* Full-screen hero background */}
      <img
        src="/login-hero.jpg"
        alt="PNS Networks 컨테이너 선박"
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(115deg, rgba(10,21,51,0.62) 0%, rgba(10,21,51,0.36) 40%, rgba(11,18,32,0.28) 65%, rgba(11,18,32,0.44) 100%)",
        }}
      />

      {/* Left: hero visual */}
      <div className="relative z-10 hidden w-1/2 lg:block">
        <div className="relative flex h-full flex-col justify-between p-12 text-white">
          <div className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand text-white">
              <Box className="h-5 w-5" />
            </span>
            <span className="text-lg font-black tracking-tight">
              PNS <span className="font-medium text-white/80">Networks</span>
            </span>
          </div>

          <div className="max-w-md">
            <span className="data inline-block rounded-md bg-brand px-2.5 py-1 text-[11px] font-bold tracking-wide">
              GLOBAL SCM PLATFORM
            </span>
            <h1 className="mt-5 text-4xl font-black leading-tight">
              LOGISTICS SUCCESS
            </h1>
            <p className="mt-3 text-lg font-medium text-white/80">
              Winning SCM with PNS
            </p>
            <p className="mt-5 text-sm leading-6 text-white/70">
              해상·항공·육상 운송 스케줄 조회부터 실시간 견적, 연동 모니터링까지.
              글로벌 물류 운영을 하나의 플랫폼에서 관리하세요.
            </p>
          </div>

          <p className="data text-[11px] text-white/40">
            © 2024 PNS Networks Enterprise. All rights reserved.
          </p>
        </div>
      </div>

      {/* Right: login form */}
      <div className="relative z-10 flex flex-1 items-center justify-center px-6 py-12">
        <div className="w-full max-w-md rounded-2xl border border-white/40 bg-surface/95 p-8 shadow-2xl backdrop-blur-md sm:p-10">
          {/* Mobile brand */}
          <div className="mb-10 flex items-center gap-2.5 lg:hidden">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand text-white">
              <Box className="h-5 w-5" />
            </span>
            <span className="text-lg font-black tracking-tight text-ink">
              PNS <span className="font-medium text-muted">Networks</span>
            </span>
          </div>

          <p className="eyebrow">WELCOME BACK</p>
          <h2 className="mt-2 text-3xl font-bold text-ink">로그인</h2>
          <p className="mt-2 text-sm text-muted">
            물류 관리 콘솔에 접속하려면 계정 정보를 입력하세요.
          </p>

          <form onSubmit={handleSubmit} className="mt-6 space-y-5">
            <div>
              <label htmlFor="login-id" className="eyebrow mb-2 flex items-center gap-1.5">
                <User className="h-3.5 w-3.5" />
                아이디
              </label>
              <input
                id="login-id"
                type="text"
                value={id}
                onChange={(e) => setId(e.target.value)}
                placeholder="이메일 또는 아이디"
                className="data w-full rounded-xl border border-line bg-canvas/50 px-4 py-3 text-sm text-ink outline-none transition focus:border-brand focus:bg-surface"
              />
            </div>

            <div>
              <label htmlFor="login-pw" className="eyebrow mb-2 flex items-center gap-1.5">
                <Key className="h-3.5 w-3.5" />
                비밀번호
              </label>
              <div className="relative">
                <input
                  id="login-pw"
                  type={showPw ? "text" : "password"}
                  value={pw}
                  onChange={(e) => setPw(e.target.value)}
                  placeholder="비밀번호"
                  className="data w-full rounded-xl border border-line bg-canvas/50 px-4 py-3 pr-11 text-sm text-ink outline-none transition focus:border-brand focus:bg-surface"
                />
                <button
                  type="button"
                  onClick={() => setShowPw((v) => !v)}
                  aria-label={showPw ? "비밀번호 숨기기" : "비밀번호 보기"}
                  aria-pressed={showPw}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-faint transition-colors hover:text-ink"
                >
                  {showPw ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex cursor-pointer items-center gap-2 text-sm text-ink-soft">
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                  className="h-4 w-4 rounded border-line text-brand accent-brand"
                />
                로그인 상태 유지
              </label>
              <button type="button" className="text-sm font-medium text-brand hover:underline">
                비밀번호 찾기
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-brand px-6 py-3.5 text-base font-semibold text-white shadow-lg shadow-brand/25 transition-colors hover:bg-brand-dark disabled:opacity-70"
            >
              {loading ? "로그인 중..." : "로그인"}
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-muted">
            계정이 없으신가요?{" "}
            <button type="button" className="font-semibold text-brand hover:underline">
              가입 문의
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
