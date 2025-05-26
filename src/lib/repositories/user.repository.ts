import { User } from "@auth/core/types";
import prisma from "../prisma";

export const UserRepository = {
    findUserById(id: string): Promise<User | null> {
        return prisma.user.findUnique({
            where: { id },
        });
    },
    findUserByGoogleId(googleId: string): Promise<User | null> {
        return prisma.user.findUnique({
            where: { googleId },
        });
    },
    findUserByEmail(email: string): Promise<User | null> {
        return prisma.user.findUnique({
            where: { email },
        });
    },
}