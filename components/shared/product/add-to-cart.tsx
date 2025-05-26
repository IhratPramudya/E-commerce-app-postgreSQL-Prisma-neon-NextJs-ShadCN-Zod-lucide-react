"use client";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import { CartItem } from "@/types";
import { Toaster, toast } from 'sonner'
import { addItemToCart } from "@/lib/actions/cart.actions";


const AddToCart = ({ item }: { item: CartItem }) => {
    const router = useRouter();
    
    const handleAddToCart = async () => {
        const res = await addItemToCart(item);
        console.log(res)

        if (!res.success) {
            toast.message('Information', {
                description: res.message
            })
            return
        }


        toast.message('Information', {
            description: `${item.name} add to cart`,
            action: <Button className="bg-primary text-white hover:bg-gray-800" 
            onClick={() => router.push('/cart')}>Go to cart</Button>
        })
    }

    return <Button className="w-full" type="button" 
    onClick={handleAddToCart}><Plus /> Add to Cart</Button>
}

export default AddToCart;
