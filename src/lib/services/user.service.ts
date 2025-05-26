import { User } from "@auth/core/types";
import { UserRepository } from "../repositories/user.repository";

export const UserService = {
    async findUserByIdOrGoogleId(userId: string): Promise<User | null> {
        try {
            const user = await UserRepository.findUserById(userId);
            
            if (user) {
                return user;
            }

            const userByGoogleId = await UserRepository.findUserByGoogleId(userId);
            
            if (userByGoogleId) {
                return userByGoogleId;
            }
            
            return null;
        } catch (error) {
            console.error('Failed to find user by id or google id: ', error);
            throw error;
        }
    }
}