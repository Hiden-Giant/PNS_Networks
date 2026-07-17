import { PagePlaceholder } from "@/components/page-placeholder";
import { Sync } from "@/components/icons";

export default async function IntegrationRunPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <PagePlaceholder icon={Sync} subtitle={`연동 실행 · ${id}`} title="연동 실행 상세" description="수집 실행 결과, 처리 건수, 실패 단계와 오류 원문을 확인하는 화면입니다." />;
}
