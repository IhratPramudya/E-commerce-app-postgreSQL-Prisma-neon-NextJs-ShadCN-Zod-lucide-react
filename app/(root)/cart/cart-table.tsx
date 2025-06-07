'use client';
import { useRouter } from "next/navigation";
import { useTransition, useState } from "react";
import { addItemToCart, removeItemFromCart } from "@/lib/actions/cart.actions";
import { ArrowRight, Loader, Minus, Plus } from "lucide-react";
import { Cart, CartItem } from "@/types";
import Link from "next/link";
import Image from "next/image";
import { CustomToastOptions, ToastVariant } from "@/components/shared/product/add-to-cart";
import { Toaster, toast as sonnerToast } from 'sonner';

interface Item {
  id: number;
  quantity: number;
}

interface AddPageProps {
  cart?: Cart | null;
  items?: CartItem | null;
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

const CartTable: React.FC<AddPageProps> = ({ cart }) => {
    const router = useRouter();
    const [ isPending, startTransition ] = useTransition();
    
    // const handleAddToCart = async () => {
    //     startTransition(async () => {
    //         const res = await addItemToCart(item);
    //         console.log(res)

    //         if (!res.success) {
    //             sonnerToast.message('Information', {
    //                 description: res.message
    //             })
    //             return
    //         }


    //         showCustomToast("Informasi Untuk Menambahkan Cart", {
    //             description: `${item.name} add to cart`,
    //             action: {
    //                 label: 'Go to cart',
    //                 onClick: () => router.push('/cart'),
    //             },
    //             variant: "info"
    //         });

    //         return;
    //     })
    // };

    // Handle remove from cart
    const handleRemoveFromCart = async (productId: string) => {
        startTransition(async () => {
            const res = await removeItemFromCart(productId);


            showCustomToast('Data berhasil di hapus', {
                variant: res.success ? 'success' : 'destructive', // Logika variant Anda
                duration: 0,
            });

            return;
        })
    }

  
    return <>
        <h1 className="py-4 h2-bold">Shopping Cart</h1>
        { !cart || cart.items.length === 0 ? (
          <div>
            Cart is empty. <Link href='/'>Go Shopping</Link>
          </div>
        ) : (
            <div className="space-y-10 mt-6">
              {cart.items.map(item => (
                
                <div
                  key={item.productId}
                  className="flex flex-col md:flex-row items-center justify-between bg-white p-4 rounded-lg transition-shadow shadow-lg"
                >
                  {/* Bagian Informasi Produk */}
                  <div className="flex-grow mb-4 md:mb-0">
                    <h3 className="text-lg font-semibold text-gray-900">{item.name}</h3>
                    <p className="text-sm text-gray-600">
                      Rp {Number(item.price).toLocaleString('id-ID')}
                    </p>
                  </div>
        
                  {/* Bagian Kontrol Kuantitas */}
                  <div className="flex items-center space-x-4 mb-4 md:mb-0">
                    <button
                      onClick={() => handleRemoveFromCart(String(item.productId))}
                      className="px-3 py-1 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
                      aria-label="Kurangi kuantitas"
                    >
                      -
                    </button>
                    
                    <span className="text-lg font-medium w-8 text-center">{
                      cart && cart.items.find((x) => x.productId === item.productId)?.qty
                      }</span>
                    <button
                      // onClick={() => handleAddToCart()}
                      className="px-3 py-1 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
                      aria-label="Tambah kuantitas"
                    >
                      +
                    </button>
                  </div>
        
                  {/* Bagian Total Harga per Item */}
                  <div className="text-right w-full ml-6 md:w-auto">
                    <p className="font-bold text-gray-800">
                      Rp {(Number(item.price) * (cart?.items.find((x) => x.productId === item.productId)?.qty || 0)).toLocaleString('id-ID')}
                    </p>
                  </div>
                </div>
              ))}
            </div>
        )}
    </>
}

export default CartTable;
