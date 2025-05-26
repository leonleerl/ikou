import { JpGame } from "@/models";

async function submitGame(finalGame: JpGame) {
    try {
        const response = await fetch('/api/game', {
            method: 'POST',
            headers: {
          'Content-Type': 'application/json',
            },
            body: JSON.stringify(finalGame),
            credentials: 'include', // Include cookies for auth
        });

        if (!response.ok) {
            throw new Error(`Error submitting game: ${response.statusText}`);
        }

        await response.json();
    } catch (error) {
        console.error('Error submitting game:', error);
        throw error;
    }
}

async function getGamesById(id: string) : Promise<JpGame[]> {
    try {
        const response = await fetch(`/api/game/${id}`, {
            credentials: 'include',
        });

        if (!response.ok) {
            throw new Error(`Error fetching game: ${response.statusText}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching game:', error);
        throw error;
    }
}

export { submitGame, getGamesById }