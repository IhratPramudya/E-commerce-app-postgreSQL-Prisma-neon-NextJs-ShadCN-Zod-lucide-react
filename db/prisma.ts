import { PrismaClient } from '@prisma/client'
import { PrismaNeon } from '@prisma/adapter-neon'
import dotenv from 'dotenv'

dotenv.config()
const connectionString = `${process.env.DATABASE_URL}`

const adapter = new PrismaNeon({ connectionString })
  
// Menginstansiasi PrismaClient dengan adapter Neon dan menambahkan transformasi hasil
export const prisma = new PrismaClient({ adapter }).$extends({
  result: {
    product: {
      price: {
        compute(product) {
          return product.price.toString();
        },
      },
      rating: {
        compute(product) {
          return product.rating.toString();
        },
      },
    },
    cart: {
      itemsPrice: {
        compute(cart) {
          return cart.itemsPrice.toString();
        }
      },
      totalPrice: {
        compute(cart) {
          return cart.totalPrice.toString();
        }
      },
      shippingPrice: {
        compute(cart) {
          return cart.shippingPrice.toString();
        }
      },
      taxPrice: {
        compute(cart) {
          return cart.taxPrice.toString();
        }
      }
    },
  },
});
