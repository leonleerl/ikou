"use client"

import React, { useState } from 'react'
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
  canSelect: boolean,
  isSelected: boolean,
  isKatakanaOn: boolean,
  isRomajiOn: boolean
  onSelect?: (id:string) => void,
}

function JpCard(props: JpCardProps) {

  const [isKatakanaOn, setIsKatakanaOn] = useState(props.isKatakanaOn);
  const [isRomajiOn, setIsRomajiOn] = useState(props.isRomajiOn);

  const handleClick =()=>{
    if (props.canSelect && props.onSelect){
      props.onSelect(props.id);
    }
  }

  const handlePlayAudio = () => {
    const audioPath = `${process.env.NEXT_PUBLIC_AUDIO_PATH}/${props.audio}`
    console.log(audioPath)
    const audio = new Audio(audioPath);
    audio.play();
  }

  return (
    <div 
      className={cn(
        'relative rounded-lg bg-orange-400 shadow-md w-[180px] h-[100px] grid grid-cols-4 transition-colors',
        props.canSelect && 'hover:bg-amber-500 cursor-pointer',
        props.isSelected && props.canSelect ? 'border-5 border-amber-900' : 'border border-transparent',
        props.className
      )}
      onClick={handleClick}
    >
      {isRomajiOn && <div className='absolute top-2 left-2'>{props.romaji}</div>}
      
      <div className='col-span-2 justify-center items-center flex text-5xl'>
        {isKatakanaOn ? props.katakana : props.hiragana}
        </div>
      <div className='col-span-1 flex flex-col justify-center items-center gap-4'>
          <Switch checked={props.isKatakanaOn} onCheckedChange={()=>{setIsKatakanaOn(!isKatakanaOn)}}/>
          <Switch checked={props.isRomajiOn} onCheckedChange={()=>{setIsRomajiOn(!isRomajiOn)}}/>
      </div>
      <div className='col-span-1 flex justify-center items-center'>
        <SpeakerLoudIcon className='w-6 h-6 hover:text-amber-900' onClick={handlePlayAudio}/>
      </div>
    </div>
  )
}

export { JpCard }
