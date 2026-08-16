"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ADMIN_COOKIE_NAME, sha256Hex } from "@/lib/adminAuth";

export async function loginAction(formData: FormData) {
  const password = String(formData.get("password") ?? "");
  const next = String(formData.get("next") ?? "/admin");
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminPassword || password !== adminPassword) {
    redirect(`/admin/login?error=1&next=${encodeURIComponent(next)}`);
  }

  const cookieStore = await cookies();
  cookieStore.set(ADMIN_COOKIE_NAME, await sha256Hex(adminPassword), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
  redirect(next);
}

export async function logoutAction() {
  const cookieStore = await cookies();
  cookieStore.delete(ADMIN_COOKIE_NAME);
  redirect("/admin/login");
}
