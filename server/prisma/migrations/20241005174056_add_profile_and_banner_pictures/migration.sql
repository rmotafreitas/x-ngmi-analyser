/*
  Warnings:

  - You are about to drop the column `bio` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `followersCount` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `followingCount` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `joinedDate` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `likesCount` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `location` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `postsCount` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `profilePicture` on the `User` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "username" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "bannerPicture" TEXT,
    "is_a_ngmi" BOOLEAN NOT NULL DEFAULT false,
    "success_percentage" INTEGER,
    "description" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_User" ("bannerPicture", "created_at", "description", "id", "is_a_ngmi", "name", "success_percentage", "username") SELECT "bannerPicture", "created_at", "description", "id", "is_a_ngmi", "name", "success_percentage", "username" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");
PRAGMA foreign_key_check("User");
PRAGMA foreign_keys=ON;
