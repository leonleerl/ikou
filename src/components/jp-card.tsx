"use client"

import React, { useState, useEffect } from 'react'
import { cn } from '@/lib/utils'
import { Switch } from '@/components/ui'
import { SpeakerLoudIcon } from '@radix-ui/react-icons';



interface JpCardProps {
  className?: string,
  id: string,
  hiragana: string,
  katakana: string,
  romaji: string,
  audio: string,
  isSelected: boolean,
  isKatakanaOn: boolean,
  isRomajiOn: boolean,
  onSelect?: (id:string) => void,
}

function JpCard(props: JpCardProps) {
  const [localKatakanaOn, setLocalKatakanaOn] = useState(false);
  const [localRomajiOn, setLocalRomajiOn] = useState(false);
  
  useEffect(() => {
    setLocalKatakanaOn(props.isKatakanaOn);
  }, [props.isKatakanaOn]);
  
  useEffect(() => {
    setLocalRomajiOn(props.isRomajiOn);
  }, [props.isRomajiOn]);

  const handleClick =()=>{
    if (props.onSelect){
      props.onSelect(props.id);
    }
  }

  const handlePlayAudio = () => {
    const audioPath = `audio/${props.audio}`
    const audio = new Audio(audioPath);
    audio.play();
  }
  

  return (
    <div 
      className={cn(
        'relative rounded-lg bg-gradient-to-br from-orange-300 to-orange-400 shadow-lg w-[180px] h-[100px] grid grid-cols-4 transition-all duration-300 hover:shadow-xl cursor-pointer',
        props.isSelected ? 'ring-4 ring-amber-600 transform scale-105' : 'ring-1 ring-transparent hover:scale-[1.02]',
        props.className
      )}
      onClick={handleClick}
    >
      {localRomajiOn && 
        <div className='absolute top-1.5 left-7 font-medium text-amber-900 bg-amber-100/70 px-2 py-0.5 rounded-full text-xs'>
          {props.romaji}
        </div>
      }
      
      <div className='col-span-2 justify-center items-center flex text-5xl font-medium text-white drop-shadow-sm'>
        {localKatakanaOn ? props.katakana : props.hiragana}
      </div>
      <div className='col-span-1 flex flex-col justify-center items-center gap-4 mr-1'>
          <div className="flex flex-col items-center">
            <Switch className="mb-1" checked={localKatakanaOn} onCheckedChange={()=>{setLocalKatakanaOn(!localKatakanaOn)}}/>
            <span className="text-[10px] text-amber-900/70 font-medium">カタカナ</span>
          </div>
          <div className="flex flex-col items-center">
            <Switch className="mb-1" checked={localRomajiOn} onCheckedChange={()=>{setLocalRomajiOn(!localRomajiOn)}}/>
            <span className="text-[10px] text-amber-900/70 font-medium">ローマ字</span>
          </div>
      </div>
      <div className='col-span-1 flex justify-center items-center'>
        <div className="p-2 rounded-full hover:bg-amber-300/40 transition-all">
          <SpeakerLoudIcon className='w-6 h-6 text-amber-900 transition-transform hover:scale-110' onClick={handlePlayAudio}/>
        </div>
      </div>
    </div>
  )
}

export { JpCard }
