'use server';
import { prisma } from "@/db/prisma";
import { convertToPlainObject } from "../utils";
import { LATEST_PRODUCTS_LIMIT } from "../constants";

// Get latest products
export async function getLatestProducts() {
    const data = await prisma.product.findMany({
        // Digunakan untuk mengambil 4 produk data terbatas
        // biasanya ketika ingin mendapatkan data rekomendasi
        take: LATEST_PRODUCTS_LIMIT, 
        // Digunakan untuk mengurutkan data berdasarkan data terbaru maupun data terlama
        // jika menggunakan asc berarti kita mengambil data terlama tetapi jika menggunakan
        //  desc ini berarti kita mengambil data terbaru yang baru ditambahkan diakhir
        orderBy: { createdAt: 'desc' }
    });

    return convertToPlainObject(data);
}