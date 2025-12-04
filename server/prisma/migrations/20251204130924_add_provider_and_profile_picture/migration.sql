-- AlterTable
ALTER TABLE "User" ADD COLUMN     "profilePicture" TEXT,
ADD COLUMN     "provider" TEXT NOT NULL DEFAULT 'ctc';
