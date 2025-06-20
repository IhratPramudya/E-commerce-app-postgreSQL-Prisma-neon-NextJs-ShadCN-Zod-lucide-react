import {PrismaAdapter} from '@auth/prisma-adapter';
import {prisma} from '@/db/prisma';
import CredentialsProviders from 'next-auth/providers/credentials';
import { compareSync } from 'bcrypt-ts-edge';
import type { NextAuthConfig } from 'next-auth';
import NextAuth from 'next-auth';
import { cookies } from 'next/headers';
import { use } from 'react';

const config =  {
    pages: {
        signIn: '/sign-in',
        error: '/sign-in',
    },
    session: {
        strategy: 'jwt',
        maxAge: 30 * 24 * 60 * 60,
    },
    adapter: PrismaAdapter(prisma),
    secret: process.env.NEXTAUTH_SECRET,
    providers: [
        CredentialsProviders({
            credentials: {
                email: { type: 'email' },
                password: { type: 'password' }
            },
            async authorize(credentials) {
                if(credentials == null) return null;


                // Find user in database 
                const user = await prisma.user.findFirst({
                    where: {
                        email: credentials.email as string
                    }
                });

                // Check if user exists and if the password matches
                if (user && user.password) {
                    const isMatch = compareSync(credentials.password as string, user.password);

                    // If password is correct, return user
                    if(isMatch) {
                        return {
                            id: user.id,
                            name: user.name,
                            email: user.email,
                            role: user.role
                        }
                    }
                }
                // If user does not exist or password does not match return null
                return null
            }
        })
    ],
    callbacks: {
        async session({ session, user, trigger, token }: any) {
            // Set the user ID from token 
            session.user.id = token.sub;
            session.user.role = token.role;
            session.user.name = token.name;

            console.log(token);
            
            // If there is an update, set the user name
            if (trigger == 'update') {
                session.user.name = user.name;
            }   
            
            return session;
        },
        async jwt({ token, user, trigger, session }: any) {
            // Assign user field to token 
            if(user) {
                token.id = user.id;
                token.role = user.role;

                // If user has no name then use the email
                if (user.name === "NO_NAME") {
                    token.name = user.email!.split('@')[0];

                    // Update database to reflect the token name
                    await prisma.user.update({
                        where: { id: user.id },
                        data: { name: token.name }
                    })
                }

                if (trigger === 'signIn' || trigger === 'signUp') {
                    const cookiesObject = await cookies();
                    const sessionCartId = cookiesObject.get('sessionCartId')?.value;

                    console.log(sessionCartId);

                    if (sessionCartId) {
                       const sessionCart = await prisma.cart.findFirst({
                            where: { sessionCartId }
                        });

                        if(sessionCart) {
                            // Delete current user cart
                            await prisma.cart.deleteMany({
                                where: { userId: user.id }
                            })

                            // Assign new cart 
                            await prisma.cart.update({
                                where: { id: sessionCart.id },
                                data: {
                                    userId: user.id
                                }
                            })
                        }
                    }
                }
            }
            return token;
        },
    }
} satisfies NextAuthConfig;



export const { handlers, auth, signIn, signOut } = NextAuth(config);
