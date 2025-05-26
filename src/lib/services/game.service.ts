import { GameRepository } from "../repositories/game.repository";

export const GameService = {
    async getAllGamesById(id: string) {
        return await GameRepository.getAllGamesById(id); 
    }
}