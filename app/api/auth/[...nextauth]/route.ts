import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { compare } from "bcrypt";
import { randomUUID } from "crypto";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const handler = NextAuth({
    adapter: PrismaAdapter(prisma),
    session: {
        strategy: "jwt",
    },
    providers: [
        CredentialsProvider({
            name: "credentials",
            credentials: {
                username: { label: "Username", type: "text" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                if (!credentials) return null;

                const user = await prisma.user.findUnique({
                    where: { username: credentials.username },
                });

                if (!user || !(await compare(credentials.password, user.password))) {
                    return null;
                }

                // Generuj nowy token i zapisz go do bazy
                const token = randomUUID();
                await prisma.user.update({
                    where: { id: user.id },
                    data: { token },
                });

                return {
                    id: user.id + "",
                    username: user.username,
                    token, // dodaj do zwracanego obiektu
                };
            },
        }),
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
                token.username = user.username;
                token.token = user.token; // dodaj token do JWT
            }
            return token;
        },
        async session({ session, token }) {
            if (token) {
                session.user.id = token.id;
                session.user.username = token.username;
                session.user.token = token.token; // dodaj token do sesji
            }
            return session;
        },
    },
    pages: {
        signIn: "/login",
    },
});

export { handler as GET, handler as POST };
