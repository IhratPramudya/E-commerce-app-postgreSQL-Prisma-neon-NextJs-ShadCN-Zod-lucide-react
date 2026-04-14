"use client";

import { useState, useEffect } from "react";
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
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);
  
  const { register, handleSubmit, formState: { errors }, reset } = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  useEffect(() => {
    // Hindari duplikasi script jika komponen di-render ulang
    if (document.getElementById("midtrans-script")) {
      setIsScriptLoaded(true);
      return;
    }

    const isProduction = process.env.NEXT_PUBLIC_MIDTRANS_IS_PRODUCTION === "true";
    
    // SOLUSI FINAL: Menggunakan Template Literal (Backtick) untuk merakit URL.
    // Trik ini mencegah teks diubah menjadi tautan rusak oleh formatter editor.
    const domain = isProduction ? "api.midtrans.com" : "api.sandbox.midtrans.com";
    const scriptUrl = `https://${domain}/v2/assets/js/midtrans.min.js`;

    const script = document.createElement("script");
    script.id = "midtrans-script";
    script.src = scriptUrl;
    script.setAttribute("data-client-key", process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY || "");
    
    script.onload = () => {
      console.log("Midtrans script berhasil dimuat!");
      setIsScriptLoaded(true);
    };
    
    script.onerror = () => {
      console.error("Gagal memuat script Midtrans. Matikan AdBlock Anda!");
      toast.error("Gagal memuat sistem pembayaran. Harap matikan AdBlock.");
    };

    document.body.appendChild(script);

    return () => {
      const existingScript = document.getElementById("midtrans-script");
      if (existingScript) {
        document.body.removeChild(existingScript);
      }
    };
  }, []);

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    setIsLoading(true);

    if (!isScriptLoaded || typeof window === "undefined" || !(window as any).midtrans) {
      toast.error("Sistem pembayaran belum siap. Silakan tunggu atau muat ulang.");
      setIsLoading(false);
      return;
    }

    const midtrans = (window as any).midtrans;
    midtrans.clientKey = process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY;

    const cardData = {
      card_number: data.cardNumber,
      card_exp_month: data.expMonth,
      card_exp_year: data.expYear,
      card_cvv: data.cvv,
    };

    midtrans.getCardToken(cardData, async (result: any) => {
      if (result.status_code === "200") {
        const tokenId = result.token_id;
        
        const last4 = data.cardNumber.slice(-4);
        const brand = data.cardNumber.startsWith("4") ? "visa" : "mastercard";

        const res = await savePaymentMethod({
          token: tokenId,
          brand,
          last4,
          expMonth: parseInt(data.expMonth),
          expYear: parseInt(data.expYear),
          holderName: data.holderName,
        });

        if (res.success) {
          toast.success("Kartu berhasil ditambahkan!");
          reset();
        } else {
          toast.error(res.error || "Gagal menyimpan kartu.");
        }
      } else {
        toast.error(result.validation_messages?.[0] || "Validasi kartu gagal dari Midtrans.");
      }
      setIsLoading(false);
    });
  };

  return (
    <div className="max-w-md w-full p-6 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-sm">
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
          type="button" 
          onClick={handleSubmit(onSubmit)}
          disabled={isLoading || !isScriptLoaded}
          className="w-full bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-100 dark:hover:bg-zinc-200 dark:text-zinc-900 text-white font-medium py-2.5 rounded-md flex justify-center items-center gap-2 transition disabled:opacity-70"
        >
          {!isScriptLoaded ? (
            <span className="flex items-center gap-2"><Loader2 className="w-5 h-5 animate-spin" /> Menyiapkan Pembayaran...</span>
          ) : isLoading ? (
            <span className="flex items-center gap-2"><Loader2 className="w-5 h-5 animate-spin" /> Memproses...</span>
          ) : (
            "Simpan Kartu"
          )}
        </button>
      </form>
    </div>
  );
}
