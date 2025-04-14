import NextAuth, { DefaultSession } from "next-auth";

declare module "next-auth" {
    interface Session {
        user: {
            id: string | number;
            username: string;
            token: string;
        } & DefaultSession["user"];
    }

    interface User {
        id: string | number;
        username: string;
        token: string;
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        id: string | number;
        username: string;
        token: string;
    }
}
