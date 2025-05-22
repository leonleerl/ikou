import { JpGame } from '@/models';

interface GameResponse {
  success: boolean;
  message?: string;
  data?: unknown;
}

/**
 * Submits a completed game to the server
 */
async function submitGame(gameData: JpGame): Promise<GameResponse> {
  const response = await fetch('/api/game', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(gameData),
    credentials: 'include', // Include cookies for auth
  });

  if (!response.ok) {
    throw new Error(`Error submitting game: ${response.statusText}`);
  }

  return response.json();
}

/**
 * Loads a pending game from localStorage and submits it
 */
async function submitPendingGame(): Promise<GameResponse | null> {
  const pendingGame = localStorage.getItem('pendingGameResult');
  
  if (!pendingGame) {
    return null;
  }
  
  const gameData = JSON.parse(pendingGame);
  const result = await submitGame(gameData);
  
  // Clear the pending game from localStorage
  localStorage.removeItem('pendingGameResult');
  
  return result;
}

/**
 * Saves a game result to localStorage (for non-logged in users)
 */
function savePendingGame(gameData: JpGame): void {
  localStorage.setItem('pendingGameResult', JSON.stringify(gameData));
} 

export { submitGame, submitPendingGame, savePendingGame };