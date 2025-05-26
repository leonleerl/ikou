
import prisma from "../prisma";

export const GameRepository = {
    getAllGamesById(id: string) {
        return prisma.jpGame.findMany({
            where: {
                userId: id
            },
            include: {
              rounds: {
                include: {
                  card: true,
                  answer: true,
                  selected: true
                }
              },
              user: {
                select: {
                  id: true,
                  name: true,
                  email: true
                }
              }
            },
            orderBy: {
              createdAt: 'desc'
            }
          }
        )
    }
}
