import { MockupPage, SectionCard, DataTable, Badge } from "@/components/mockup";
import { SubTabs } from "@/components/sub-tabs";
import { Key, Users, Plus } from "@/components/icons";

const SETTINGS_TABS = [
  { href: "/settings/permissions", label: "권한 관리" },
  { href: "/settings/logs", label: "로그 관리" },
];

const MENUS = ["메인 대시보드", "기준 정보 관리", "스케줄 조회", "연동 관리", "시스템 설정"];

const ROLES = [
  { name: "관리자", access: [true, true, true, true, true] },
  { name: "창고 작업자", access: [true, true, true, false, false] },
  { name: "매장 스태프", access: [true, false, true, false, false] },
];

export default function PermissionsPage() {
  return (
    <MockupPage
      eyebrow="시스템 설정 · 권한 관리"
      title="권한 관리"
      icon={Key}
      description="관리자·창고 작업자·매장 스태프별 메뉴 접근 권한을 제어합니다."
      actions={
        <button className="flex items-center gap-1.5 rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-white hover:bg-brand-dark">
          <Plus className="h-4 w-4" />
          역할 추가
        </button>
      }
    >
      <SubTabs tabs={SETTINGS_TABS} />

      <SectionCard title="역할별 메뉴 접근 권한" icon={Key}>
        <DataTable
          columns={["역할", ...MENUS]}
          rows={ROLES.map((role) => [
            <span key="r" className="font-semibold text-ink">{role.name}</span>,
            ...role.access.map((allowed, i) => (
              <AccessCell key={i} allowed={allowed} />
            )),
          ])}
        />
      </SectionCard>

      <SectionCard title="사용자 계정" icon={Users}>
        <DataTable
          columns={["이름", "이메일", "역할", "최근 접속", "상태"]}
          rows={[
            [
              "김관리",
              "admin@pns.co.kr",
              <Badge key="r" tone="danger">관리자</Badge>,
              "2024-05-10 09:20",
              <Badge key="a" tone="success">활성</Badge>,
            ],
            [
              "이창고",
              "warehouse@pns.co.kr",
              <Badge key="r" tone="info">창고 작업자</Badge>,
              "2024-05-10 08:41",
              <Badge key="a" tone="success">활성</Badge>,
            ],
            [
              "박매장",
              "store@pns.co.kr",
              <Badge key="r" tone="muted">매장 스태프</Badge>,
              "2024-05-09 17:55",
              <Badge key="p" tone="warning">휴면</Badge>,
            ],
          ]}
        />
      </SectionCard>
    </MockupPage>
  );
}

function AccessCell({ allowed }: { allowed: boolean }) {
  return allowed ? (
    <Badge tone="success">허용</Badge>
  ) : (
    <Badge tone="muted">차단</Badge>
  );
}
