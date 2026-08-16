import type { Metadata } from "next";
import { BUSINESS_INFO } from "@/lib/businessInfo";

export const metadata: Metadata = {
  title: "개인정보처리방침",
};

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-8">
      <h2 className="mb-2 text-base font-bold text-fg">{title}</h2>
      <div className="space-y-2 text-sm leading-relaxed text-fg-muted">{children}</div>
    </section>
  );
}

export default function PrivacyPolicyPage() {
  const b = BUSINESS_INFO;
  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-2xl font-black tracking-tight">개인정보처리방침</h1>
      <p className="mt-2 text-sm text-fg-muted">
        {b.companyName}(이하 &ldquo;회사&rdquo;)이 운영하는 {b.serviceName}(이하 &ldquo;서비스&rdquo;)는 이용자의 개인정보를
        중요시하며, 「개인정보보호법」 등 관련 법령을 준수합니다. 회사는 본 개인정보처리방침을 통해 이용자가 제공하는
        개인정보가 어떠한 목적과 방식으로 이용되고 있으며, 개인정보보호를 위해 어떠한 조치가 취해지고 있는지 알려드립니다.
      </p>

      <Section title="1. 수집하는 개인정보 항목 및 수집방법">
        <p>
          <strong className="text-fg">가. 회원가입 시</strong>
          <br />
          - 필수항목: 이메일, 비밀번호(암호화 저장), 닉네임
          <br />
          - 소셜 로그인(카카오, 구글) 가입 시: 이메일, 닉네임/이름, 프로필 사진(제공 동의한 경우)
        </p>
        <p>
          <strong className="text-fg">나. 서비스 이용 중 선택적으로 입력</strong>
          <br />
          지역, 성별, 출생연도, 보유 바이크 기종, 라이딩 입문연도, 프로필 사진
        </p>
        <p>
          <strong className="text-fg">다. 서비스 이용 과정에서 자동으로 생성·수집되는 정보</strong>
          <br />
          접속 로그, 접속 IP, 쿠키, 서비스 이용 기록, 기기정보
        </p>
        <p>
          <strong className="text-fg">라. 수집방법</strong>
          <br />
          회원가입 및 서비스 이용 과정에서 이용자가 개인정보 수집에 동의하고 직접 입력, 소셜 로그인 제공자로부터의 전달,
          서비스 이용 과정에서 자동 생성 정보 수집.
        </p>
      </Section>

      <Section title="2. 개인정보의 수집 및 이용목적">
        <ul className="list-disc space-y-1 pl-5">
          <li>회원 가입의사 확인, 회원제 서비스 제공에 따른 본인 식별·인증, 회원자격 유지·관리</li>
          <li>커뮤니티(게시글·댓글), 마켓(중고 거래), 라이딩 등 서비스 제공 및 콘텐츠 제공</li>
          <li>부정이용 방지, 신고 처리, 서비스 운영에 필요한 통계·분석</li>
          <li>공지사항 전달, 민원 처리 등 원활한 의사소통 경로 확보</li>
          <li>(향후 개시 예정) 입점 업체 상품·서비스 결제 및 정산</li>
        </ul>
      </Section>

      <Section title="3. 개인정보의 보유 및 이용기간">
        <p>
          원칙적으로 개인정보 수집·이용 목적이 달성되거나 회원 탈퇴 시 지체 없이 파기합니다. 다만 관계 법령에 따라
          보존할 필요가 있는 경우 회사는 아래와 같이 관계 법령에서 정한 일정한 기간 동안 회원정보를 보관합니다.
        </p>
        <ul className="list-disc space-y-1 pl-5">
          <li>계약 또는 청약철회 등에 관한 기록 (전자상거래법): 5년</li>
          <li>대금결제 및 재화 등의 공급에 관한 기록 (전자상거래법): 5년</li>
          <li>소비자의 불만 또는 분쟁처리에 관한 기록 (전자상거래법): 3년</li>
          <li>표시·광고에 관한 기록 (전자상거래법): 6개월</li>
          <li>접속에 관한 기록 (통신비밀보호법): 3개월</li>
        </ul>
      </Section>

      <Section title="4. 개인정보의 파기절차 및 방법">
        <p>
          이용자가 회원 탈퇴를 요청하거나 수집·이용목적이 달성된 개인정보는 지체 없이 파기합니다. 전자적 파일 형태는
          복구 불가능한 방법으로 영구 삭제하며, 서면으로 출력된 개인정보는 분쇄기로 분쇄하거나 소각합니다.
        </p>
      </Section>

      <Section title="5. 개인정보의 제3자 제공">
        <p>
          회사는 이용자의 개인정보를 원칙적으로 외부에 제공하지 않습니다. 다만 아래의 경우는 예외로 합니다.
        </p>
        <ul className="list-disc space-y-1 pl-5">
          <li>이용자가 사전에 동의한 경우</li>
          <li>법령의 규정에 의거하거나, 수사 목적으로 법령에 정해진 절차와 방법에 따라 수사기관의 요구가 있는 경우</li>
        </ul>
      </Section>

      <Section title="6. 개인정보처리의 위탁">
        <p>회사는 원활한 서비스 제공을 위해 아래와 같이 개인정보 처리업무를 위탁하고 있습니다.</p>
        <ul className="list-disc space-y-1 pl-5">
          <li>Supabase, Inc. — 회원 데이터베이스 및 인증·저장소 운영</li>
          <li>Vercel Inc. — 웹서비스 호스팅 및 배포</li>
          <li>카카오, 구글 — 소셜 로그인(간편 가입/로그인) 처리</li>
        </ul>
        <p>회사는 위탁계약 체결 시 개인정보보호법 제26조에 따라 위탁업무 수행목적 외 개인정보 처리금지, 기술적·관리적 보호조치 등을 명시하고 있습니다.</p>
      </Section>

      <Section title="7. 이용자의 권리와 행사방법">
        <p>
          이용자는 언제든지 등록되어 있는 자신의 개인정보를 조회하거나 수정할 수 있으며, 마이페이지 &rsaquo; 설정·보안
          &rsaquo; 회원 탈퇴를 통해 개인정보의 수집·이용 동의를 철회(회원 탈퇴)할 수 있습니다. 회원 탈퇴 시 관련 법령에
          따라 보존해야 하는 정보를 제외한 모든 개인정보는 지체 없이 파기됩니다.
        </p>
      </Section>

      <Section title="8. 개인정보의 안전성 확보조치">
        <p>
          회사는 비밀번호 암호화, 접근권한 관리, 접속기록 보관, 데이터베이스 접근 통제 등 개인정보의 안전성 확보를 위해
          필요한 기술적·관리적 조치를 취하고 있습니다.
        </p>
      </Section>

      <Section title="9. 쿠키(Cookie)의 운영">
        <p>
          회사는 이용자에게 최적화된 서비스를 제공하기 위해 로그인 유지 등의 목적으로 쿠키를 사용할 수 있습니다.
          이용자는 브라우저 설정을 통해 쿠키 저장을 거부할 수 있으며, 이 경우 서비스 이용에 제약이 있을 수 있습니다.
        </p>
      </Section>

      <Section title="10. 개인정보 보호책임자">
        <p>
          회사는 개인정보 처리에 관한 업무를 총괄해서 책임지고, 개인정보 처리와 관련한 이용자의 불만처리 및 피해구제
          등을 위하여 아래와 같이 개인정보 보호책임자를 지정하고 있습니다.
        </p>
        <ul className="list-disc space-y-1 pl-5">
          <li>성명: {b.privacyOfficerName}</li>
          <li>연락처: {b.privacyOfficerContact}</li>
        </ul>
      </Section>

      <Section title="11. 고지의 의무">
        <p>
          본 개인정보처리방침의 내용 추가·삭제 및 수정이 있을 경우 개정 최소 7일 전부터 서비스 내 공지사항을 통해
          고지합니다. 다만 이용자 권리의 중요한 변경이 있을 경우에는 최소 30일 전에 고지합니다.
        </p>
      </Section>

      <Section title="사업자 정보">
        <ul className="list-disc space-y-1 pl-5">
          <li>상호: {b.companyName}</li>
          <li>대표자: {b.representativeName}</li>
          <li>사업자등록번호: {b.businessRegistrationNumber}</li>
          <li>통신판매업 신고번호: {b.mailOrderRegistrationNumber}</li>
          <li>사업장 주소: {b.address}</li>
          <li>고객센터: {b.customerServiceContact}</li>
        </ul>
      </Section>

      <p className="mt-10 border-t border-border pt-4 text-xs text-fg-subtle">
        공고일자: 2026년 8월 16일 / 시행일자: 2026년 8월 16일
      </p>
    </div>
  );
}
