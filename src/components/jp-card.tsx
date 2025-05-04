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
    const audioPath = `${process.env.NEXT_PUBLIC_AUDIO_PATH}/${props.audio}`
    const audio = new Audio(audioPath);
    audio.play();
  }
  

  return (
    <div 
      className={cn(
        'relative rounded-lg bg-orange-400 shadow-lg w-[180px] h-[100px] grid grid-cols-4 transition-colors',
        props.isSelected ? 'border-5 border-amber-900' : 'border border-transparent',
        props.className
      )}
      onClick={handleClick}
    >
      {localRomajiOn && <div className='absolute top-1 left-9'>{props.romaji}</div>}
      
      <div className='col-span-2 justify-center items-center flex text-5xl'>
        {localKatakanaOn ? props.katakana : props.hiragana}
      </div>
      <div className='col-span-1 flex flex-col justify-center items-center gap-4'>
          <Switch checked={localKatakanaOn} onCheckedChange={()=>{setLocalKatakanaOn(!localKatakanaOn)}}/>
          <Switch checked={localRomajiOn} onCheckedChange={()=>{setLocalRomajiOn(!localRomajiOn)}}/>
      </div>
      <div className='col-span-1 flex justify-center items-center'>
        <SpeakerLoudIcon className='w-6 h-6 hover:text-amber-900' onClick={handlePlayAudio}/>
      </div>
    </div>
  )
}

export { JpCard }
