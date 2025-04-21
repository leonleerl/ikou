"use client"
import { JpCard } from '@/components/jp/practice'
import { Button } from '@/components/ui'
import Image from 'next/image';

import React, { useState } from 'react'

function JpPractice() {
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null);

  const handleCardSelect = (id: string) => {
    setSelectedCardId(id);
    console.log(`Selected card with ID: ${id}`);
  };

  return (
    <div className="flex h-screen w-full items-center justify-center">
      <div className="w-[1000px] h-[600px] bg-card border border-border rounded-lg shadow-md 
      mb-32 grid grid-cols-3 gap-4 relative">
        <div className='absolute top-0 left-0 border border-red-500 rounded-2xl ml-5 mt-5 w-[250px] h-[100px]'>
            <div className='text-2xl font-bold'>Round 1</div>
            <div className='text-xl'>Accuracy: 0/10</div>
        </div>
        <div className="flex justify-center items-center">
          <JpCard 
            id='1' 
            hiragana='あ' 
            katakana='ア' 
            romaji='a' 
            audio='a.mp3'
            canSelect={false}
            isSelected={false}
            isKatakanaOn={false}
            isRomajiOn={false}
          />
        </div>
        <div className='grid grid-rows-4 gap-4 justify-center items-center'>
          <JpCard 
            id='1' 
            hiragana='い' 
            katakana='イ' 
            romaji='i' 
            audio='i.mp3'
            canSelect={true}
            isSelected={selectedCardId === '1'}
            onSelect={handleCardSelect}
            isKatakanaOn={false}
            isRomajiOn={false}
          />
          <JpCard 
            id='2' 
            hiragana='う' 
            katakana='ウ' 
            romaji='u' 
            audio='u.mp3'
            canSelect={true}
            isSelected={selectedCardId === '2'}
            onSelect={handleCardSelect}
            isKatakanaOn={false}
            isRomajiOn={false}
          />
          <JpCard 
            id='3' 
            hiragana='え' 
            katakana='エ' 
            romaji='e' 
            audio='e.mp3'
            canSelect={true}
            isSelected={selectedCardId === '3'}
            onSelect={handleCardSelect}
            isKatakanaOn={false}
            isRomajiOn={false}
          />
          <JpCard 
            id='4' 
            hiragana='お' 
            katakana='オ' 
            romaji='o' 
            audio='o.mp3'
            canSelect={true}
            isSelected={selectedCardId === '4'}
            onSelect={handleCardSelect}
            isKatakanaOn={false}
            isRomajiOn={false}
          />
        </div>

        <div className='flex justify-center items-center mr-10'>
          <Button variant={'outline'} className='w-32 h-20 text-2xl' asChild>
            <div className='relative'>
            <Image className='absolute left-0 z-0' src='/images/robot.jpg' alt='next' width={50} height={50}/>
                <div className='text-2xl font-bold z-10'>Next</div>
            </div>
          </Button>
        </div>
      </div>
    </div>
  )
}

export default JpPractice
