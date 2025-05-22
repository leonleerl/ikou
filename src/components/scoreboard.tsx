import { Switch } from "@radix-ui/themes";

interface ScoreboardProps {
    roundIndex: number;
    roundLimit: number;
    accuracy: number;
    openAllKatakana: boolean;
    openAllRomaji: boolean;
    onKatakanaChange: () => void;
    onRomajiChange: () => void;
  }
  
function Scoreboard({ 
    roundIndex, 
    roundLimit, 
    accuracy, 
    openAllKatakana, 
    openAllRomaji, 
    onKatakanaChange, 
    onRomajiChange 
  }: ScoreboardProps) {
    return (
      <div className='absolute top-0 left-0 bg-gradient-to-br from-slate-100 to-gray-200 shadow-lg p-3 rounded-xl ml-5 mt-5 w-[250px] transition-all duration-300'>
        <div className='text-2xl font-bold mb-1'>Round {roundIndex + 1}</div>
        <div className='text-xl mb-2'>Accuracy: {accuracy}/{roundLimit}</div>
        <div className='flex gap-3 items-center'>
          <Switch checked={openAllKatakana} onCheckedChange={onKatakanaChange}/> 
          <div className="text-sm font-medium">Katakana</div>
          <Switch checked={openAllRomaji} onCheckedChange={onRomajiChange}/> 
          <div className="text-sm font-medium">Romaji</div>
        </div>
      </div>
    );
  }

export { Scoreboard }