/*
  Warnings:

  - Added the required column `evidenceCoverage` to the `career_decisions` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "career_decisions" ADD COLUMN     "evidenceCoverage" DOUBLE PRECISION NOT NULL;
