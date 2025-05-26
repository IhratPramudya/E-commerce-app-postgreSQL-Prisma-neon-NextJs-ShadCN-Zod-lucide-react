// middleware.ts

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {

    let sessionCartId = req.cookies.get("sessionCartId")?.value;
    console.log(sessionCartId);
    console.log("ini type apa", typeof sessionCartId);
    let response = NextResponse.next();


    if (!sessionCartId) {
        const newCartId = crypto.randomUUID()
        
        console.log(`Middleware: No sessionCartId found. Creating new: ${newCartId}`);

        response.cookies.set("sessionCartId", newCartId, {
            httpOnly: true,
            secure: false, // ✅ BENAR
            sameSite: "lax",
            path: "/",
            maxAge: 60 * 60 * 24 * 30, // 30 hari
        });
        sessionCartId = newCartId;

  } else {
    console.log(`Middleware: sessionCartId found: ${sessionCartId}`);
    // Logika penggabungan keranjang dengan user login tetap butuh `auth` dan `prisma`
    // Jika Anda ingin menghilangkan `auth` dari middleware sepenuhnya, logika ini harus dipindahkan
    // ke API Route atau Server Component setelah Anda mendapatkan sesi pengguna.
  }

  // Set header kustom untuk sessionCartId
  // Prefiks 'x-' adalah konvensi untuk header kustom
  response.headers.set('sessionCartId', sessionCartId);

  return response;
}

export const config = {
  // Jalankan middleware di semua rute yang dimulai dengan /api atau /
  // Kecuali rute _next, images, favicon, dll.
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};