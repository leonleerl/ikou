"use client"
import { JpCard } from '@/components'
import { Button, Switch } from '@/components/ui'
import { generateGame } from '@/lib/utils';
import { JpGame } from '@/models';
import { SpeakerLoudIcon } from '@radix-ui/react-icons';
import { Spinner } from '@radix-ui/themes';

import React, { useEffect, useState } from 'react'

function Home() {
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null);
  const [game, setGame] = useState<JpGame | null>(null);
  const [startGame, setStartGame] = useState<boolean>(false);

  const [roundIndex, setRoundIndex] = useState<number>(0);
  const [accuracy, setAccuracy] = useState<number>(0);

  const [openAllKatakana, setOpenAllKatakana] = useState<boolean>(false);
  const [openAllRomaji, setOpenAllRomaji] = useState<boolean>(false);

  const handleOpenAllKatakana = () => {
    setOpenAllKatakana(!openAllKatakana);
  }

  const handleOpenAllRomaji = () => {
    setOpenAllRomaji(!openAllRomaji);
  }

  const handleCardSelect = (id: string) => {
    setSelectedCardId(id);
    console.log(`Selected card with ID: ${id}`);
  };

  const handleNextRound = () => {
    if (roundIndex < 9) {
      setRoundIndex(roundIndex + 1);
      setSelectedCardId(null);
      if (selectedCardId === game!.detail[roundIndex].answer.id) {
        setAccuracy(accuracy + 1);
      }
    } 
    else {
      alert('Game over');
    }
  };


  const handlePlayAudio = () => {
    const audioPath = `audio/${game?.detail[roundIndex].answer.audio}`
    const audio = new Audio(audioPath);
    audio.play();
  }

  useEffect(() => {
    setGame(generateGame());
  }, []);

  useEffect(()=>{
    if (game && roundIndex < 9) {
      const audioPath = `audio/${game?.detail[roundIndex].answer.audio}`
      const audio = new Audio(audioPath);
      audio.play();
    }
  }, [roundIndex, game])

  useEffect(()=>{
    if (startGame && game) {
      const audioPath = `audio/${game.detail[roundIndex].answer.audio}`
      const audio = new Audio(audioPath);
      audio.play();
    }
  }, [startGame, game, roundIndex])

  if (!game) {
    return <Spinner/>;
  }

  if (!startGame) {
    return (
        <div className="flex h-screen w-full items-center justify-center">
          <div className="w-[1000px] h-[600px] bg-card border border-border rounded-lg shadow-md mb-32 flex justify-center items-center">
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
            <div className='text-xl'>Accuracy: {accuracy}/10</div>
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
          <Button variant={'outline'} className='w-32 h-20 text-2xl' onClick={handleNextRound} disabled={selectedCardId === null}>
            <div className='text-2xl font-bold z-10'>Next</div>
          </Button>
        </div>
      </div>
    </div>
  )
}

export default Home
