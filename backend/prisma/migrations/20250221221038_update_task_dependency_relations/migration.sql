/*
  Warnings:

  - The primary key for the `Project` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `completedAt` on the `Project` table. All the data in the column will be lost.
  - You are about to drop the column `desription` on the `Project` table. All the data in the column will be lost.
  - You are about to drop the column `projectId` on the `Project` table. All the data in the column will be lost.
  - You are about to drop the column `startedAt` on the `Project` table. All the data in the column will be lost.
  - Added the required column `description` to the `Project` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Project" DROP CONSTRAINT "Project_pkey",
DROP COLUMN "completedAt",
DROP COLUMN "desription",
DROP COLUMN "projectId",
DROP COLUMN "startedAt",
ADD COLUMN     "description" TEXT NOT NULL,
ADD COLUMN     "endDate" TIMESTAMP(3),
ADD COLUMN     "id" SERIAL NOT NULL,
ADD COLUMN     "startDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD CONSTRAINT "Project_pkey" PRIMARY KEY ("id");

-- CreateTable
CREATE TABLE "Task" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "priority" TEXT NOT NULL,
    "dueDate" TIMESTAMP(3) NOT NULL,
    "assignedTo" INTEGER NOT NULL,
    "projectId" INTEGER NOT NULL,

    CONSTRAINT "Task_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TaskDependency" (
    "id" SERIAL NOT NULL,
    "taskId" INTEGER NOT NULL,
    "dependsOnTaskId" INTEGER NOT NULL,

    CONSTRAINT "TaskDependency_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Community" (
    "community_id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "createdBy" INTEGER NOT NULL,

    CONSTRAINT "Community_pkey" PRIMARY KEY ("community_id")
);

-- CreateTable
CREATE TABLE "UserCommunity" (
    "userId" INTEGER NOT NULL,
    "communityId" INTEGER NOT NULL,

    CONSTRAINT "UserCommunity_pkey" PRIMARY KEY ("userId","communityId")
);

-- CreateTable
CREATE TABLE "Post" (
    "id" SERIAL NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "communityId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "Post_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "TaskDependency_taskId_dependsOnTaskId_key" ON "TaskDependency"("taskId", "dependsOnTaskId");

-- AddForeignKey
ALTER TABLE "Task" ADD CONSTRAINT "Task_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TaskDependency" ADD CONSTRAINT "TaskDependency_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "Task"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TaskDependency" ADD CONSTRAINT "TaskDependency_dependsOnTaskId_fkey" FOREIGN KEY ("dependsOnTaskId") REFERENCES "Task"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Community" ADD CONSTRAINT "Community_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "User"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserCommunity" ADD CONSTRAINT "UserCommunity_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserCommunity" ADD CONSTRAINT "UserCommunity_communityId_fkey" FOREIGN KEY ("communityId") REFERENCES "Community"("community_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Post" ADD CONSTRAINT "Post_communityId_fkey" FOREIGN KEY ("communityId") REFERENCES "Community"("community_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Post" ADD CONSTRAINT "Post_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;
