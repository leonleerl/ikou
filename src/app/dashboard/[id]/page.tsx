"use client"

import { use, useState, useEffect } from "react"
import { Spinner } from "@radix-ui/themes"
import { ChevronDownIcon, ChevronUpIcon } from "@radix-ui/react-icons"
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  LineElement,
  PointElement,
  Title, 
  Tooltip, 
  Legend,
  ArcElement
} from 'chart.js';
import { Pie, Line } from 'react-chartjs-2';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

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
  createdAt: Date
  userId: string
  rounds: RoundData[]
  user?: {
    id: string
    name: string
    email: string
  }
}

interface MissedCharacter {
  character: CardData;
  count: number;
}

interface DateFilter {
  year: number;
  month: number | null;
}

export default function UserDashboard({ params }: { params: Promise<{ id: string }> }) {
  const unwrappedParams = use(params);
  const id = unwrappedParams.id;
  
  const [games, setGames] = useState<JpGame[]>([]);
  const [filteredGames, setFilteredGames] = useState<JpGame[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedGames, setExpandedGames] = useState<Record<string, boolean>>({});
  const [dateFilters, setDateFilters] = useState<DateFilter[]>([]);
  const [selectedFilter, setSelectedFilter] = useState<string>("all");
  const [topMissedCharacters, setTopMissedCharacters] = useState<MissedCharacter[]>([]);

  console.log("games: ", games);

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

  // Calculate available date filters from games
  const calculateDateFilters = (games: JpGame[]) => {
    const filters: DateFilter[] = [];
    const yearMonthSet = new Set<string>();

    // Add "All" option
    filters.push({ year: 0, month: null });
    
    // Extract unique year/month combinations
    games.forEach(game => {
      const date = new Date(game.createdAt);
      const year = date.getFullYear();
      const month = date.getMonth();
      const yearMonthKey = `${year}-${month}`;
      
      if (!yearMonthSet.has(yearMonthKey)) {
        yearMonthSet.add(yearMonthKey);
        filters.push({ year, month });
      }
    });
    
    // Sort filters by date (most recent first)
    return filters.sort((a, b) => {
      if (a.year === 0) return -1; // "All" comes first
      if (b.year === 0) return 1;
      if (a.year !== b.year) return b.year - a.year;
      if (a.month === null) return -1;
      if (b.month === null) return 1;
      return b.month - a.month;
    });
  };

  // Calculate top missed characters across filtered games
  const calculateTopMissedCharacters = (games: JpGame[]) => {
    const missedMap = new Map<string, MissedCharacter>();
    
    games.forEach(game => {
      const missed = game.rounds.filter(round => !round.isCorrect).map(round => round.answer);
      
      missed.forEach(card => {
        if (!missedMap.has(card.id)) {
          missedMap.set(card.id, { character: card, count: 1 });
        } else {
          const current = missedMap.get(card.id)!;
          missedMap.set(card.id, { ...current, count: current.count + 1 });
        }
      });
    });
    
    // Sort by count and take top 6
    return Array.from(missedMap.values())
      .sort((a, b) => b.count - a.count)
      .slice(0, 6);
  };

  // Filter games by selected date filter
  const filterGamesByDate = (filter: string) => {
    if (filter === "all") {
      setFilteredGames(games);
      return;
    }
    
    const [year, month] = filter.split('-').map(Number);
    
    const filtered = games.filter(game => {
      const date = new Date(game.createdAt);
      if (month === undefined) {
        return date.getFullYear() === year;
      }
      return date.getFullYear() === year && date.getMonth() === month;
    });
    
    setFilteredGames(filtered);
  };

  // Handle filter change
  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedFilter(e.target.value);
    filterGamesByDate(e.target.value);
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
        setFilteredGames(data);
        
        // Calculate date filters and top missed characters
        setDateFilters(calculateDateFilters(data));
        setTopMissedCharacters(calculateTopMissedCharacters(data));
      } catch (err) {
        console.error("Failed to fetch games:", err);
        setError(err instanceof Error ? err.message : "Failed to load games");
      } finally {
        setLoading(false);
      }
    }
    
    fetchGames();
  }, [id]);

  // Update top missed characters when filtered games change
  useEffect(() => {
    setTopMissedCharacters(calculateTopMissedCharacters(filteredGames));
  }, [filteredGames]);
  
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
  
  // Prepare chart data for missed characters
  const missedChartData = {
    labels: topMissedCharacters.map(item => `${item.character.hiragana} (${item.character.romaji})`),
    datasets: [
      {
        label: 'Times Missed',
        data: topMissedCharacters.map(item => item.count),
        backgroundColor: [
          'rgba(255, 99, 132, 0.8)',    // Bright red
          'rgba(54, 162, 235, 0.8)',    // Bright blue
          'rgba(255, 206, 86, 0.8)',    // Bright yellow
          'rgba(75, 192, 192, 0.8)',    // Teal
          'rgba(153, 102, 255, 0.8)',   // Purple
          'rgba(255, 159, 64, 0.8)',    // Orange
        ],
        borderColor: [
          'rgb(255, 99, 132)',          // Bright red
          'rgb(54, 162, 235)',          // Bright blue
          'rgb(255, 206, 86)',          // Bright yellow
          'rgb(75, 192, 192)',          // Teal
          'rgb(153, 102, 255)',         // Purple
          'rgb(255, 159, 64)',          // Orange
        ],
        borderWidth: 2,
      },
    ],
  };

  // Prepare chart data for accuracy over time
  const accuracyChartData = {
    labels: filteredGames.slice(-10).reverse().map((_, i) => {
      const dataLength = Math.min(filteredGames.length, 10);
      if (dataLength >= 10) {
        const middleIndex = Math.floor(dataLength / 2);
        if (i === 0 || i === dataLength - 1 || i === middleIndex) {
          return `Game ${i + 1}`;
        }
        return ''; 
      }
      return `Game ${i + 1}`;
    }),
    datasets: [
      {
        label: 'Accuracy (%)',
        data: filteredGames.slice(-10).reverse().map(game => game.accuracy >= 0 ? game.accuracy : calculateAccuracy(game)),
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)',
        pointBackgroundColor: 'rgba(75, 192, 192, 1)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 2,
        tension: 0.3,
        fill: true
      },
    ],
  };
  
  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Accuracy Trend',
      },
      tooltip: {
        callbacks: {
          label: function(context: { parsed: { y: number } }) {
            return `Accuracy: ${context.parsed.y}%`;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
        title: {
          display: true,
          text: 'Accuracy'
        }
      },
      x: {
        title: {
          display: false,
          text: 'Games'
        }
      }
    }
  };
  
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      
      {/* Game statistics summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="text-lg font-semibold text-gray-700">Total Games</h3>
          <p className="text-3xl font-bold text-blue-600">{filteredGames.length}</p>
        </div>
        
        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="text-lg font-semibold text-gray-700">Date Filter</h3>
          <select 
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
            value={selectedFilter}
            onChange={handleFilterChange}
          >
            <option value="all">All Games</option>
            {dateFilters.filter(f => f.year !== 0).map((filter) => (
              <option 
                key={filter.month !== null ? `${filter.year}-${filter.month}` : `${filter.year}`}
                value={filter.month !== null ? `${filter.year}-${filter.month}` : `${filter.year}`}
              >
                {filter.month !== null 
                  ? `${new Date(filter.year, filter.month).toLocaleString('en-US', { month: 'long', year: 'numeric' })}`
                  : filter.year
                }
              </option>
            ))}
          </select>
        </div>
      </div>
      
      {/* Charts Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Top 6 Missed Characters Chart */}
        <div className="bg-white rounded-lg shadow p-4">
          <h2 className="text-xl font-bold mb-4">Top 6 Missed Characters</h2>
          <div className="h-64">
            {topMissedCharacters.length > 0 ? (
              <Pie data={missedChartData} />
            ) : (
              <div className="flex h-full items-center justify-center">
                <p className="text-gray-500">No missed characters data available</p>
              </div>
            )}
          </div>
          
          {topMissedCharacters.length > 0 && (
            <div className="mt-4">
              <h3 className="text-sm font-medium mb-2">Character Details:</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                {topMissedCharacters.map((item, idx) => (
                  <div key={idx} className="border rounded p-2">
                    <div>
                      <span className="font-bold">{item.character.hiragana}</span>
                      (
                        <span className="font-semibold">{item.character.katakana}</span>
                      )
                      </div>
                    <div>Romaji: {item.character.romaji}</div>
                    <div>Missed: {item.count} times</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        
        {/* Accuracy Trend Chart */}
        <div className="bg-white rounded-lg shadow p-4">
          <h2 className="text-xl font-bold mb-4">Accuracy Trend</h2>
          <div className="h-64">
            {filteredGames.length > 0 ? (
              <Line 
                data={accuracyChartData} 
                options={chartOptions}
              />
            ) : (
              <div className="flex h-full items-center justify-center">
                <p className="text-gray-500">No game data available</p>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Game List */}
      <h2 className="text-xl font-bold mb-4">Your Games</h2>
      
      {filteredGames.length === 0 ? (
        <p className="text-gray-500">You haven&apos;t played any games yet.</p>
      ) : (
        <div className="space-y-4">
          {filteredGames.map((game, index) => (
            <div key={game.id} className="bg-white rounded-lg shadow overflow-hidden">
              <div 
                className="px-4 py-3 flex justify-between items-center cursor-pointer hover:bg-gray-50"
                onClick={() => toggleGameExpansion(game.id)}
              >
                <div>
                  <h3 className="font-semibold">Game #{filteredGames.length - index}</h3>
                  <p className="text-sm text-gray-500">
                     {game.createdAt.toLocaleString()}
                    • 
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
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
                      {getMissedCharacters(game).map((item, idx) => (
                        <div key={idx} className="border border-gray-200 rounded p-2 text-center">
                          <div className="text-lg font-bold">{item.correct.hiragana}</div>
                          <div className="text-sm">{item.correct.katakana}</div>
                          <div className="text-xs text-gray-600">{item.correct.romaji}</div>
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
    </div>
  );
}
