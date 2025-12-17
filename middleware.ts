import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // 1. Ambil Cookie
  const token = request.cookies.get("token")?.value;
  const userCookie = request.cookies.get("user_profile")?.value;

  const pathname = request.nextUrl.pathname;

  // --- DEBUGGING (Lihat di Terminal VS Code) ---
  console.log(
    `[Middleware] Path: ${pathname} | Token: ${token ? "Ada" : "Kosong"}`
  );

  // 2. Tentukan Route
  const isAuthPage =
    pathname.startsWith("/login") || pathname.startsWith("/register");
  const isProtectedPage =
    pathname.startsWith("/dashboard") || pathname.startsWith("/admin");
  const isAdminPage = pathname.startsWith("/admin");

  // SKENARIO A: Belum Login tapi coba masuk halaman rahasia
  if (isProtectedPage && !token) {
    console.log("⛔ Akses Ditolak: Belum login, redirect ke /login");
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // SKENARIO B: Sudah Login tapi coba buka halaman Login/Register
  if (isAuthPage && token) {
    // Cek Role untuk redirect yang tepat
    if (userCookie) {
      try {
        const user = JSON.parse(userCookie);
        if (user.role === "admin") {
          return NextResponse.redirect(
            new URL("/admin/dashboard", request.url)
          );
        } else {
          return NextResponse.redirect(new URL("/dashboard", request.url));
        }
      } catch (e) {
        // Jika JSON user rusak, biarkan di login tapi hapus cookie (opsional)
        return NextResponse.next();
      }
    }
    // Default jika role tidak terbaca
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // SKENARIO C: Cek Akses Admin (Proteksi Role)
  if (isAdminPage && token && userCookie) {
    try {
      const user = JSON.parse(userCookie);
      if (user.role !== "admin") {
        console.log("⛔ Akses Ditolak: User biasa coba masuk admin");
        return NextResponse.redirect(new URL("/dashboard", request.url));
      }
    } catch (e) {
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/dashboard/:path*", "/login", "/register"],
};
