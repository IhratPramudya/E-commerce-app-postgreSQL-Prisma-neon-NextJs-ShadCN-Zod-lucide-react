"use client";

import { use, useState } from "react";
import Script from "next/script";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { savePaymentMethod } from "@/lib/actions/payment.actions";
import { CreditCard, Loader2 } from "lucide-react";

// Skema Form UI Lokal
const formSchema = z.object({
    cardNumber: z.string().min(16).max(16),
    expMonth: z.string().min(2).max(2),
    expYear: z.string().min(4).max(4),
    cvv: z.string().min(3).max(4),
    holderName: z.string().min(3),
});


export default function PaymentForm() {
    const [isLoading, setIsLoading] = useState(false);
    const { register, handleSubmit, formState: { errors }, reset } = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema)
    });


    const onSubmit = async (data: z.infer<typeof formSchema>) => {
        setIsLoading(true);

        // Pastikan Midtrans SDK sudah ter-load
        if (typeof window === "undefined" || !(window as any).midtrans) {
            toast.error("Sistem pembayaran belum siap.");
            setIsLoading(false);
            return;
        }

        const midtrans = (window as any).midtrans;
        midtrans.clientKey = process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY;

        const cardData = {
            card_number: data.cardNumber,
            card_exp_month: data.expMonth,
            card_exp_year: data.expYear,
            card_cvv: data.cvv
        }

        // 1. Dapatkan Token dari Midtrans
        midtrans.getCardToken(cardData, async (result:any) => {
            if (result.status_code === "200") {
                const tokenId = result.token_id;

                // 2. Ekstrak Metadata
                const last4 = data.cardNumber.slice(-4);
                // Menentukan brand sederhana (Visa = 4, Mastercard = 5). Diproduction gunakan  library "card-validator"
                const brand = data.cardNumber.startsWith("4") ? "visa" : "mastercard";

                // 3. Simpan ke Database via Server Action
                const res = await savePaymentMethod({
                    token: tokenId,
                    brand,
                    last4,
                    expMonth: parseInt(data.expMonth),
                    expYear: parseInt(data.expYear),
                    holderName: data.holderName
                });

                if (res.success) {
                    toast.success("Kartu berhasil ditambahkan!");
                    reset();
                } else {
                    toast.error(res.error ||"Gagal menyimpan kartu");
                }
            } else {
                toast.error(result.validation_messages?.[0] || "Validasi kartu gagal dari Midtrans.");
            }
            setIsLoading(false);
        })
    }

    const isProduction = process.env.NEXT_PUBLIC_MIDTRANS_IS_PRODUCTION === "true";
    const midtransJsUrl = isProduction 
    ? "[https://api.midtrans.com/v2/assets/js/midtrans.min.js](https://api.midtrans.com/v2/assets/js/midtrans.min.js)" 
    : "[https://api.sandbox.midtrans.com/v2/assets/js/midtrans.min.js](https://api.sandbox.midtrans.com/v2/assets/js/midtrans.min.js)";

    return (
        <div className="max-w-md w-full p-6 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-sm">
        {/* Script untuk inisialisasi Midtrans JS */}
        <Script src={midtransJsUrl} strategy="lazyOnload" />

        <div className="flex items-center gap-2 mb-6 text-zinc-900 dark:text-zinc-100">
            <CreditCard className="w-6 h-6" />
            <h2 className="text-lg font-semibold">Tambah Kartu Pembayaran</h2>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
            <label className="block text-sm font-medium mb-1">Nama Pemegang Kartu</label>
            <input
                {...register("holderName")}
                className="w-full p-2 border rounded-md dark:bg-zinc-900 dark:border-zinc-700 focus:ring-2 focus:ring-blue-500 outline-none transition"
                placeholder="John Doe"
            />
            {errors.holderName && <span className="text-red-500 text-xs">{errors.holderName.message}</span>}
            </div>

            <div>
            <label className="block text-sm font-medium mb-1">Nomor Kartu</label>
            <input
                {...register("cardNumber")}
                maxLength={16}
                className="w-full p-2 border rounded-md dark:bg-zinc-900 dark:border-zinc-700 focus:ring-2 focus:ring-blue-500 outline-none transition"
                placeholder="4000000000000000"
            />
            {errors.cardNumber && <span className="text-red-500 text-xs">{errors.cardNumber.message}</span>}
            </div>

            <div className="flex gap-4">
            <div className="w-1/3">
                <label className="block text-sm font-medium mb-1">Bulan (MM)</label>
                <input
                {...register("expMonth")}
                maxLength={2}
                className="w-full p-2 border rounded-md dark:bg-zinc-900 dark:border-zinc-700 focus:ring-2 focus:ring-blue-500 outline-none transition"
                placeholder="12"
                />
            </div>
            <div className="w-1/3">
                <label className="block text-sm font-medium mb-1">Tahun (YYYY)</label>
                <input
                {...register("expYear")}
                maxLength={4}
                className="w-full p-2 border rounded-md dark:bg-zinc-900 dark:border-zinc-700 focus:ring-2 focus:ring-blue-500 outline-none transition"
                placeholder="2026"
                />
            </div>
            <div className="w-1/3">
                <label className="block text-sm font-medium mb-1">CVV</label>
                <input
                {...register("cvv")}
                maxLength={4}
                type="password"
                className="w-full p-2 border rounded-md dark:bg-zinc-900 dark:border-zinc-700 focus:ring-2 focus:ring-blue-500 outline-none transition"
                placeholder="123"
                />
            </div>
            </div>

            <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-100 dark:hover:bg-zinc-200 dark:text-zinc-900 text-white font-medium py-2.5 rounded-md flex justify-center items-center gap-2 transition disabled:opacity-70"
            >
            {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Simpan Kartu"}
            </button>
        </form>
        </div>
    );
}