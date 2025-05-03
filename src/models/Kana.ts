
interface JpCard {
    id: string,
    hiragana: string,
    katakana: string,
    romaji: string,
    audio: string,
}

interface JpGame {
    id: string,
    cards: JpCard[],
}


export { JpCard, JpGame }

