"use client"
import { JpCard, StartGameScreen } from '@/components'
import { Button } from '@/components/ui'
import { JpGame } from '@/models';
import { SpeakerLoudIcon } from '@radix-ui/react-icons';
import { Spinner } from '@radix-ui/themes'; 
import React from 'react'
import { useGame } from '@/hooks/useGame';
import { Scoreboard } from '@/components';

interface GameProps {
    initialGame: JpGame;
    roundLimit?: number;
    showKatakanaHint?: boolean;
    showRomajiHint?: boolean;
}

function Game({ 
  initialGame, 
  roundLimit = 10, 
  showKatakanaHint = false, 
  showRomajiHint = false 
}: GameProps) {
  const {
    game,
    startGame,
    setStartGame,
    roundIndex,
    accuracy,
    selectedCardId,
    openAllKatakana,
    openAllRomaji,
    isSubmiting,
    handleOpenAllKatakana,
    handleOpenAllRomaji,
    handleCardSelect,
    handleNextRound,
    handlePlayAudio,
  } = useGame({
    initialGame,
    roundLimit,
    showKatakanaHint,
    showRomajiHint,
  });

  if (!game) {
    return <Spinner />;
  }

  if (!startGame) {
    return <StartGameScreen onStart={() => setStartGame(true)} />;
  }

  return (
    <div className="flex h-screen w-full items-center justify-center">
      <div className="w-[1000px] h-[600px] border border-border rounded-lg shadow-lg 
      mb-32 grid grid-cols-3 gap-4 relative overflow-hidden transition-all duration-300 hover:shadow-xl">
        <Scoreboard 
          roundIndex={roundIndex} 
          roundLimit={roundLimit} 
          accuracy={accuracy} 
          openAllKatakana={openAllKatakana} 
          openAllRomaji={openAllRomaji} 
          onKatakanaChange={handleOpenAllKatakana} 
          onRomajiChange={handleOpenAllRomaji} 
        />
        
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
