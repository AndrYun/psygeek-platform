/*
  Warnings:

  - Added the required column `relationId` to the `appointments` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "appointments" ADD COLUMN     "relationId" UUID NOT NULL;

-- AddForeignKey
ALTER TABLE "appointments" ADD CONSTRAINT "appointments_relationId_fkey" FOREIGN KEY ("relationId") REFERENCES "therapist_client_relations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
