import { MockupPage, SectionCard, DataTable, Badge } from "@/components/mockup";
import { SubTabs } from "@/components/sub-tabs";
import { Key, Users, Plus } from "@/components/icons";
import {
  MENU_RESOURCES,
  ROLE_DEFINITIONS,
  canAccessMenu,
} from "@/domain/access-control";

const SETTINGS_TABS = [
  { href: "/settings/permissions", label: "권한 관리" },
  { href: "/settings/logs", label: "로그 관리" },
];

export default function PermissionsPage() {
  return (
    <MockupPage
      eyebrow="시스템 설정 · 권한 관리"
      title="권한 관리"
      icon={Key}
      description="포워딩 영업·운임·운영 업무 역할별로 메뉴 접근 권한을 제어합니다."
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
          columns={["역할", ...MENU_RESOURCES.map((resource) => resource.label)]}
          rows={ROLE_DEFINITIONS.map((role) => [
            <div key="r" className="min-w-40">
              <p className="font-semibold text-ink">{role.name}</p>
              <p className="mt-1 text-xs leading-5 text-muted">
                {role.description}
              </p>
            </div>,
            ...MENU_RESOURCES.map((resource) => (
              <AccessCell
                key={resource.id}
                allowed={canAccessMenu(role, resource.id)}
              />
            )),
          ])}
        />
      </SectionCard>

      <SectionCard title="사용자 계정" icon={Users}>
        <DataTable
          columns={["이름", "이메일", "역할", "최근 접속", "상태"]}
          rows={[
            [
              "김시스템",
              "admin@pns.co.kr",
              <Badge key="r" tone="danger">시스템 관리자</Badge>,
              "2026-07-17 09:20",
              <Badge key="a" tone="success">활성</Badge>,
            ],
            [
              "이운임",
              "rate@pns.co.kr",
              <Badge key="r" tone="info">운임 관리자</Badge>,
              "2026-07-17 08:41",
              <Badge key="a" tone="success">활성</Badge>,
            ],
            [
              "박영업",
              "sales@pns.co.kr",
              <Badge key="r" tone="warning">영업 담당자</Badge>,
              "2026-07-16 17:55",
              <Badge key="a" tone="success">활성</Badge>,
            ],
            [
              "최운영",
              "operations@pns.co.kr",
              <Badge key="r" tone="muted">운영 담당자</Badge>,
              "2026-07-16 16:18",
              <Badge key="a" tone="success">활성</Badge>,
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
