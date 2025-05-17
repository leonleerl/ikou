import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth/next';
import { options } from '../auth/[...nextauth]/options';

// 游戏回合数据接口
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

// 游戏数据接口
interface GameData {
  id?: string;
  detail: GameRound[];
}

/**
 * GET请求 - 获取游戏数据
 * 用于dashboard展示用户的游戏历史
 */
export async function GET(req: NextRequest) {
  try {
    // 获取用户ID查询参数
    const userId = req.nextUrl.searchParams.get('userId');

    // 使用NextAuth获取服务器端会话
    const session = await getServerSession(options);

    // 检查用户是否已登录
    if (!session || !session.user) {
      return NextResponse.json({ error: '未登录' }, { status: 401 });
    }

    try {
      let where = {};
      
      // 如果提供了userId参数
      if (userId) {
        // 尝试直接使用userId查询
        try {
          const user = await prisma.user.findUnique({
            where: { id: userId }
          });
          
          if (user) {
            where = { userId: user.id };
          } else {
            // 尝试通过googleId查找用户
            const userByGoogleId = await prisma.user.findUnique({
              where: { googleId: userId }
            });
            
            if (userByGoogleId) {
              where = { userId: userByGoogleId.id };
            } else {
              return NextResponse.json({ error: '未找到用户' }, { status: 404 });
            }
          }
        } catch (error) {
          console.error('查询用户出错:', error);
          return NextResponse.json({ error: '用户查询失败' }, { status: 500 });
        }
      }

      // 获取游戏列表，包括回合数据
      const games = await prisma.jpGame.findMany({
        where,
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
      });

      return NextResponse.json(games);
    } catch (error) {
      console.error('处理游戏查询出错:', error);
      return NextResponse.json({ error: '处理请求失败' }, { status: 500 });
    }
  } catch (error) {
    console.error('获取游戏数据出错:', error);
    return NextResponse.json({ 
      error: '获取游戏数据失败', 
      details: error instanceof Error ? error.message : String(error) 
    }, { status: 500 });
  }
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
      return NextResponse.json({ error: '未登录' }, { status: 401 });
    }

    // 获取用户ID
    const sessionUserId = session.user.id;
    if (!sessionUserId) {
      return NextResponse.json({ error: '会话中未找到用户ID' }, { status: 401 });
    }

    try {
      // 解析请求体
      const gameData: GameData = await req.json();
      
      if (!gameData.detail || !Array.isArray(gameData.detail) || gameData.detail.length === 0) {
        return NextResponse.json({ error: '无有效游戏回合数据' }, { status: 400 });
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
                  name: session.user.name || '用户',
                  image: session.user.image
                }
              });
              userId = newUser.id;
            } catch (error) {
              console.error('创建用户失败:', error);
              return NextResponse.json({ error: '用户不存在且无法创建' }, { status: 404 });
            }
          }
        } else {
          return NextResponse.json({ error: '无法确定用户身份' }, { status: 404 });
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
        message: '游戏数据保存成功',
        game
      }, { status: 201 });
    } catch (error) {
      console.error('保存游戏数据出错:', error);
      return NextResponse.json({ 
        error: '保存游戏数据失败', 
        details: error instanceof Error ? error.message : String(error) 
      }, { status: 500 });
    }
  } catch (error) {
    console.error('处理请求出错:', error);
    return NextResponse.json({ 
      error: '处理请求失败', 
      details: error instanceof Error ? error.message : String(error) 
    }, { status: 500 });
  }
}
