'use server';

import { CartItem } from "@/types";
import { formatError } from "../utils";
import { cookies } from "next/headers";

export async function addItemToCart(data: CartItem) {
    try {
        // Check for cart cookie 
        const sessionCartId = (await cookies()).get('sessionCartId')?.value;

        // TESTING
        console.log({
            'Session Cart ID': sessionCartId,
        })

        return {
            success: true,
            message: 'Item added to cart',
        };
    } catch (error) {
        return {
            success: false,
            message: formatError
        }
    }
}