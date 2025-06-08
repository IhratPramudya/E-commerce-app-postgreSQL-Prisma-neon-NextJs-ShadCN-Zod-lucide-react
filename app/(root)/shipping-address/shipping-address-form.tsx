"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { ShippingAddress } from "@/types";
import { shippingAddressSchema } from "@/lib/validators";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast as sonnerToast } from "sonner";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { shippingAddressDefaultValues } from "@/lib/constants";
import { Form } from "@/components/ui/form";


export type ToastVariant = 'default' | 'destructive' | 'success' | 'info' | 'warning';

export interface CustomToastOptions {
    description?: string;
    duration?: number;
    action?: {
        label: string;
        onClick: () => void;
    };
// Tambahkan opsi lain dari sonner yang ingin Anda dukung
}


const showCustomToast = (
    title: string,
    options: CustomToastOptions & { variant: ToastVariant }
) => {
    const { variant, description, duration, action } = options;

    console.log(variant)

    const sonnerOptions = {
        description,
        duration,
        action,
        variant
    }

    switch (sonnerOptions.variant) {
        case 'success':
            sonnerToast.success(title, sonnerOptions);
            break;
        case 'destructive':
            sonnerToast.error(title, sonnerOptions);
            break;
        case 'info':
            sonnerToast.info(title, sonnerOptions);
            break;
        case 'warning':
            sonnerToast.warning(title, sonnerOptions);
            break;
        case 'default':
            default:
                sonnerToast(title, sonnerOptions)
                break;
    }
}

const ShippingAddressForm = ({ address }: {address: ShippingAddress}) => {
    const router = useRouter();
    
    const form = useForm<z.infer<typeof shippingAddressSchema>>({
        resolver: zodResolver(shippingAddressSchema),
        defaultValues: address || shippingAddressDefaultValues,
    })

    const [isPending, startTransition] = useTransition();

    return <>
        <div className="max-w-md mx-auto space-y-4">
            <h1 className="h2-bold mt-4">
                Shipping Address 
            </h1>
            <p className="text-sm text-muted-foreground">
                Please enter and address to ship to
            </p>
            <Form {...form}>
                <form method="post" className="space-y-4">

                </form>
            </Form>
        </div>
    </>

}

export default ShippingAddressForm;
