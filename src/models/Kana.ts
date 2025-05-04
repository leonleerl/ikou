
interface JpCard {
    id: string,
    hiragana: string,
    katakana: string,
    romaji: string,
    audio: string,
}

interface JpRound{
    id: string,
    card: JpCard[],
    answer: JpCard,
    selected: JpCard | null,
    isCorrect: boolean,
}

interface JpGame {
    id: string,
    detail: JpRound[],
}


export type { JpCard, JpRound, JpGame }

