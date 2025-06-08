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
import { getProductBySlug } from "@/lib/actions/product.actions";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

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
    
    const handleAddToCart = async (slug: any) => {
        startTransition(async () => {
            const product = await getProductBySlug(slug)
            const res = await addItemToCart({
              productId: product?.id ?? '',
              name: product?.name ?? '',
              slug: product?.slug ?? '',
              price: String(product?.price ?? 0),
              qty: 1,
              image: product?.images?.[0] ?? ''
            });
            console.log(res)

            if (!res.success) {
                sonnerToast.message('Information', {
                    description: res.message
                })
                return
            }


            showCustomToast("Informasi Untuk Menambahkan Cart", {
                description: `${product?.name} add to cart`,
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
          <div className="grid md:grid-cols-4 md:gap-5">
            <div className="space-y-10 col-span-3">
              {cart.items.map(item => (
                
                <div
                  key={item.productId}
                  className="flex flex-col md:flex-row items-center justify-between bg-white p-4 rounded-lg transition-shadow shadow-lg"
                >
                  <div>
                    <Image src={item.image} alt="product image" width={100} height={100} />
                  </div>
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
                    
                    <span className="text-lg font-medium w-8 text-center bg-gray-400">{
                      cart && cart.items.find((x) => x.productId === item.productId)?.qty
                      }</span>
                    <button
                      onClick={() => handleAddToCart(item.slug)}
                      className="px-3 py-1 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
                      aria-label="Tambah kuantitas"
                    >
                      +
                    </button>
                  </div>
        
                  {/* Bagian Total Harga per Item */}
                  <div className="text-right w-full ml-3 md:w-auto">
                    <p className="font-bold text-gray-800">
                      Rp {(Number(item.price) * (cart?.items.find((x) => x.productId === item.productId)?.qty || 0)).toLocaleString('id-ID')}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <Card>
              <CardContent className="p-4 col-span-1">
                <div className="pb-3 text-xl">
                    Subtotal ({ cart.items.reduce((a, c) => a + c.qty, 0) })
                    <span className="font-bold">
                        RP {cart.itemsPrice.toLocaleString()}
                    </span>
                </div>
                <Button className="w-full" disabled={isPending} onClick={() => 
                  startTransition(() => router.push('/shipping-address'))
                }>
                  {isPending ? (
                    <Loader className="w-4 h-4 animate-spin"/>
                  ) : (
                    <ArrowRight className="w-4 h-4" />
                  )} Proceed to Checkout
                </Button>
              </CardContent>
            </Card>
          </div>
        )}
    </>
}

export default CartTable;
