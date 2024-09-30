import authoOptions from "@/app/auth/authOptions";
import NextAuth from "next-auth";

const handler = NextAuth(authoOptions);

export { handler as GET, handler as POST };
