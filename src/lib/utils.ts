import { JpCard, JpGame, JpRound } from "@/models/Kana"
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

const kanaList: JpCard[] = [
  // あ行
  {
    id: "a",
    hiragana: "あ",
    katakana: "ア",
    romaji: "a",
    audio: "a.mp3",
  },
  {
    id: "i",
    hiragana: "い",
    katakana: "イ",
    romaji: "i",
    audio: "i.mp3",
  },
  {
    id: "u",
    hiragana: "う",
    katakana: "ウ",
    romaji: "u",
    audio: "u.mp3",
  },
  {
    id: "e",
    hiragana: "え",
    katakana: "エ",
    romaji: "e",
    audio: "e.mp3",
  },
  {
    id: "o",
    hiragana: "お",
    katakana: "オ",
    romaji: "o",
    audio: "o.mp3",
  },
  // か行
  {
    id: "ka",
    hiragana: "か",
    katakana: "カ",
    romaji: "ka",
    audio: "ka.mp3",
  },
  {
    id: "ki",
    hiragana: "き",
    katakana: "キ",
    romaji: "ki",
    audio: "ki.mp3",
  },
  {
    id: "ku",
    hiragana: "く",
    katakana: "ク",
    romaji: "ku",
    audio: "ku.mp3",
  },
  {
    id: "ke",
    hiragana: "け",
    katakana: "ケ",
    romaji: "ke",
    audio: "ke.mp3",
  },
  {
    id: "ko",
    hiragana: "こ",
    katakana: "コ",
    romaji: "ko",
    audio: "ko.mp3",
  },
  // さ行
  {
    id: "sa",
    hiragana: "さ",
    katakana: "サ",
    romaji: "sa",
    audio: "sa.mp3",
  },
  {
    id: "shi",
    hiragana: "し",
    katakana: "シ",
    romaji: "shi",
    audio: "shi.mp3",
  },
  {
    id: "su",
    hiragana: "す",
    katakana: "ス",
    romaji: "su",
    audio: "su.mp3",
  },
  {
    id: "se",
    hiragana: "せ",
    katakana: "セ",
    romaji: "se",
    audio: "se.mp3",
  },
  {
    id: "so",
    hiragana: "そ",
    katakana: "ソ",
    romaji: "so",
    audio: "so.mp3",
  },
  // た行
  {
    id: "ta",
    hiragana: "た",
    katakana: "タ",
    romaji: "ta",
    audio: "ta.mp3",
  },
  {
    id: "chi",
    hiragana: "ち",
    katakana: "チ",
    romaji: "chi",
    audio: "chi.mp3",
  },
  {
    id: "tsu",
    hiragana: "つ",
    katakana: "ツ",
    romaji: "tsu",
    audio: "tsu.mp3",
  },
  {
    id: "te",
    hiragana: "て",
    katakana: "テ",
    romaji: "te",
    audio: "te.mp3",
  },
  {
    id: "to",
    hiragana: "と",
    katakana: "ト",
    romaji: "to",
    audio: "to.mp3",
  },
  // な行
  {
    id: "na",
    hiragana: "な",
    katakana: "ナ",
    romaji: "na",
    audio: "na.mp3",
  },
  {
    id: "ni",
    hiragana: "に",
    katakana: "ニ",
    romaji: "ni",
    audio: "ni.mp3",
  },
  {
    id: "nu",
    hiragana: "ぬ",
    katakana: "ヌ",
    romaji: "nu",
    audio: "nu.mp3",
  },
  {
    id: "ne",
    hiragana: "ね",
    katakana: "ネ",
    romaji: "ne",
    audio: "ne.mp3",
  },
  {
    id: "no",
    hiragana: "の",
    katakana: "ノ",
    romaji: "no",
    audio: "no.mp3",
  },
  // は行
  {
    id: "ha",
    hiragana: "は",
    katakana: "ハ",
    romaji: "ha",
    audio: "ha.mp3",
  },
  {
    id: "hi",
    hiragana: "ひ",
    katakana: "ヒ",
    romaji: "hi",
    audio: "hi.mp3",
  },
  {
    id: "fu",
    hiragana: "ふ",
    katakana: "フ",
    romaji: "fu",
    audio: "fu.mp3",
  },
  {
    id: "he",
    hiragana: "へ",
    katakana: "ヘ",
    romaji: "he",
    audio: "he.mp3",
  },
  {
    id: "ho",
    hiragana: "ほ",
    katakana: "ホ",
    romaji: "ho",
    audio: "ho.mp3",
  },
  // ま行
  {
    id: "ma",
    hiragana: "ま",
    katakana: "マ",
    romaji: "ma",
    audio: "ma.mp3",
  },
  {
    id: "mi",
    hiragana: "み",
    katakana: "ミ",
    romaji: "mi",
    audio: "mi.mp3",
  },
  {
    id: "mu",
    hiragana: "む",
    katakana: "ム",
    romaji: "mu",
    audio: "mu.mp3",
  },
  {
    id: "me",
    hiragana: "め",
    katakana: "メ",
    romaji: "me",
    audio: "me.mp3",
  },
  {
    id: "mo",
    hiragana: "も",
    katakana: "モ",
    romaji: "mo",
    audio: "mo.mp3",
  },
  // や行
  {
    id: "ya",
    hiragana: "や",
    katakana: "ヤ",
    romaji: "ya",
    audio: "ya.mp3",
  },
  {
    id: "yu",
    hiragana: "ゆ",
    katakana: "ユ",
    romaji: "yu",
    audio: "yu.mp3",
  },
  {
    id: "yo",
    hiragana: "よ",
    katakana: "ヨ",
    romaji: "yo",
    audio: "yo.mp3",
  },
  // ら行
  {
    id: "ra",
    hiragana: "ら",
    katakana: "ラ",
    romaji: "ra",
    audio: "ra.mp3",
  },
  {
    id: "ri",
    hiragana: "り",
    katakana: "リ",
    romaji: "ri",
    audio: "ri.mp3",
  },
  {
    id: "ru",
    hiragana: "る",
    katakana: "ル",
    romaji: "ru",
    audio: "ru.mp3",
  },
  {
    id: "re",
    hiragana: "れ",
    katakana: "レ",
    romaji: "re",
    audio: "re.mp3",
  },
  {
    id: "ro",
    hiragana: "ろ",
    katakana: "ロ",
    romaji: "ro",
    audio: "ro.mp3",
  },
  // わ行
  {
    id: "wa",
    hiragana: "わ",
    katakana: "ワ",
    romaji: "wa",
    audio: "wa.mp3",
  },
  {
    id: "wo",
    hiragana: "を",
    katakana: "ヲ",
    romaji: "wo",
    audio: "wo.mp3",
  },
  {
    id: "n",
    hiragana: "ん",
    katakana: "ン",
    romaji: "n",
    audio: "n.mp3",
  }
];

function generateRound() : JpRound {
  // select random 4 cards from kanaDict
  const cards = kanaList.sort(() => Math.random() - 0.5).slice(0, 4);
  const round = {
    id: crypto.randomUUID(),
    card: cards,
    answer: cards[Math.floor(Math.random() * cards.length)],
    selected: null,
    isCorrect: false,
  }
  return round
}

export function generateGame() : JpGame {
  const game : JpGame = {
    id: crypto.randomUUID(),
    detail: [],
  }
  for (let i = 0; i < 10; i++) {
    game.detail.push(generateRound())
  }
  return game
}
