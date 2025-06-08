

import { auth } from "@/auth";
import { getMyCart } from "@/lib/actions/cart.actions";
import { getUserById } from "@/lib/actions/user.actions";
import { redirect } from "next/navigation";
import { ShippingAddress } from "@/types";
import ShippingAddressForm from "./shipping-address-form";
import { Metadata } from "next";


export const metadata: Metadata = {
    title: 'Shipping Address'
}

const ShippingAddressPage = async () => {
    const cart = await getMyCart();

    if (!cart || cart.items.length === 0) redirect('/cart');

    const session = await auth();

    const userId = session?.user?.id;
    
    if (!userId) {
        // Jika tidak login, langsung redirect ke halaman login
        redirect('/sign-in?callbackUrl=/shipping-address'); 
    }

    const user = await getUserById(userId as string);

    return <>
        <ShippingAddressForm address={ user.address as ShippingAddress }/>
    </>
}

export default ShippingAddressPage;
