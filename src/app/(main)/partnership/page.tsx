import type { Metadata } from "next";
import { PartnershipInquiryForm } from "@/components/partnership/PartnershipInquiryForm";

export const metadata: Metadata = {
  title: "제휴 · 입점 문의",
};

export default function PartnershipPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-6">
      <PartnershipInquiryForm />
    </div>
  );
}
