"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/auth"; // Asumsi konfigurasi NextAuth v5 Anda
import { PrismaClient } from "@prisma/client";
import { z } from "zod";

const prisma = new PrismaClient(); // Gunakan instance Prisma global Anda di aplikasi asli

// Skema validasi menggunakan Zod dengan tipe ketat
const paymentMethodSchema = z.object({
  token: z.string().min(1, "Token Midtrans tidak valid"),
  brand: z.string().min(1),
  last4: z.string().length(4),
  expMonth: z.number().min(1).max(12),
  expYear: z.number().min(2024),
  holderName: z.string().min(3, "Nama pemegang kartu minimal 3 karakter"),
});

export async function savePaymentMethod(data: z.infer<typeof paymentMethodSchema>) {
  try {
    // 1. Verifikasi Autentikasi Pengguna (Zero Trust)
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, error: "Unauthorized" };
    }

    // 2. Validasi Payload
    const parsedData = paymentMethodSchema.safeParse(data);
    if (!parsedData.success) {
      return { success: false, error: "Data pembayaran tidak valid." };
    }

    const { token, brand, last4, expMonth, expYear, holderName } = parsedData.data;

    // 3. Pastikan tidak ada token duplikat
    const existingToken = await prisma.paymentMethod.findUnique({
      where: { token }
    });

    if (existingToken) {
      return { success: false, error: "Kartu ini sudah terdaftar." };
    }

    // 4. Reset 'isDefault' kartu lama jika perlu (Opsional - Asumsi kartu pertama jadi default)
    const userCardsCount = await prisma.paymentMethod.count({
      where: { userId: session.user.id }
    });
    const isDefault = userCardsCount === 0;

    // 5. Simpan ke Database
    const paymentMethod = await prisma.paymentMethod.create({
      data: {
        userId: session.user.id,
        token,
        brand,
        last4,
        expMonth,
        expYear,
        holderName,
        isDefault,
      },
    });

    // 6. Revalidasi halaman profil/payment agar UI langsung ter-update
    revalidatePath("/profile/payments");

    return { success: true, data: paymentMethod };
  } catch (error) {
    console.error("[SAVE_PAYMENT_ERROR]", error);
    return { success: false, error: "Terjadi kesalahan pada server." };
  }
}
