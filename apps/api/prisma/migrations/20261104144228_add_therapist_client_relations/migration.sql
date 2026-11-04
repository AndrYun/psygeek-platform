-- CreateEnum
CREATE TYPE "RelationStatus" AS ENUM ('ACTIVE', 'FINISHED', 'BLOCKED');

-- CreateTable
CREATE TABLE "therapist_client_relations" (
    "id" UUID NOT NULL,
    "psychologistId" UUID NOT NULL,
    "clientId" UUID NOT NULL,
    "status" "RelationStatus" NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "therapist_client_relations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "client_invites" (
    "id" UUID NOT NULL,
    "psychologistId" UUID NOT NULL,
    "email" TEXT NOT NULL,
    "tokenHash" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "acceptedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "client_invites_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "therapist_client_relations_clientId_status_idx" ON "therapist_client_relations"("clientId", "status");

-- CreateIndex
CREATE INDEX "therapist_client_relations_psychologistId_status_idx" ON "therapist_client_relations"("psychologistId", "status");

-- CreateIndex
CREATE UNIQUE INDEX "therapist_client_relations_psychologistId_clientId_key" ON "therapist_client_relations"("psychologistId", "clientId");

-- CreateIndex
CREATE UNIQUE INDEX "client_invites_tokenHash_key" ON "client_invites"("tokenHash");

-- CreateIndex
CREATE INDEX "client_invites_psychologistId_email_idx" ON "client_invites"("psychologistId", "email");

-- CreateIndex
CREATE INDEX "client_invites_expiresAt_idx" ON "client_invites"("expiresAt");

-- AddForeignKey
ALTER TABLE "therapist_client_relations" ADD CONSTRAINT "therapist_client_relations_psychologistId_fkey" FOREIGN KEY ("psychologistId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "therapist_client_relations" ADD CONSTRAINT "therapist_client_relations_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "client_invites" ADD CONSTRAINT "client_invites_psychologistId_fkey" FOREIGN KEY ("psychologistId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
