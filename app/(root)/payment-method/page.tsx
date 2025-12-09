
import { Metadata } from "next";
import FullPaymentPage from "./payment-method";

export const metadata: Metadata = {
    title: 'Shipping Address'
}

const ShippingAddressPage = async () => {

    return (
        <>
            <FullPaymentPage />        
        </>
    )
}

export default ShippingAddressPage;
