/*
  Warnings:

  - You are about to alter the column `hashed_password` on the `users` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(32)`.

*/
-- AlterTable
ALTER TABLE "users" ALTER COLUMN "hashed_password" SET DATA TYPE VARCHAR(32);
