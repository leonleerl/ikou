/*
  Warnings:

  - A unique constraint covering the columns `[googleId]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "googleId" TEXT,
ADD COLUMN     "image" TEXT,
ALTER COLUMN "password" DROP NOT NULL;

-- CreateTable
CREATE TABLE "JpCard" (
    "id" TEXT NOT NULL,
    "hiragana" TEXT NOT NULL,
    "katakana" TEXT NOT NULL,
    "romaji" TEXT NOT NULL,
    "audio" TEXT NOT NULL,

    CONSTRAINT "JpCard_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "JpRound" (
    "id" TEXT NOT NULL,
    "isCorrect" BOOLEAN NOT NULL DEFAULT false,
    "answerId" TEXT NOT NULL,
    "selectedId" TEXT,
    "gameId" TEXT NOT NULL,

    CONSTRAINT "JpRound_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "JpGame" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "accuracy" INTEGER NOT NULL DEFAULT -1,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "JpGame_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_CardInRound" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_CardInRound_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_CardInRound_B_index" ON "_CardInRound"("B");

-- CreateIndex
CREATE UNIQUE INDEX "User_googleId_key" ON "User"("googleId");

-- AddForeignKey
ALTER TABLE "JpRound" ADD CONSTRAINT "JpRound_answerId_fkey" FOREIGN KEY ("answerId") REFERENCES "JpCard"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JpRound" ADD CONSTRAINT "JpRound_selectedId_fkey" FOREIGN KEY ("selectedId") REFERENCES "JpCard"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JpRound" ADD CONSTRAINT "JpRound_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES "JpGame"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JpGame" ADD CONSTRAINT "JpGame_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CardInRound" ADD CONSTRAINT "_CardInRound_A_fkey" FOREIGN KEY ("A") REFERENCES "JpCard"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CardInRound" ADD CONSTRAINT "_CardInRound_B_fkey" FOREIGN KEY ("B") REFERENCES "JpRound"("id") ON DELETE CASCADE ON UPDATE CASCADE;
