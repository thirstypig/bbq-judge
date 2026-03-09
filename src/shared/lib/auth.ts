import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { prisma } from "@/shared/lib/prisma";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      id: "judge-login",
      name: "Judge Login",
      credentials: {
        cbjNumber: { label: "CBJ Number", type: "text" },
        pin: { label: "PIN", type: "password" },
      },
      async authorize(credentials) {
        const { cbjNumber: rawCbj, pin } = credentials as {
          cbjNumber: string;
          pin: string;
        };

        // Normalize: strip "CBJ-" prefix, trim whitespace
        const normalized = rawCbj.replace(/^CBJ-/i, "").trim();

        // Try exact match first, then without leading zeros
        let user = await prisma.user.findUnique({
          where: { cbjNumber: normalized },
        });
        if (!user) {
          // Try without leading zeros (e.g., "001" → "1")
          const withoutZeros = normalized.replace(/^0+/, "") || "0";
          user = await prisma.user.findUnique({
            where: { cbjNumber: withoutZeros },
          });
        }
        if (!user) {
          // Try with zero-padding (e.g., "1" → "001")
          const padded = normalized.padStart(3, "0");
          user = await prisma.user.findUnique({
            where: { cbjNumber: padded },
          });
        }

        if (!user) return null;

        // Check competition shared PIN first
        const competitionReg = await prisma.competitionJudge.findFirst({
          where: { userId: user.id },
          include: { competition: { select: { judgePin: true } } },
          orderBy: { competition: { date: "desc" } },
        });

        const competitionPin = competitionReg?.competition?.judgePin;
        const pinMatch = competitionPin
          ? pin === competitionPin
          : user.pin !== "" && pin === user.pin; // Fallback to user.pin for backward compat

        if (!pinMatch) return null;

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          cbjNumber: user.cbjNumber,
        };
      },
    }),
    Credentials({
      id: "organizer-login",
      name: "Organizer Login",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const { email, password } = credentials as {
          email: string;
          password: string;
        };

        const user = await prisma.user.findUnique({
          where: { email },
        });

        if (!user || user.role !== "ORGANIZER" || user.pin !== password) {
          return null;
        }

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          cbjNumber: user.cbjNumber,
        };
      },
    }),
  ],
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.role = (user as unknown as { role: string }).role;
        token.cbjNumber = (user as unknown as { cbjNumber: string }).cbjNumber;
      }
      return token;
    },
    session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub!;
        (session.user as unknown as { role: string }).role = token.role as string;
        (session.user as unknown as { cbjNumber: string }).cbjNumber = token.cbjNumber as string;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
  },
});
