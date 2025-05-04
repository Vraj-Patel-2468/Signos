-- DropForeignKey
ALTER TABLE "Community" DROP CONSTRAINT "Community_createdBy_fkey";

-- DropForeignKey
ALTER TABLE "Post" DROP CONSTRAINT "Post_communityId_fkey";

-- DropForeignKey
ALTER TABLE "Post" DROP CONSTRAINT "Post_userId_fkey";

-- DropForeignKey
ALTER TABLE "Project" DROP CONSTRAINT "Project_teamId_fkey";

-- DropForeignKey
ALTER TABLE "Task" DROP CONSTRAINT "Task_projectId_fkey";

-- DropForeignKey
ALTER TABLE "TaskDependency" DROP CONSTRAINT "TaskDependency_taskId_fkey";

-- DropForeignKey
ALTER TABLE "TeamUser" DROP CONSTRAINT "TeamUser_teamId_fkey";

-- DropForeignKey
ALTER TABLE "TeamUser" DROP CONSTRAINT "TeamUser_userId_fkey";

-- DropForeignKey
ALTER TABLE "UserCommunity" DROP CONSTRAINT "UserCommunity_communityId_fkey";

-- DropForeignKey
ALTER TABLE "UserCommunity" DROP CONSTRAINT "UserCommunity_userId_fkey";

-- DropForeignKey
ALTER TABLE "UserProfile" DROP CONSTRAINT "UserProfile_userId_fkey";

-- AlterTable
ALTER TABLE "Task" ADD COLUMN     "rating" INTEGER,
ADD COLUMN     "remarks" TEXT;

-- AddForeignKey
ALTER TABLE "TeamUser" ADD CONSTRAINT "TeamUser_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TeamUser" ADD CONSTRAINT "TeamUser_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team"("team_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Project" ADD CONSTRAINT "Project_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team"("team_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Task" ADD CONSTRAINT "Task_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TaskDependency" ADD CONSTRAINT "TaskDependency_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "Task"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Community" ADD CONSTRAINT "Community_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "User"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserCommunity" ADD CONSTRAINT "UserCommunity_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserCommunity" ADD CONSTRAINT "UserCommunity_communityId_fkey" FOREIGN KEY ("communityId") REFERENCES "Community"("community_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserProfile" ADD CONSTRAINT "UserProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Post" ADD CONSTRAINT "Post_communityId_fkey" FOREIGN KEY ("communityId") REFERENCES "Community"("community_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Post" ADD CONSTRAINT "Post_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;
