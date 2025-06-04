"use client";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Plus, Minus } from "lucide-react";
import { Toaster, toast as sonnerToast } from 'sonner';
import { addItemToCart, removeItemFromCart } from "@/lib/actions/cart.actions";



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


type ToastVariant = 'default' | 'destructive' | 'success' | 'info' | 'warning';

interface CustomToastOptions {
    description?: string;
    duration?: number;
    action?: {
        label: string;
        onClick: () => void;
    };
// Tambahkan opsi lain dari sonner yang ingin Anda dukung
}


const showCustomToast = (
    title: string,
    options: CustomToastOptions & { variant: ToastVariant }
) => {
    const { variant, description, duration, action } = options;


    const sonnerOptions = {
        description,
        duration,
        action
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
    
    const handleAddToCart = async () => {
        const res = await addItemToCart(item);
        console.log(res)

        if (!res.success) {
            sonnerToast.message('Information', {
                description: res.message
            })
            return
        }


        sonnerToast.message("Informasi Untuk Menambahkan Cart", {
            description: `${item.name} add to cart`,
            action: <Button className="bg-primary text-white hover:bg-gray-800" 
            onClick={() => router.push('/cart')}>Go to cart</Button>
        })
    };



    // Handle remove from cart
    const handleRemoveFromCart = async () => {
        const res = await removeItemFromCart(item.productId);


        showCustomToast('Informasi Sistem', {
            variant: res.success ? 'success' : 'destructive', // Logika variant Anda
            duration: res.success ? 3000 : 5000,
        });
    }

    // Check if item is in cart
    const existItem = cart && cart.items.find((x) => x.productId === item.productId);

    return existItem ? (
        <div>
            <Button 
                type="button" 
                variant="outline"
                onClick={handleRemoveFromCart} >
                <Minus className="h-4 w-4"/>
            </Button>
            <span className="px-2">{existItem.qty}</span>
            <Button 
                type="button"
                variant="outline"
                onClick={handleAddToCart}
                >
                <Plus className="h-4 w-4" />
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


