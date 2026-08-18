import { NextResponse } from "next/server";
import crypto from "node:crypto";

const ALIGO_SEND_URL = "https://apis.aligo.in/send/";

function errorResponse(httpCode: number, message: string) {
  return NextResponse.json({ error: { http_code: httpCode, message } }, { status: httpCode });
}

/** Standard Webhooks 서명 검증 (Supabase Send SMS Hook 규격). */
function verifySignature(payload: string, headers: Headers, secret: string): boolean {
  const id = headers.get("webhook-id");
  const timestamp = headers.get("webhook-timestamp");
  const signatureHeader = headers.get("webhook-signature");
  if (!id || !timestamp || !signatureHeader) return false;

  const secretBase64 = secret.replace(/^v1,/, "").replace(/^whsec_/, "");
  const secretBytes = Buffer.from(secretBase64, "base64");
  const signedContent = `${id}.${timestamp}.${payload}`;
  const expected = crypto.createHmac("sha256", secretBytes).update(signedContent).digest("base64");

  const candidates = signatureHeader
    .split(" ")
    .map((part) => part.split(",")[1])
    .filter((v): v is string => !!v);

  return candidates.some((sig) => {
    try {
      const a = Buffer.from(sig, "base64");
      const b = Buffer.from(expected, "base64");
      return a.length === b.length && crypto.timingSafeEqual(a, b);
    } catch {
      return false;
    }
  });
}

/** 국내 휴대폰 번호로 변환: Supabase는 82101234xxxx(국가코드, + 없음) 형태로 전달한다. */
function toDomesticPhone(phone: string): string {
  return phone.startsWith("82") ? `0${phone.slice(2)}` : phone;
}

export async function POST(request: Request) {
  const secret = process.env.SEND_SMS_HOOK_SECRET;
  if (!secret) {
    return errorResponse(500, "SEND_SMS_HOOK_SECRET이 설정되지 않았습니다.");
  }

  const body = await request.text();
  if (!verifySignature(body, request.headers, secret)) {
    return errorResponse(401, "서명 검증에 실패했습니다.");
  }

  let payload: { user?: { phone?: string }; sms?: { otp?: string } };
  try {
    payload = JSON.parse(body);
  } catch {
    return errorResponse(400, "잘못된 요청 본문입니다.");
  }

  const phone = payload.user?.phone;
  const otp = payload.sms?.otp;
  if (!phone || !otp) {
    return errorResponse(400, "phone 또는 otp가 없습니다.");
  }

  const aligoUserId = process.env.ALIGO_USER_ID;
  const aligoApiKey = process.env.ALIGO_API_KEY;
  const aligoSender = process.env.ALIGO_SENDER_PHONE;
  if (!aligoUserId || !aligoApiKey || !aligoSender) {
    return errorResponse(500, "SMS 발송 업체 환경변수가 설정되지 않았습니다.");
  }

  const form = new URLSearchParams({
    key: aligoApiKey,
    user_id: aligoUserId,
    sender: aligoSender,
    receiver: toDomesticPhone(phone),
    msg: `[BAPL] 인증번호는 ${otp} 입니다.`,
    msg_type: "SMS",
  });

  let aligoResult: { result_code?: number; message?: string };
  try {
    const res = await fetch(ALIGO_SEND_URL, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: form.toString(),
    });
    aligoResult = await res.json();
  } catch {
    return errorResponse(500, "SMS 발송 요청 중 오류가 발생했습니다.");
  }

  if (aligoResult.result_code !== 1) {
    return errorResponse(500, aligoResult.message || "SMS 발송에 실패했습니다.");
  }

  return NextResponse.json({}, { status: 200 });
}
