import CartTable from "./cart-table";
import { getMyCart } from "@/lib/actions/cart.actions";
import { Cart } from "@/types";

export const metadata = {
    title: 'Shopping Cart',
}


const CartPage = async () => {
    const cart = await getMyCart() as Cart | null;

    return (
        <>
            <CartTable cart={cart} />
        </>
    )
}

export default CartPage;
