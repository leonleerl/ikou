import prisma from "@/lib/prisma";
import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcrypt";

export const options: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Please enter your email", type: "email" },
        password: { label: "Please enter your password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user || !user.password) return null;

        const passwordsMatch = await bcrypt.compare(credentials.password, user.password);

        if (!passwordsMatch) {
          return null;
        } else {
          return {
            id: user.id.toString(),
            name: user.name,
            email: user.email,
            image: user.image,
          };
        }
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === "google") {
        try {
          const existingUser = await prisma.user.findUnique({
            where: { email: user.email! },
          });
          if (!existingUser) {
            // 用户不存在，创建新用户
            await prisma.user.create({
              data: {
                email: user.email!,
                name: user.name,
                image: user.image,
                googleId: user.id,
                // password字段为空，因为是OAuth登录
              },
            });
          } else if (!existingUser.googleId) {
            // 用户存在但没有googleId，更新用户
            await prisma.user.update({
              where: { id: existingUser.id },
              data: {
                googleId: user.id,
                image: user.image || existingUser.image,
                name: user.name || existingUser.name,
              },
            });
          }
          return true;
        } catch (error) {
          console.error("Error signing in:", error);
          return false;
        }
      }
      // 允许其他登录方式
      return true;
    },
    // JWT回调，将数据用户添加到token
    async jwt({ token, user, account }) {
      if (user) {
        // 如果是首次登录，添加用户信息到token
        token.id = user.id;
      }
      // 如果是Google登录，尝试获取更多数据库信息
      if (account?.provider === "google" && user?.email) {
        const dbUser = await prisma.user.findUnique({
          where: { email: user.email },
        });

        if (dbUser) {
          // 添加数据库中的额外信息
          token.dbUserId = dbUser.id;
          // 可以添加其他自定义字段
        }
      }
      return token;
    },
    // 会话回调，将token信息传递到客户端会话
    async session({ session, token }) {
      if (session.user && token) {
        // 将token中的用户信息添加到session
        session.user.id = token.id as string;

        if (token.dbUserId) {
          // 获取完整的用户数据
          const dbUser = await prisma.user.findUnique({
            where: { id: token.dbUserId },
          });

          if (dbUser) {
            // 合并数据库用户信息到session
            session.user = {
              ...session.user,
              // 添加类型声明中已定义的字段
              id: token.id as string,
              name: session.user.name,
              email: session.user.email,
              image: session.user.image,
            };
          }
        }
      }

      return session;
    },
  },
  session: {
    strategy: "jwt",
    maxAge: 60 * 60 * 6, // 6 hours
  },
};