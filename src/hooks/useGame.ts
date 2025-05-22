import { useState, useEffect } from 'react';
import { JpGame } from '@/models';
import { generateGame } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { toast } from 'sonner';
import { savePendingGame, submitGame, submitPendingGame } from '@/services/gameService';

interface UseGameProps {
  initialGame: JpGame;
  roundLimit: number;
  showKatakanaHint: boolean;
  showRomajiHint: boolean;
}

export function useGame({
  initialGame,
  roundLimit = 10,
  showKatakanaHint,
  showRomajiHint,
}: UseGameProps) {
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null);
  const [game, setGame] = useState<JpGame>(initialGame);
  const [startGame, setStartGame] = useState<boolean>(false);
  const [roundIndex, setRoundIndex] = useState<number>(0);
  const [accuracy, setAccuracy] = useState<number>(0);
  const [openAllKatakana, setOpenAllKatakana] = useState<boolean>(showKatakanaHint);
  const [openAllRomaji, setOpenAllRomaji] = useState<boolean>(showRomajiHint);
  const [isSubmiting, setIsSubmiting] = useState<boolean>(false);
  const [isLastRound, setIsLastRound] = useState<boolean>(true);

  const router = useRouter();
  const { data: session, status } = useSession();

  const handleOpenAllKatakana = () => {
    setOpenAllKatakana(!openAllKatakana);
  };

  const handleOpenAllRomaji = () => {
    setOpenAllRomaji(!openAllRomaji);
  };

  const handleCardSelect = (id: string) => {
    setSelectedCardId(id);
  };

  const handlePlayAudio = () => {
    if (!game) return;
    const audioPath = `audio/${game.detail[roundIndex].answer.audio}`;
    const audio = new Audio(audioPath);
    audio.play();
  };

  const handleNextRound = () => {
    if (roundIndex < roundLimit - 1) {
      setRoundIndex(roundIndex + 1);
      setSelectedCardId(null);
      if (selectedCardId === game!.detail[roundIndex].answer.id) {
        game!.detail[roundIndex].isCorrect = true;
        setAccuracy(accuracy + 1);
      }
    } else {
      handleFinishGame();
    }
  };

  const handleFinishGame = async () => {
    const finalGame = { ...game };

    // Update the final round's correctness
    if (selectedCardId === finalGame.detail[roundIndex].answer.id && isLastRound) {
      finalGame!.detail[roundIndex].isCorrect = true;
      setAccuracy(accuracy + 1);
    }

    // Update selected card for the final round
    if (selectedCardId && isLastRound) {
      setIsLastRound(false);
      const selectedCard = finalGame!.detail[roundIndex].card.find(
        (card) => card.id === selectedCardId
      );
      finalGame!.detail[roundIndex].selected = selectedCard || null;
    }

    // if the user is not logged in
    if (!session?.user?.id) {
      // save game result to localStorage for non-logged in users
      savePendingGame(finalGame);
      toast.success('Please login to save your progress');
      return;
    }

    try {
      setIsSubmiting(true);
      // Submit finalGame data to API using our service
      await submitGame(finalGame);
      toast.success('Game completed successfully!');

      router.push(`/dashboard/${session.user.id}`);
    } catch (error) {
      console.error('Failed to submit game:', error);
      toast.error('Failed to submit game. Please try again.');
    } finally {
      setIsSubmiting(false);
    }
  };

  useEffect(() => {
    setGame(generateGame(roundLimit));
  }, [roundLimit]);

  useEffect(() => {
    if (!game) return;

    if ((startGame || roundIndex > 0) && roundIndex <= roundLimit - 1) {
      const audioPath = `audio/${game.detail[roundIndex].answer.audio}`;
      const audio = new Audio(audioPath);
      audio.play();
    }
  }, [startGame, roundIndex, game, roundLimit]);

  // Effect to handle submitting pending game results after login
  useEffect(() => {
    const checkAndSubmitPendingGame = async () => {
      if (status === 'authenticated' && session?.user?.id) {
        try {
          setIsSubmiting(true);
          const result = await submitPendingGame();
          
          if (result) {
            toast.success('Previous game submitted successfully!');
            router.push(`/dashboard/${session.user.id}`);
          }
        } catch (error) {
          console.error('Failed to submit pending game:', error);
          toast.error('Failed to submit previous game. Please try again.');
        } finally {
          setIsSubmiting(false);
        }
      }
    };
    
    checkAndSubmitPendingGame();
  }, [status, session, router]);

  return {
    game,
    startGame,
    setStartGame,
    roundIndex,
    accuracy,
    roundLimit,
    selectedCardId,
    openAllKatakana,
    openAllRomaji,
    isSubmiting,
    handleOpenAllKatakana,
    handleOpenAllRomaji,
    handleCardSelect,
    handleNextRound,
    handlePlayAudio,
  };
}
