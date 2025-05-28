'use server';

import { CartItem } from "@/types";
import { formatError, round2 } from "../utils";
import { cookies } from "next/headers";
import { auth } from "@/auth";
import { prisma } from "@/db/prisma";
import { cartItemSchema, insertCartSchema } from "../validators";
import { revalidatePath } from "next/cache";
import { Prisma } from "@prisma/client";

// Calculate cart price 
const calcPrice = (items: CartItem[]) => {
    const itemsPrice = round2(
        items.reduce((acc, item) => acc + Number(item.price) * item.qty, 0)
    )
    
    const shippingPrice = round2(itemsPrice > 100 ? 0 : 100);
    const taxPrice = round2(0.15 * itemsPrice);
    const totalPrice = round2(itemsPrice + taxPrice + shippingPrice);

    return {
        itemsPrice: itemsPrice.toFixed(2),
        shippingPrice: shippingPrice.toFixed(2),
        taxPrice: taxPrice.toFixed(2),
        totalPrice: totalPrice.toFixed(2),
    }
}

export async function addItemToCart(data: CartItem) {
    try {
        // Check for cart cookie 
        const sessionCartId = (await cookies()).get('sessionCartId')?.value;
        console.log("ini sessionCart", sessionCartId)

        if (!sessionCartId)  throw new Error('Cart session not found');

        // Get session and user ID
        const session = await auth()
        const userId = session?.user?.id ? (session.user.id as string) : undefined;


        // Get Cart
        const cart = await getMyCart();
        console.log(cart)



        // Parse and validate item
        const item = cartItemSchema.parse(data)
        console.log("ini item",item)

        // FInd product in database
        const product = await prisma.product.findFirst({
            where: { id: item.productId }
        })

        console.log("ini Product", product);

        if(!product) throw new Error('Product not found')

        if (!cart) {
            // create new cart object
            const newCart = insertCartSchema.parse({
                items: [item],
                ...calcPrice([item]),
                sessionCartId: sessionCartId,
                userId: userId,
            });

            // Add to database
            await prisma.cart.create({
                data: newCart
            });

            revalidatePath(`/product/${item.slug}`);

            return {
                success: true,
                message: 'Item added to cart',
            };
        } else {
            const existItem = (cart.items as CartItem[]).find((x) => x.productId === item.productId);
        
            // check if item already exist in cart
            if (existItem) {
                // Check stock
                if (product.stock < existItem.qty + 1) {
                    throw new Error('Product stock is not enough');
                }
                // Increase quantity

                (cart.items as CartItem[]).find((x) => x.productId === item.productId)!.qty = 
                existItem.qty + 1;
            } else {
                // If item does not exist, add it to cart
                // Check stock
                if (product.stock < 1) throw new Error('Not enough stock');

                // Add new item to cart
                cart.items.push(item);
            }

            // Save to database
            await prisma.cart.update({
                where: { id: cart.id},
                data: {
                    items: cart.items as Prisma.CartUpdateitemsInput[],
                    ...calcPrice(cart.items as CartItem[]),
                }
            });

            revalidatePath(`/product/${product.slug}`);

            return {
                success: true,
                message: `${product.name} ${existItem ? 'updated in' : 'added to'} cart`,
            }
        }

    } catch (error) {
        return {
            success: false,
            message: formatError(error)
        }
    }
}


export async function getMyCart() {
    // check for cart cookie
    const sessionCartId = (await cookies()).get('sessionCartId')?.value;
    if (!sessionCartId) throw new Error('Cart session not found');


    // Get session and user ID
    const session = await auth();
    const userId = session?.user?.id ? (session.user.id as string) : undefined;

    // get user cart from database
    const cart = await prisma.cart.findFirst({
        where: userId ? { userId: userId } : { sessionCartId: sessionCartId }
    })

    return cart
}


export async function removeItemFromCart(productId: string) {
    try {
        // Check for cart cookie
        const sessionCartId = (await cookies()).get('sessionCartId')?.value;
        if (!sessionCartId) throw new Error('Cart session not found');

        // Get Product
        const product = await prisma.product.findFirst({
            where: { id: productId }
        })

        if (!product) throw new Error('Product not found');

        // Get user cart
        const cart = await getMyCart();
        if(!cart) throw new Error('Cart not found');

        // Check for item
        const exist = (cart.items as CartItem[]).find((x) => x.productId === productId);
        if (!exist) throw new Error('Item not found in cart');

        // Check if only one item qty
        if (exist.qty === 1) {
            // Remove item from cart
            cart.items = (cart.items as CartItem[]).filter((x) => x.productId !== exist.productId);
        } else {
            // Decrease item qty
            (cart.items as CartItem[]).find((x) => x.productId === productId)!.qty = exist.qty - 1;
        }
        // Update cart in database
        await prisma.cart.update({
            where: { id: cart.id },
            data: {
                items: cart.items as Prisma.CartUpdateitemsInput[],
                ...calcPrice(cart.items as CartItem[]),
            }
        }) 

        revalidatePath(`/product/${product.slug}`)

        return {
            success: true,
            message: `${product.name} was removed from cart`
        }

    } catch (error) {
        return { 
            success: false,
            message: formatError(error)
         }
    }
}