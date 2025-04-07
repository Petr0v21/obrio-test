/*
  Warnings:

  - A unique constraint covering the columns `[original_url]` on the table `File` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "File_original_url_key" ON "File"("original_url");
