"use client"
import { Game } from "@/components";
import { generateGame } from "@/lib/utils";


function Home() {


  return (
    <div className="flex items-center justify-center gap-6">
      <Game 
        initialGame={generateGame(10)}
        roundLimit={10}
        showKatakanaHint={false}
        showRomajiHint={false}
      />
    </div>
  )
}

export default Home
