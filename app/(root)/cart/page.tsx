"use client";

import { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { MinusCircle, PlusCircle, Trash2, ShoppingBag, XCircle } from "lucide-react";
import { useRouter } from "next/router";
import { CartItem } from "@/types";
import { getMyCart } from "@/lib/actions/cart.actions";

// Definisikan item untuk keranjang dan keranjang

interface Cart {
    sessionCartId: string;
    itemsPrice: string;
    totalPrice: string;
    shippingPrice: string;
    taxPrice: string;
    items: CartItem[];
    userId?: string | null | undefined;
}

const CartPage: NextPage = () => {
    const [cart, setCart] = useState<Cart | null>(null);
    const [ isLoading, setLoading] = useState(true);


    const loadCart = async () => {
        setLoading(true);
        const cartData = await getMyCart()
        setCart(cartData);
        setLoading(false);
    };


    useEffect(() => {
        loadCart();
    }, [])


    if (isLoading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (!cart || cart.items.length == 0) {
        return (
            <>
                <Head>
                    <title>Keranjang Belanja Kosong</title>
                </Head>
                <div className="container mx-auto px-4 py-12 text-center min-h-[calc(100vh-200px)] flex flex-col justify-center items-center">
                    <ShoppingBag size={80} className="text-gray-300 mb-6" />
                    <h1 className="text-3xl font-semibold text-gray-700 mb-4">Keranjang Belanja Anda Kosong</h1>
                    <p className="text-gray-500 mb-8">Sepertinya Anda belum menambahkan item apapun di keranjang</p>
                    {/* <Button onClick={() => router.push('/')} className="bg-primary text-white hover:bg-primary/90">
                        Mulai Belanja
                    </Button> */}
                </div>
            </>
        )
    }

    return (
        <>
            <Head>
                <title>Keranjang Belanja Anda ({ cart.items.length })</title>
            </Head>
            <div className="bg-gray-50 min-h-screen py-8 md:py-12">
                <div className="container mx-auto px-4">
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-8 md:mb-12 text-center">
                        Keranjang Belanja Anda
                    </h1>

                    <div className="flex flex-col lg:flex-row gap-8">
                        { /* Daftar Item Keranjang */ }
                        <div className="lg:w-2/3 bg-white p-6 shadow-lg rounded-xl">
                            <div className="flex justify-between items-center mb-6 pb-4 border-b">
                                <h2 className="text-xl font-semibold text-gray-700">
                                    {cart.items.length} Item
                                </h2>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default CartPage;