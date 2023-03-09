import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials";
// import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import prisma from "server/lib/prisma";
import * as bcrypt from "bcrypt";

export const authOptions = {
  adapter: PrismaAdapter(prisma),
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    // OAuth authentication providers
    CredentialsProvider({
      // The name to display on the sign in form (e.g. "Sign in with...")
      name: "Password",
      // `credentials` is used to generate a form on the sign in page.
      // You can specify which fields should be submitted, by adding keys to the `credentials` object.
      // e.g. domain, username, password, 2FA token, etc.
      // You can pass any HTML attribute to the <input> tag through the object.
      credentials: {
        username: { label: "Username", type: "text", placeholder: "jsmith" },
        password: {  label: "Password", type: "password" }
      },
      async authorize(credentials, req) {
        if (!credentials?.username || !credentials?.password) return null;

        const user = await prisma.user.findUnique({
          where: {
            email: credentials.username
          }, 
          select: {
            name: true,
            email: true,
            password: true,
            id: true
          }
        });
  
        if (user) {
          // Any object returned will be saved in `user` property of the JWT
          const pwd = await bcrypt.compare(credentials.password, user.password);
          if (pwd) return { name: user.name, email: user.email, id: user.id };
        } 
        return null;
      }
    }),
  ],
};

export default NextAuth(authOptions);