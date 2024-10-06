/*
  Warnings:

  - Added the required column `bio` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `followersCount` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `followingCount` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `joinedDate` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `likesCount` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `location` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `postsCount` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "username" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "bio" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "joinedDate" TEXT NOT NULL,
    "postsCount" TEXT NOT NULL,
    "followersCount" TEXT NOT NULL,
    "followingCount" TEXT NOT NULL,
    "likesCount" TEXT NOT NULL,
    "profilePicture" TEXT,
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
