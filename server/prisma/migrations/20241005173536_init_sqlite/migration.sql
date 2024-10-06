-- CreateTable
CREATE TABLE "User" (
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
    "is_a_ngmi" BOOLEAN NOT NULL DEFAULT false,
    "success_percentage" INTEGER,
    "description" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "profilePicture" TEXT,
    "bannerPicture" TEXT
);

-- CreateTable
CREATE TABLE "Post" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "text" TEXT NOT NULL,
    "timestamp" TEXT NOT NULL,
    "likes" INTEGER NOT NULL,
    "reposts" INTEGER NOT NULL,
    "comments" INTEGER NOT NULL,
    "views" INTEGER NOT NULL,
    "userId" TEXT NOT NULL,
    CONSTRAINT "Post_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");
