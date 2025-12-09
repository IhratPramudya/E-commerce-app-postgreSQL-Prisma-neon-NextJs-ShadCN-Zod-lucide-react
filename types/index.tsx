import { z } from 'zod';
import { 
    insertProductSchema, 
    insertCartSchema, 
    cartItemSchema,
    shippingAddressSchema,
    OrderDetails
} from '@/lib/validators';


export type Product = z.infer<typeof insertProductSchema> &  {
    id: string;
    rating: string;
    createdAt: Date;
};


export type Cart = z.infer<typeof insertCartSchema>;
export type CartItem = z.infer<typeof cartItemSchema>;
export type ShippingAddress = z.infer<typeof shippingAddressSchema>;
export type OrderDetails = z.infer<typeof OrderDetails>;


// Tipe datauntuk Metode pembayaran
export type PaymentMethodType = 'QRIS' | 'VA' | 'CC' | 'EWALLET';
export type BankCode = 'BCA' | 'BNI' | 'BRI' | 'MANDIRI';