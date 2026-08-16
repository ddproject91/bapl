import type { Metadata } from "next";
import { BUSINESS_INFO } from "@/lib/businessInfo";

export const metadata: Metadata = {
  title: "이용약관",
};

function Article({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-8">
      <h2 className="mb-2 text-base font-bold text-fg">{title}</h2>
      <div className="space-y-2 text-sm leading-relaxed text-fg-muted">{children}</div>
    </section>
  );
}

export default function TermsPage() {
  const b = BUSINESS_INFO;
  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-2xl font-black tracking-tight">이용약관</h1>

      <Article title="제1조 (목적)">
        <p>
          이 약관은 {b.companyName}(이하 &ldquo;회사&rdquo;)가 운영하는 {b.serviceName}(이하 &ldquo;서비스&rdquo;)의
          이용과 관련하여 회사와 회원 간의 권리, 의무 및 책임사항, 기타 필요한 사항을 규정함을 목적으로 합니다.
        </p>
      </Article>

      <Article title="제2조 (정의)">
        <ul className="list-disc space-y-1 pl-5">
          <li>&ldquo;서비스&rdquo;란 회사가 제공하는 바이크 커뮤니티·정보·거래 관련 일체의 서비스를 의미합니다.</li>
          <li>&ldquo;회원&rdquo;이란 이 약관에 동의하고 회사와 서비스 이용계약을 체결한 자를 말합니다.</li>
          <li>&ldquo;게시물&rdquo;이란 회원이 서비스에 게시한 문자, 사진, 동영상 등의 정보를 말합니다.</li>
        </ul>
      </Article>

      <Article title="제3조 (약관의 게시와 개정)">
        <p>
          회사는 이 약관의 내용을 회원이 알 수 있도록 서비스 초기 화면 또는 연결화면에 게시합니다. 회사는 관련
          법령을 위배하지 않는 범위에서 이 약관을 개정할 수 있으며, 개정 시 적용일자 및 개정사유를 명시하여 최소
          7일 전부터 공지합니다. 회원에게 불리한 개정의 경우 30일 전에 공지합니다.
        </p>
      </Article>

      <Article title="제4조 (서비스의 제공 및 변경)">
        <p>
          회사는 브랜드/모델 정보, 커뮤니티, 라이딩, 마켓(중고거래), 정비/관리, 마이페이지 등의 서비스를 제공합니다.
          회사는 서비스의 내용, 운영상·기술상 필요에 따라 제공하는 서비스의 전부 또는 일부를 변경할 수 있습니다.
        </p>
      </Article>

      <Article title="제5조 (서비스의 중단)">
        <p>
          회사는 컴퓨터 등 정보통신설비의 보수점검·교체·고장, 통신두절 등의 사유가 발생한 경우 서비스 제공을
          일시적으로 중단할 수 있으며, 사전에 예고할 수 없는 부득이한 사유가 있는 경우 사후에 통지할 수 있습니다.
        </p>
      </Article>

      <Article title="제6조 (회원가입)">
        <p>
          회원가입은 이용자가 약관 내용에 동의하고 회사가 정한 가입 양식에 따라 정보를 기입한 후 가입을 신청하며,
          회사가 이러한 신청에 승낙함으로써 체결됩니다. 회사는 다음 각 호에 해당하는 신청에 대하여는 승낙하지
          않거나 사후에 이용계약을 해지할 수 있습니다.
        </p>
        <ul className="list-disc space-y-1 pl-5">
          <li>타인의 명의를 이용하여 신청한 경우</li>
          <li>허위의 정보를 기재하거나 회사가 요구하는 내용을 기재하지 않은 경우</li>
          <li>이전에 회원자격을 상실한 적이 있는 경우 (재가입 승낙을 받은 경우 예외)</li>
        </ul>
      </Article>

      <Article title="제7조 (회원 탈퇴 및 자격 상실)">
        <p>
          회원은 마이페이지 &rsaquo; 설정·보안 &rsaquo; 회원 탈퇴를 통해 언제든지 이용계약 해지를 신청할 수 있으며,
          회사는 관련 법령이 정하는 바에 따라 즉시 이를 처리합니다. 회원 탈퇴 시 게시글·댓글 등 회원이 작성한
          정보는 원칙적으로 함께 삭제되나, 다른 회원이 인용·재게시한 내용 및 관련 법령에 따라 보존이 필요한 정보는
          삭제되지 않을 수 있습니다.
        </p>
        <p>
          회원이 이 약관 및 관계 법령을 위반한 경우, 회사는 사전 통지 후 서비스 이용을 제한하거나 회원자격을
          상실시킬 수 있습니다.
        </p>
      </Article>

      <Article title="제8조 (게시물의 관리)">
        <p>
          회원이 작성한 게시물이 관계 법령 및 이 약관에 위반되는 내용을 포함한다고 판단되는 경우, 회사는 관계
          법령이 정하는 절차에 따라 해당 게시물에 대해 임시조치, 삭제, 게시중단 등을 취할 수 있습니다.
        </p>
      </Article>

      <Article title="제9조 (저작권의 귀속 및 이용제한)">
        <p>
          회원이 서비스 내에 게시한 게시물의 저작권은 해당 게시물의 저작자(회원)에게 귀속됩니다. 회원은 게시물을
          서비스 내에서 게시함으로써 회사에게 서비스의 운영, 전시, 홍보를 위한 범위 내에서 게시물을 사용(복제,
          수정, 전송 등)할 수 있는 권리를 부여한 것으로 봅니다. 회사는 회원의 사전 동의 없이 게시물을 영리적
          목적으로 제3자에게 제공하지 않습니다.
        </p>
      </Article>

      <Article title="제10조 (회원의 의무)">
        <ul className="list-disc space-y-1 pl-5">
          <li>신청 또는 변경 시 허위 내용을 등록하지 않습니다.</li>
          <li>타인의 정보를 도용하거나 부정하게 사용하지 않습니다.</li>
          <li>회사가 게시한 정보를 변경하거나, 서비스를 이용해 얻은 정보를 무단으로 복제·배포하지 않습니다.</li>
          <li>타인의 명예를 훼손하거나 모욕하는 게시물, 음란물, 불법정보를 게시하지 않습니다.</li>
          <li>다른 회원의 개인정보(번호판, 얼굴 등)를 본인 동의 없이 게시하지 않습니다.</li>
        </ul>
      </Article>

      <Article title="제11조 (마켓 거래 관련 특칙)">
        <p>
          회사는 회원 간 중고 물품 거래를 위한 정보 게시 공간(마켓)을 제공하는 통신판매중개자이며, 거래 당사자가
          아닙니다. 회사는 통신판매업 신고를 하였으나(신고번호 {b.mailOrderRegistrationNumber}), 회원 간 거래에
          직접 개입하지 않으며, 상품 정보의 정확성, 거래 당사자 간의 채무불이행, 분쟁에 대하여 원칙적으로 책임을
          지지 않습니다. 다만 회사는 안전한 거래를 위한 정책(신고, 인증 뱃지 등)을 운영하며 필요한 경우 이용을
          제한할 수 있습니다.
        </p>
      </Article>

      <Article title="제12조 (면책조항)">
        <p>
          회사는 천재지변, 회원의 귀책사유 등 회사가 통제할 수 없는 사유로 인한 서비스 중단에 대해 책임을 지지
          않습니다. 회사는 회원이 서비스를 이용하여 기대하는 효용을 얻지 못한 것이나, 회원이 게시한 정보의
          신뢰도·정확성에 대해 책임을 지지 않습니다.
        </p>
      </Article>

      <Article title="제13조 (분쟁해결 및 재판관할)">
        <p>
          회사와 회원 간 발생한 분쟁에 관하여는 대한민국 법을 적용하며, 분쟁이 소송으로 제기될 경우 민사소송법상의
          관할법원에 제기합니다.
        </p>
      </Article>

      <section className="mt-8 border-t border-border pt-5">
        <h2 className="mb-2 text-base font-bold text-fg">사업자 정보</h2>
        <ul className="list-disc space-y-1 pl-5 text-sm leading-relaxed text-fg-muted">
          <li>상호: {b.companyName}</li>
          <li>대표자: {b.representativeName}</li>
          <li>사업자등록번호: {b.businessRegistrationNumber}</li>
          <li>통신판매업 신고번호: {b.mailOrderRegistrationNumber}</li>
          <li>사업장 주소: {b.address}</li>
          <li>고객센터·제휴 문의: {b.customerServiceContact}</li>
        </ul>
      </section>

      <p className="mt-10 border-t border-border pt-4 text-xs text-fg-subtle">
        공고일자: 2026년 8월 16일 / 시행일자: 2026년 8월 16일
      </p>
    </div>
  );
}
