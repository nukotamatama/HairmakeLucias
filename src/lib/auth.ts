import NextAuth, { NextAuthConfig } from "next-auth";
import Google from "next-auth/providers/google";

const allowedEmails = (process.env.ALLOWED_EMAILS || "").split(",");

export const config: NextAuthConfig = {
    providers: [Google],
    callbacks: {
        authorized({ auth }) {
            // Basic check: is user logged in?
            // Fine-grained path protection is handled in middleware or layout, 
            // but this ensures `auth()` returns null if not authorized in general.
            return !!auth?.user;
        },
        signIn({ user }) {
            if (allowedEmails.length > 0 && user.email) {
                return allowedEmails.includes(user.email);
            }
            return true; // If no allowed list, allow everyone (or deny, but for now allow to avoid lockout if env missing)
        },
    },
    pages: {
        signIn: "/admin/login",
        // We will rewrite the URL in middleware, but internally pages are at /admin/login
    },
};

export const { handlers, auth, signIn, signOut } = NextAuth(config);
