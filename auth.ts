import NextAuth from "next-auth"
import Google from "next-auth/providers/google"

export const { handlers, signIn, signOut, auth } = NextAuth({
    providers: [Google],
    callbacks: {
        authorized({ auth, request: { nextUrl } }) {
            const isLoggedIn = !!auth?.user;
            // For now, we are not blocking any routes, just checking status.
            // We will allow all functionality but only show edit buttons if logged in.
            // If we wanted to protect routes:
            // const isOnBuilder = nextUrl.pathname.startsWith('/builder');
            // if (isOnBuilder) {
            //   if (isLoggedIn) return true;
            //   return false; // Redirect unauthenticated users to login page
            // }
            return true;
        },
        async session({ session, token }) {
            // Pass the user ID if needed, or specific roles
            return session
        },
    },
})
