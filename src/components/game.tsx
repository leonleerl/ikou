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

    const router = useRouter();
  
    const { data: session } = useSession();
  
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
        }
      } 
      else {
        handleFinishGame();
      }
    };
  
    const handleFinishGame = async () => {
  
      // if note logged in, alert user to login, and return
      if (!session?.user?.id) {
        toast.error('Please login to save and track your game');
        return;
      }
  
      // Update the final round's correctness
      if (selectedCardId === game!.detail[roundIndex].answer.id) {
        game!.detail[roundIndex].isCorrect = true;
        setAccuracy(accuracy + 1);
      }
  
      // Update selected card for the final round
      if (selectedCardId) {
        const selectedCard = game!.detail[roundIndex].card.find(card => card.id === selectedCardId);
        game!.detail[roundIndex].selected = selectedCard || null;
      }
  
      setIsSubmiting(true);
      
      try {
        // Submit game data to API
        const response = await fetch('/api/game', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(game),
          credentials: 'include', // Include cookies for auth
        });
  
        if (!response.ok) {
          throw new Error(`Error submitting game: ${response.statusText}`);
        }
  
        await response.json();
        toast.success('Game completed successfully!');
        
        router.push(`/dashboard/${session.user.id}`);


      } catch (error) {
        console.error('Failed to submit game:', error);
        toast.error('Failed to submit game. Please try again.');
      } finally {
        setIsSubmiting(false);
      }
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
  
    if (!game) {
      return <Spinner/>;
    }
  
    if (!startGame) {
      return (
          <div className="flex h-screen w-full items-center justify-center">
            <div className="w-[1000px] h-[600px] bg-card border border-border rounded-lg shadow-md mb-32 flex flex-col justify-center items-center">

                <Button variant={'outline'} className='w-32 h-20 text-2xl flex justify-center items-center' onClick={() => setStartGame(true)}>Start</Button>

            </div>
          </div>
      )
    }
  
  
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <div className="w-[1000px] h-[600px] bg-card border border-border rounded-lg shadow-md 
        mb-32 grid grid-cols-3 gap-4 relative">
          <div className='absolute top-0 left-0 bg-gray-300 shadow-xl p-2 rounded-2xl ml-5 mt-5 w-[250px] h-[100px]'>
              <div className='text-2xl font-bold'>Round {roundIndex + 1}</div>
              <div className='text-xl'>Accuracy: {accuracy}/{roundLimit}</div>
            <div className='flex gap-2 items-center'>
              <Switch checked={openAllKatakana} onCheckedChange={handleOpenAllKatakana}/> <div>Katakana</div>
              <Switch checked={openAllRomaji} onCheckedChange={handleOpenAllRomaji}/> <div>Romaji</div>
            </div>
          </div>
          <div className="flex justify-center items-center">
            <SpeakerLoudIcon className='w-20 h-20 hover:text-amber-900' onClick={handlePlayAudio}/>
          </div>
          <div className='grid grid-rows-4 gap-4 justify-center items-center'>
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
            <Button variant={'outline'} className='w-32 h-20 text-2xl' onClick={handleNextRound} disabled={selectedCardId === null || isSubmiting}>
              <div className='text-2xl font-bold z-10'>Next</div>
            </Button>
          </div>
        </div>
      </div>
    )
}

export { Game }
