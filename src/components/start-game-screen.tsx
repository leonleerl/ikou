import { Button } from "@radix-ui/themes";

interface StartGameScreenProps {
    onStart: () => void;
  }
  
  function StartGameScreen({ onStart }: StartGameScreenProps) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <div className="w-[1000px] h-[600px] bg-card border border-border rounded-lg shadow-lg mb-32 flex flex-col justify-center items-center bg-gradient-to-br from-white to-slate-100 transition-all duration-300 hover:shadow-xl">
          <h1 className="text-4xl font-bold mb-8 text-gray-800">Japanese Learning Game</h1>
          <p className="text-lg text-gray-600 mb-10">Test your Japanese character recognition skills</p>
          <Button 
            variant={'outline'} 
            className='w-40 h-24 text-2xl flex justify-center items-center transition-all duration-300 hover:bg-amber-50 hover:border-amber-300 hover:scale-105 hover:shadow-md' 
            onClick={onStart}
          >
            Start
          </Button>
        </div>
      </div>
    );
  }

  export { StartGameScreen }