'use client';
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useTransition } from "react";
import { Cart } from "@/types"; 

interface AddPageProps {
  cart?: Cart | null;
}

const CartTable: React.FC<AddPageProps> = ({ cart }) => {
    return <>
        <h1 className="py-4 h2-bold">Shopping Cart</h1>
    </>
}

export default CartTable;
