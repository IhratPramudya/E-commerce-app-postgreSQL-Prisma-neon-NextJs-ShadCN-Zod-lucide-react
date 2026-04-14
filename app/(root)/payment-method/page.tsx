
import { Metadata } from "next";
import PaymentForm from "./payment-method";
import { auth } from "@/auth";
import { redirect } from "next/navigation";


export const metadata: Metadata = {
    title: 'Shipping Address'
}

const ShippingAddressPage = async () => {


        const session = await auth();
    
        const userId = session?.user?.id;
        
        if (!userId) {
            // Jika tidak login, langsung redirect ke halaman login
            redirect('/sign-in?callbackUrl=/shipping-address'); 
        }

    return (
        <>
            <PaymentForm />        
        </>
    )
}

export default ShippingAddressPage;
