"use client"

import { use, useState, useEffect } from "react"
import { Spinner } from "@radix-ui/themes"
import { ChevronDownIcon, ChevronUpIcon } from "@radix-ui/react-icons"

interface CardData {
  id: string
  hiragana: string
  katakana: string
  romaji: string
  audio: string
}

interface RoundData {
  id: string
  isCorrect: boolean
  answer: CardData
  selected: CardData | null
  card: CardData[]
}

interface JpGame {
  id: string
  accuracy: number
  createdAt: string
  userId: string
  rounds: RoundData[]
  user?: {
    id: string
    name: string
    email: string
  }
}

export default function UserDashboard({ params }: { params: Promise<{ id: string }> }) {
  const unwrappedParams = use(params);
  const id = unwrappedParams.id;
  
  const [games, setGames] = useState<JpGame[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedGames, setExpandedGames] = useState<Record<string, boolean>>({});

  // Toggle game details expansion
  const toggleGameExpansion = (gameId: string) => {
    setExpandedGames(prev => ({
      ...prev,
      [gameId]: !prev[gameId]
    }));
  };

  // Calculate game accuracy
  const calculateAccuracy = (game: JpGame): number => {
    if (!game.rounds || game.rounds.length === 0) return 0;
    
    const correctRounds = game.rounds.filter(round => round.isCorrect).length;
    return Math.round((correctRounds / game.rounds.length) * 100);
  };

  // Get missed hiragana characters for a game
  const getMissedCharacters = (game: JpGame) => {
    if (!game.rounds) return [];
    
    return game.rounds
      .filter(round => !round.isCorrect)
      .map(round => ({
        correct: round.answer,
        selected: round.selected,
        isCorrect: round.isCorrect
      }));
  };

  useEffect(() => {
    async function fetchGames() {
      try {
        setLoading(true);
        const response = await fetch(`/api/game?userId=${id}`, {
          credentials: 'include', // Send cookies for authentication
        });
        
        if (!response.ok) {
          throw new Error(`Error fetching games: ${response.statusText}`);
        }
        
        const data = await response.json();
        setGames(data);
      } catch (err) {
        console.error("Failed to fetch games:", err);
        setError(err instanceof Error ? err.message : "Failed to load games");
      } finally {
        setLoading(false);
      }
    }
    
    fetchGames();
  }, [id]);
  
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spinner />
        <p className="ml-2">Loading your games...</p>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-800 rounded-md p-4 mx-auto max-w-2xl mt-8">
        <h2 className="text-lg font-bold">Error</h2>
        <p>{error}</p>
      </div>
    );
  }
  
  // Calculate average accuracy
  const averageAccuracy = games.length > 0
    ? Math.round(games.reduce((sum, game) => sum + (game.accuracy >= 0 ? game.accuracy : calculateAccuracy(game)), 0) / games.length)
    : 0;
  
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      
      {/* Game statistics summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="text-lg font-semibold text-gray-700">Total Games</h3>
          <p className="text-3xl font-bold text-blue-600">{games.length}</p>
        </div>
        
        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="text-lg font-semibold text-gray-700">Average Accuracy</h3>
          <p className="text-3xl font-bold text-green-600">
            {games.length > 0 ? `${averageAccuracy}%` : "N/A"}
          </p>
        </div>
        
        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="text-lg font-semibold text-gray-700">Total Characters</h3>
          <p className="text-3xl font-bold text-purple-600">
            {games.reduce((sum, game) => sum + (game.rounds?.length || 0), 0)}
          </p>
        </div>
      </div>
      
      {/* Game List with Missed Characters */}
      <h2 className="text-xl font-bold mb-4">Your Games</h2>
      
      {games.length === 0 ? (
        <p className="text-gray-500">You haven&apos;t played any games yet.</p>
      ) : (
        <div className="space-y-4">
          {games.map((game, index) => (
            <div key={game.id} className="bg-white rounded-lg shadow overflow-hidden">
              <div 
                className="px-4 py-3 flex justify-between items-center cursor-pointer hover:bg-gray-50"
                onClick={() => toggleGameExpansion(game.id)}
              >
                <div>
                  <h3 className="font-semibold">Game #{games.length - index}</h3>
                  <p className="text-sm text-gray-500">
                    {new Date(game.createdAt).toLocaleDateString()} • 
                    {game.rounds?.length || 0} rounds
                  </p>
                </div>
                
                <div className="flex items-center space-x-4">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium 
                    ${game.accuracy >= 70 || calculateAccuracy(game) >= 70 ? 'bg-green-100 text-green-800' : 
                    game.accuracy >= 40 || calculateAccuracy(game) >= 40 ? 'bg-yellow-100 text-yellow-800' : 
                    'bg-red-100 text-red-800'}`}>
                    {game.accuracy >= 0 ? game.accuracy : calculateAccuracy(game)}%
                  </span>
                  
                  {expandedGames[game.id] ? 
                    <ChevronUpIcon className="w-5 h-5 text-gray-500" /> : 
                    <ChevronDownIcon className="w-5 h-5 text-gray-500" />
                  }
                </div>
              </div>
              
              {expandedGames[game.id] && (
                <div className="px-4 py-3 border-t border-gray-100">
                  <h4 className="font-medium text-sm mb-2">Missed Characters</h4>
                  {getMissedCharacters(game).length === 0 ? (
                    <p className="text-sm text-green-600">Perfect score! No missed characters.</p>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                      {getMissedCharacters(game).map((item, idx) => (
                        <div key={idx} className="border border-gray-200 rounded p-2 flex items-center">
                          <div className="bg-red-50 text-red-800 px-3 py-2 rounded mr-3">
                            <span className="text-xl font-bold">{item.correct.hiragana}</span>
                            <span className="text-xs block">{item.correct.katakana}</span>
                          </div>
                          
                          <div className="flex-1">
                            <p className="text-sm font-medium">Correct: {item.correct.romaji}</p>
                            {item.selected ? (
                              <p className="text-sm text-red-600">
                                Selected: {item.selected.romaji} ({item.selected.hiragana})
                              </p>
                            ) : (
                              <p className="text-sm text-gray-500">No selection made</p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
      
      {/* Learning Progress Visualization */}
      {games.length > 0 && (
        <div className="mt-8">
          <h2 className="text-xl font-bold mb-4">Learning Progress</h2>
          <div className="bg-white rounded-lg shadow p-4">
            <div className="h-60 w-full">
              <div className="h-full flex items-end justify-start space-x-2">
                {games.slice(-10).map((game, index) => {
                  const accuracy = game.accuracy >= 0 ? game.accuracy : calculateAccuracy(game);
                  return (
                    <div 
                      key={index} 
                      className="relative h-full flex flex-col justify-end items-center"
                      style={{width: `${90/Math.min(games.length, 10)}%`}}
                    >
                      <div 
                        className={`w-full ${
                          accuracy >= 70 ? 'bg-green-500' : 
                          accuracy >= 40 ? 'bg-yellow-500' : 
                          'bg-red-500'
                        }`}
                        style={{height: `${accuracy}%`}}
                      ></div>
                      <span className="text-xs mt-1">{index + 1}</span>
                    </div>
                  );
                })}
              </div>
              <div className="mt-2 text-center text-sm text-gray-500">
                Last {Math.min(games.length, 10)} games (newest to oldest)
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
