"use client"
import { useRouter } from 'next/navigation';
import { JpCard } from '@/components'
import { Button, Switch } from '@/components/ui'
import { generateGame } from '@/lib/utils';
import { JpGame } from '@/models';
import { SpeakerLoudIcon } from '@radix-ui/react-icons';
import { Spinner } from '@radix-ui/themes'; 
import { useSession } from "next-auth/react";
import { toast } from "sonner";

import React, { useEffect, useState } from 'react'
import { submitGame } from '@/services/gameService';

interface GameProps {
    initialGame: JpGame;
    roundLimit: number;
    showKatakanaHint: boolean;
    showRomajiHint: boolean;
}

function Game({ initialGame, roundLimit=10, showKatakanaHint, showRomajiHint}: GameProps) {
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
    }
  
    const handleOpenAllRomaji = () => {
      setOpenAllRomaji(!openAllRomaji);
    }
  
    const handleCardSelect = (id: string) => {
      setSelectedCardId(id);
    };
  
    const handleNextRound = () => {
      if (roundIndex < roundLimit - 1) {
        setRoundIndex(roundIndex + 1);
        setSelectedCardId(null);
        if (selectedCardId === game!.detail[roundIndex].answer.id) {
          game!.detail[roundIndex].isCorrect = true;
          setAccuracy(accuracy + 1);
          toast.success('Correct ✅');
        } else {
          toast.error('Incorrect ❌');
        }
      } 
      // last round
      else {
        handleFinishGame();
      }
    };
  
    const handleFinishGame = async () => {

      const finalGame = {...game};
  
      // Update the final round's correctness
      if (selectedCardId === finalGame.detail[roundIndex].answer.id && isLastRound) {
        finalGame!.detail[roundIndex].isCorrect = true;
        setAccuracy(accuracy + 1);
      }
  
      // Update selected card for the final round
      if (selectedCardId && isLastRound) {
        setIsLastRound(false);
        const selectedCard = finalGame!.detail[roundIndex].card.find(card => card.id === selectedCardId);
        finalGame!.detail[roundIndex].selected = selectedCard || null;
      }

      // if the user is not logged in
      if (!session?.user?.id) {
        // save game result to localStorage for non-logged in users
        localStorage.setItem("pendingGameResult", JSON.stringify(finalGame));
        toast.success("Please login to save your progress");
        return;
      }
  
      // Submit finalGame data to API
      await submitGame(finalGame);

      toast.success('Game completed successfully!');
      
      router.push(`/dashboard/${session.user.id}`);

      setIsSubmiting(false);

    }
    
    const handlePlayAudio = () => {
      const audioPath = `audio/${game?.detail[roundIndex].answer.audio}`
      const audio = new Audio(audioPath);
      audio.play();
    }
  
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
    useEffect(()=>{
      const submitPendingGame = async () => {
        if (status === "authenticated" && session?.user?.id) {
          const pendingGame = localStorage.getItem('pendingGameResult');
          if (pendingGame) {
            setIsSubmiting(true);

            const gameData = JSON.parse(pendingGame);

            await submitGame(gameData);

            setIsSubmiting(false);
          }
        }
      };
      submitPendingGame();
    }, [status, session, router]);
  
    if (!game) {
      return <Spinner/>;
    }
  
    if (!startGame) {
      return (
          <div className="flex h-screen w-full items-center justify-center">
            <div className="w-[1000px] h-[600px] bg-card border border-border rounded-lg shadow-lg mb-32 flex flex-col justify-center items-center bg-gradient-to-br from-white to-slate-100 transition-all duration-300 hover:shadow-xl">
              <h1 className="text-4xl font-bold mb-8 text-gray-800">Japanese Learning Game</h1>
              <p className="text-lg text-gray-600 mb-10">Test your Japanese character recognition skills</p>
              <Button 
                variant={'outline'} 
                className='w-40 h-24 text-2xl flex justify-center items-center transition-all duration-300 hover:bg-amber-50 hover:border-amber-300 hover:scale-105 hover:shadow-md' 
                onClick={() => setStartGame(true)}
              >
                Start
              </Button>
            </div>
          </div>
      )
    }
  
  
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <div className="w-[1000px] h-[600px] border border-border rounded-lg shadow-lg 
        mb-32 grid grid-cols-3 gap-4 relative overflow-hidden transition-all duration-300 hover:shadow-xl">
          <div className='absolute top-0 left-0 bg-gradient-to-br from-slate-100 to-gray-200 shadow-lg p-3 rounded-xl ml-5 mt-5 w-[250px] transition-all duration-300'>
              <div className='text-2xl font-bold mb-1'>Round {roundIndex + 1}</div>
              <div className='text-xl mb-2'>Accuracy: {accuracy}/{roundLimit}</div>
            <div className='flex gap-3 items-center'>
              <Switch checked={openAllKatakana} onCheckedChange={handleOpenAllKatakana}/> <div className="text-sm font-medium">Katakana</div>
              <Switch checked={openAllRomaji} onCheckedChange={handleOpenAllRomaji}/> <div className="text-sm font-medium">Romaji</div>
            </div>
          </div>
          <div className="flex justify-center items-center">
            <div className="p-5 rounded-full bg-gradient-to-br from-amber-50 to-amber-100 hover:from-amber-100 hover:to-amber-200 transition-all duration-300 cursor-pointer transform hover:scale-110">
              <SpeakerLoudIcon className='w-16 h-16 text-amber-700 hover:text-amber-900 transition-colors' onClick={handlePlayAudio}/>
            </div>
          </div>
          <div className='grid grid-rows-4 gap-5 justify-center items-center pr-2'>
            {game.detail[roundIndex].card.map((card) => (
              <JpCard 
                key={card.id}
                id={card.id}
                hiragana={card.hiragana} 
                katakana={card.katakana} 
                romaji={card.romaji} 
                audio={card.audio}
                isSelected={selectedCardId === card.id}
                onSelect={handleCardSelect}
                isKatakanaOn={openAllKatakana}
                isRomajiOn={openAllRomaji}
              />
            ))}
          </div>
  
          <div className='flex justify-center items-center mr-10'>
            <Button variant={'outline'} 
              className={`w-32 h-20 text-2xl transition-all duration-300 ${selectedCardId === null || isSubmiting ? 'opacity-60' : 'hover:bg-amber-50 hover:border-amber-300 hover:shadow-md'}`} 
              onClick={handleNextRound} 
              disabled={selectedCardId === null || isSubmiting}>
              <div className='text-2xl font-bold z-10'>Next</div>
            </Button>
          </div>
        </div>
      </div>
    )
}

export { Game }
