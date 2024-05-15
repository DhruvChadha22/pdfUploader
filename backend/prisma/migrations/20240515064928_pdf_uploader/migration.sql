-- CreateTable
CREATE TABLE "PDF" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "file" BYTEA NOT NULL,

    CONSTRAINT "PDF_pkey" PRIMARY KEY ("id")
);
