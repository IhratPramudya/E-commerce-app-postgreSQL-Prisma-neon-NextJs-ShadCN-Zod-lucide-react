

// import { toast as sonnerToast, toast } from "sonner";

// export type ToastVariant = 'default' | 'destructive' | 'success' | 'info' | 'warning';

// export interface CustomToastOptions {
//     description?: string;
//     duration?: number;
//     action?: {
//         label: string;
//         onClick: () => void;
//     };
// // Tambahkan opsi lain dari sonner yang ingin Anda dukung
// }

// const showCustomToast = (
//     title: string,
//     options: CustomToastOptions & { variant: ToastVariant }
// ) => {
//     const { variant, description, duration, action } = options;

//     console.log(variant)

//     const sonnerOptions = {
//         description,
//         duration,
//         action,
//         variant
//     }

//     switch (sonnerOptions.variant) {
//         case 'success':
//             sonnerToast.success(title, sonnerOptions);
//             break;
//         case 'destructive':
//             sonnerToast.error(title, sonnerOptions);
//             break;
//         case 'info':
//             sonnerToast.info(title, sonnerOptions);
//             break;
//         case 'warning':
//             sonnerToast.warning(title, sonnerOptions);
//             break;
//         case 'default':
//             sonnerToast(title, sonnerOptions);
//             break;
//         default:
//             sonnerToast(title, sonnerOptions)
//             break;
//     }
// }


const FullPaymentPage = () => {
    // const router = useRouter();
    // const [method, setMethod] = useState("");
    // const [loading, setLoading] = useState(false);
    // const [cardData, setCardData] = useState({ number: "", name: "", exp: "", cvv: "" });
    // const [bank, setBank] = useState(null);
    // const [wallet, setWallet] = useState(null);

    // const paymentOptions = [
    //         { id: "credit", label: "Credit / Debit Card" },
    //         { id: "bank", label: "Bank Transfer" },
    //         { id: "e-wallet", label: "E-Wallet (OVO, Dana, Gopay)" },
    //         { id: "qris", label: "QRIS" },
    //         { id: "cod", label: "Cash On Delivery" },
    // ];


    // const handleSubmit = () => {
    //     if(!method) {
    //         showCustomToast("Please select a payment method", { variant: "destructive" });
    //     }
    // }

    return <>
        <main className="max-w-lg mx-auto p-4 space-y-6">
            <h1 className="text-2xl font-bold">Metode Pembayaran Lengkap</h1>
            <p className="text-gray-500 text-sm">Pilih metode pembayaran lalu isi data yang diperlukan.</p>

        <section className="space-y-3">
        </section>

        </main>
  </>
}


export default FullPaymentPage;