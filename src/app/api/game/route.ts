import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth/next';
import { options } from '../auth/[...nextauth]/options';
import { UserService } from '@/lib/services/user.service';
import { GameService } from '@/lib/services/game.service';

// Game Round Data Interface
interface GameRound {
  id?: string;
  isCorrect: boolean;
  answer: {
    id: string;
    hiragana: string;
    katakana: string;
    romaji: string;
    audio: string;
  };
  selected: {
    id: string;
    hiragana: string;
    katakana: string;
    romaji: string;
    audio: string;
  } | null;
  card: Array<{
    id: string;
    hiragana: string;
    katakana: string;
    romaji: string;
    audio: string;
  }>;
}

// Game Data Interface
interface GameData {
  id?: string;
  detail: GameRound[];
}

export async function GET(req: NextRequest) {

    const session = await getServerSession(options);

    // check if user is logged in
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Not logged in' }, { status: 401 });
    }

    const userIdParm = req.nextUrl.searchParams.get('userId');

    let userId = "";

    if (userIdParm) {

        const user = await UserService.findUserByIdOrGoogleId(userIdParm);
        
        if (user){
          userId = user.id!;
        }
    }
    const games = await GameService.getAllGamesById(userId);

    return NextResponse.json(games);

}

/**
 * POST请求 - 保存游戏数据
 * 用于用户完成游戏后保存结果
 */
export async function POST(req: NextRequest) {
  try {
    // 使用NextAuth获取服务器端会话
    const session = await getServerSession(options);

    // 检查用户是否已登录
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Not logged in' }, { status: 401 });
    }

    // 获取用户ID
    const sessionUserId = session.user.id;
    if (!sessionUserId) {
      return NextResponse.json({ error: 'User ID not found in session' }, { status: 401 });
    }

    try {
      // 解析请求体
      const gameData: GameData = await req.json();
      
      if (!gameData.detail || !Array.isArray(gameData.detail) || gameData.detail.length === 0) {
        return NextResponse.json({ error: 'No valid game rounds data' }, { status: 400 });
      }

      // 确保用户在数据库中存在
      let userId = sessionUserId;
      const user = await prisma.user.findUnique({
        where: { id: sessionUserId }
      }); 

      if (!user) {
        // 尝试通过邮箱查找用户
        if (session.user.email) {
          const userByEmail = await prisma.user.findUnique({
            where: { email: session.user.email }
          });
          
          if (userByEmail) {
            userId = userByEmail.id;
          } else {
            // 创建新用户
            try {
              const newUser = await prisma.user.create({
                data: {
                  id: sessionUserId,
                  email: session.user.email,
                  name: session.user.name || 'User',
                  image: session.user.image
                }
              });
              userId = newUser.id;
            } catch (error) {
              console.error('Failed to create user: ', error);
              return NextResponse.json({ error: 'User not found and cannot be created' }, { status: 404 });
            }
          }
        } else {
          return NextResponse.json({ error: 'Cannot determine user identity' }, { status: 404 });
        }
      }

      // 处理卡片数据
      const cardIds = new Set<string>();
      
      // 收集所有卡片ID
      gameData.detail.forEach(round => {
        if (round.answer?.id) {
          cardIds.add(round.answer.id);
        }
        
        if (round.card && Array.isArray(round.card)) {
          round.card.forEach(card => {
            if (card?.id) cardIds.add(card.id);
          });
        }
        
        if (round.selected?.id) {
          cardIds.add(round.selected.id);
        }
      });
      
      // 检查卡片是否存在
      const existingCards = await prisma.jpCard.findMany({
        where: {
          id: {
            in: Array.from(cardIds)
          }
        },
        select: { id: true }
      });
      
      // 找出缺少的卡片
      const existingCardIds = new Set(existingCards.map(card => card.id));
      const missingCardIds = Array.from(cardIds).filter(id => !existingCardIds.has(id));
      
      // 创建缺失的卡片
      if (missingCardIds.length > 0) {
        const cardsToCreate = [];
        
        for (const id of missingCardIds) {
          // 查找卡片数据
          let cardData = null;
          
          for (const round of gameData.detail) {
            // 检查答案卡片
            if (round.answer?.id === id) {
              cardData = round.answer;
              break;
            }
            
            // 检查选择的卡片
            if (round.selected?.id === id) {
              cardData = round.selected;
              break;
            }
            
            // 检查选项卡片
            if (round.card) {
              for (const card of round.card) {
                if (card?.id === id) {
                  cardData = card;
                  break;
                }
              }
              if (cardData) break;
            }
          }
          
          if (cardData && cardData.hiragana && cardData.katakana && cardData.romaji) {
            cardsToCreate.push({
              id: cardData.id,
              hiragana: cardData.hiragana,
              katakana: cardData.katakana,
              romaji: cardData.romaji,
              audio: cardData.audio || `${cardData.romaji}.mp3`
            });
          }
        }
        
        // 批量创建卡片
        if (cardsToCreate.length > 0) {
          await prisma.jpCard.createMany({
            data: cardsToCreate,
            skipDuplicates: true
          });
        }
      }

      // 计算准确率
      const correctRounds = gameData.detail.filter(round => round.isCorrect).length;
      const accuracy = Math.round((correctRounds / gameData.detail.length) * 100);

      // 创建游戏记录
      const game = await prisma.jpGame.create({
        data: {
          // 使用客户端提供的ID或自动生成
          ...(gameData.id ? { id: gameData.id } : {}),
          userId: userId,
          accuracy,
          rounds: {
            create: gameData.detail
              .filter(round => round.answer?.id)
              .map(round => {
                // 准备回合数据
                const roundData: {
                  id?: string;
                  isCorrect: boolean;
                  answerId: string;
                  selectedId?: string;
                  card?: { connect: { id: string }[] };
                } = {
                  // 使用客户端提供的ID或自动生成
                  ...(round.id ? { id: round.id } : {}),
                  isCorrect: !!round.isCorrect,
                  answerId: round.answer.id
                };
                
                // 添加选择的卡片
                if (round.selected?.id) {
                  roundData.selectedId = round.selected.id;
                }
                
                // 添加选项卡片
                if (round.card && round.card.length > 0) {
                  roundData.card = {
                    connect: round.card
                      .filter(card => card && card.id)
                      .map(card => ({ id: card.id }))
                  };
                }
                
                return roundData;
              })
          }
        },
        include: {
          rounds: {
            include: {
              card: true,
              answer: true,
              selected: true
            }
          }
        }
      });

      return NextResponse.json({ 
        success: true,
        message: 'Game data saved successfully',
        game
      }, { status: 201 });
    } catch (error) {
      console.error('Failed to save game data: ', error);
      return NextResponse.json({ 
        error: 'Failed to save game data', 
        details: error instanceof Error ? error.message : String(error) 
      }, { status: 500 });
    }
  } catch (error) {
    console.error('Failed to handle request: ', error);
    return NextResponse.json({ 
      error: 'Failed to handle request', 
      details: error instanceof Error ? error.message : String(error) 
    }, { status: 500 });
  }
}
