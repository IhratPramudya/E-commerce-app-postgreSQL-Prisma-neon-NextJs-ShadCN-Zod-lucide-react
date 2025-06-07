'use client';
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useTransition, useState } from "react";
import { addItemToCart } from "@/lib/actions/cart.actions";
import { ArrowRight, Loader, Minus, Plus } from "lucide-react";
import { Cart } from "@/types";
import Link from "next/link";
import Image from "next/image";

interface Item {
  id: number;
  quantity: number;
}

interface AddPageProps {
  cart?: Cart | null;
}

const CartTable: React.FC<AddPageProps> = ({ cart }) => {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();
    const [items, setItems] = useState<Item[]>([]);

    const handleQuantityChange = (id: number, amount: number) => {
      setItems(
        items.map(item => {
          if (item.id === id) {
            // Pastikan jumlah tidak kurang dari 1
            const newQuantity = Math.max(1, item.quantity + amount);
            return { ...item, quantity: newQuantity };
          }
          return item;
        })
      );
    };

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
                      onClick={() => handleQuantityChange(Number(item.productId), -1)}
                      className="px-3 py-1 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
                      aria-label="Kurangi kuantitas"
                    >
                      -
                    </button>
                    <span className="text-lg font-medium w-8 text-center">{item.qty}</span>
                    <button
                      onClick={() => handleQuantityChange(Number(item.productId), 1)}
                      className="px-3 py-1 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
                      aria-label="Tambah kuantitas"
                    >
                      +
                    </button>
                  </div>
        
                  {/* Bagian Total Harga per Item */}
                  <div className="text-right w-full ml-6 md:w-auto">
                    <p className="font-bold text-gray-800">
                      Rp {(Number(item.price) * item.qty).toLocaleString('id-ID')}
                    </p>
                  </div>
                </div>
              ))}
            </div>
        )}
    </>
}

export default CartTable;
