
import { Metadata } from "next";
import PaymentForm from "./payment-method";


export const metadata: Metadata = {
    title: 'Shipping Address'
}

const ShippingAddressPage = async () => {

    return (
        <>
            <PaymentForm />        
        </>
    )
}

export default ShippingAddressPage;
