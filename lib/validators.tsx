
import { number, string, z } from "zod";
import { formatNumberWithDecimal } from "./utils";

const currency = z
    .string()
    .refine((value) => /^\d+(\.\d{2})?$/.test(formatNumberWithDecimal(Number(value))),
    'Price must have exactly two decimal places')

// Schema for inserting products
export const insertProductSchema = z.object({
    name: z.string().min(3, 'Name must be at least 3 characters'),
    slug: z.string().min(3, 'Slug must be at least 3 characters'),
    category: z.string().min(3, 'Category must be at least 3 characters'),
    brand: z.string().min(3, 'Brand must be at least 3 characters'),
    description: z.string().min(3, "Descriptions mus be at least 3 characters"),
    stock: z.coerce.number(),
    images: z.array(z.string()).min(1, 'Product must have at least one image'),
    isFeatured: z.boolean(),
    banner: z.string().nullable(),
    price: currency,
});


// Schema for signin users in
export const signInFormSchema = z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
})

// Schema for sign up user a user
export const signUpFormSchema = z.object({
    name: z.string().min(3, "Name must be at least 3 characters"),
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string().min(6, 'Confirm Password must be at least 6 characters')
}).refine((data) => data.password === data.confirmPassword, {
    message: "Password don't match",
    path: ['confirmPassword'],
    
});



// Cart Schemas
export const cartItemSchema = z.object({
    productId: z.string().min(1, 'Product is required'),
    name: z.string().min(1, "Name is required"),
    slug: z.string().min(1, "Slug is required"),
    qty: z.number().int().nonnegative("Quantity must be a positive number"),
    image: z.string().min(1, 'Image is required'),
    price: currency
})


export const insertCartSchema = z.object({
    items: z.array(cartItemSchema),
    itemsPrice: currency,
    totalPrice: currency,
    shippingPrice: currency,
    taxPrice: currency,
    sessionCartId: z.string().min(1, "Session cart id is required"),
    userId: z.string().optional().nullable(),
})


// Schema for the shipping address
export const shippingAddressSchema = z.object({
    fullName: z.string().min(3, 'Name must be at least 3 characters'),
    streetAddress: z.string().min(3, 'Address must be at least 3 characters'),
    city: z.string().min(3, 'City must be at least 3 characters'),
    postalCode: z.string().min(3, 'Postal code must be at least 3 characters'),
    country: z.string().min(3, 'Country must be at least 3 characters'),
    lat: z.number().optional(),
    lng: z.number().optional(),
})



export const OrderDetails = z.object({
    id: z.string(),
    items: z.array(z.object({
        name: z.string(),
        price: z.number(),
        qty: z.number(),
    })),
    total: z.number(),
    tax: z.number()
});

// Helper untuk Luhn Algorithm (Validasi nomor kartu kresit asli)

function luhnCheck(val: string) {
    let checksum = 0;
    let j = 1;
    for (let i = val.length - 1; i >= 0; i--) {
        let calc = 0;
        calc = Number(val.charAt(i)) * j;
        if (calc > 9) {
            checksum = checksum + 1;
            calc = calc - 10;
        }
        checksum = checksum + calc;
        if (j == 1) { j = 2 } else { j = 1 };
    }
    return (checksum % 10) == 0;
}

export const paymentSchema = z.object({
    holderName: z.string().min(2, "Nama pemegang kartu wajib diisi"),
    cardNumber: z.string()
        .regex(/^\d+$/, "Hanya angka diperbolehkan")
        .min(13, "Nomor kartu terlalu pendek")
        .max(19, "Nomer kartu terlalu panjang")
        .refine(luhnCheck, "Nomor kartu tidak valid (Luhn check failed)"),
    expiryDate: z.string().regex(/^(0[1-9]|1[0-2])\/\d{2}$/, "Format harus MM/YY"),
    cvc: z.string().regex(/^\d{3,4}$/, "CVC harus 3 atau 4 digit"),
});


