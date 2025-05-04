-- CreateTable
CREATE TABLE "UserProfile" (
    "profile_id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "fullName" TEXT,
    "bio" TEXT,
    "avatarUrl" TEXT,
    "location" TEXT,
    "techStack" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserProfile_pkey" PRIMARY KEY ("profile_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "UserProfile_userId_key" ON "UserProfile"("userId");

-- AddForeignKey
ALTER TABLE "UserProfile" ADD CONSTRAINT "UserProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;
