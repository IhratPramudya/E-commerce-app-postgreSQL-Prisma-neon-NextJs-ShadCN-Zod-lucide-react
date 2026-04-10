"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { PrismaClient } from "@prisma/client";
import { z } from "zod";

const prisma = new PrismaClient();

const paymentMethodSchema = z.object({
    token: z.string().min(1, "Token Midtrans tidak valid"),
    brand: z.string().min(1),
    last4: z.string().length(4),
    expMonth: z.number().min(1).max(12),
    expYear: z.number().min(2024),
    holderName: z.string().min(3, "Nama pemegang kartu minimal 3 karkter"),
});


export async function savePaymentMethod(data: z.infer<typeof paymentMethodSchema>) {
    try {
        // 1. Verifikasi Autentikasi Pengguna (Zero Trust)
        const session = await auth();
        if (!session?.user?.id) {
            return { success: false, error: "Data pembayaran tidak valid."  };
        }


        // 2. Validasi Payload
        const parseData = paymentMethodSchema.safeParse(data);
        if (!parseData.success) {
            return { success: false, error: "Data pembayaran tidak valid" };
        }

        const { token, brand, last4, expMonth, expYear, holderName } = parseData.data;

        // 3. Pastikan tidak ada token duplikasi
        const existingToken = await prisma.paymentMethod.findUnique({
            where: { token }
        });

        if (existingToken) {
            return { success: false, error: "Kartu ini sudah teraftar." };
        }

        // 4. Reset "isDefault" kartu lama jika perlu (Opsional - Asumsi kartu pertama jadi default)
        const userCardsCount = await prisma.paymentMethod.count({
            where: { userId: session.user.id }
        });

        const isDefault = userCardsCount === 0; // Set kartu pertama sebagai default

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
                isDefault
            }
        });

        // 6. Revalidasi halaman profile/payment agar UI langsung ter-update
        revalidatePath("/profile/payments");

        return  { success: true, paymentMethod };

    } catch (error) {
        console.error("[SAVE_PAYMENT_ERROR]", error);
        return { success: false, error: "Terjadi kesalahan pada server" };
    }
}