"use client";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Plus, Minus, Loader } from "lucide-react";
import { Toaster, toast as sonnerToast } from 'sonner';
import { addItemToCart, removeItemFromCart } from "@/lib/actions/cart.actions";
import { useTransition } from "react";


interface CartItem {
  productId: string;
  name: string;
  slug: string;
  qty: number;
  image: string;
  price: string; // atau number jika Anda lebih suka mengonversinya
}

interface Cart {
  id: string;
  userId: string | null; // Karena nilainya null di contoh
  sessionCartId: string;
  items: CartItem[];
  itemsPrice: string; // atau number
  totalPrice: string; // atau number
  shippingPrice: string; // atau number
  taxPrice: string; // atau number
  createdAt: string; // atau Date jika Anda lebih suka mengonversinya
}

interface AddToCartProps {
  cart?: Cart | null; // Izinkan null
  item: CartItem;
}


export type ToastVariant = 'default' | 'destructive' | 'success' | 'info' | 'warning';

export interface CustomToastOptions {
    description?: string;
    duration?: number;
    action?: {
        label: string;
        onClick: () => void;
    };
// Tambahkan opsi lain dari sonner yang ingin Anda dukung
}


export const showCustomToast = (
    title: string,
    options: CustomToastOptions & { variant: ToastVariant }
) => {
    const { variant, description, duration, action } = options;


    const sonnerOptions = {
        description,
        duration,
        action,
        variant 
    }

    switch (variant) {
        case 'success':
            sonnerToast.success(title, sonnerOptions);
            break;
        case 'destructive':
            sonnerToast.error(title, sonnerOptions);
            break;
        case 'info':
            sonnerToast.info(title, sonnerOptions);
            break;
        case 'warning':
            sonnerToast.warning(title, sonnerOptions);
            break;
        case 'default':
            default:
                sonnerToast(title, sonnerOptions)
                break;
    }
}


const AddToCart: React.FC<AddToCartProps> = ({ cart, item }) => {
    const router = useRouter();

    const [ isPending, startTransition ] = useTransition();
    
    const handleAddToCart = async () => {
        startTransition(async () => {
            const res = await addItemToCart(item);
            console.log(res)

            if (!res.success) {
                sonnerToast.message('Information', {
                    description: res.message
                })
                return
            }


            showCustomToast("Informasi Untuk Menambahkan Cart", {
                description: `${item.name} add to cart`,
                action: {
                    label: 'Go to cart',
                    onClick: () => router.push('/cart'),
                },
                variant: "info"
            });

            return;
        })
    };



    // Handle remove from cart
    const handleRemoveFromCart = async () => {
        startTransition(async () => {
            const res = await removeItemFromCart(item.productId);


            showCustomToast('Data berhasil di hapus', {
                variant: res.success ? 'success' : 'destructive', // Logika variant Anda
                duration: 0,
            });

            return;
        })
    }

    // Check if item is in cart
    const existItem = cart && cart.items.find((x) => x.productId === item.productId);

    return existItem ? (
        <div>
            <Button 
                type="button" 
                variant="outline"
                onClick={handleRemoveFromCart} >
                { isPending ? (<Loader className="w-4 h-4 animate-spin" />) : 
                (<Minus className="w-4 h-4 " />) }
            </Button>
            <span className="px-2">{existItem.qty}</span>
            <Button 
                type="button"
                variant="outline"
                onClick={handleAddToCart}
                >       
                { isPending ? (<Loader className="w-4 h-4 animate-spin" />) : 
                (<Plus className="h-4 w-4" />) }
            </Button>
        </div>
    ) : (
        <Button 
            className="w-full" 
            type="button" 
            onClick={handleAddToCart}><Plus />
            Add to Cart
        </Button>
    )
}

export default AddToCart;


