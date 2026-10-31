-- CreateTable
CREATE TABLE "KeepAlive" (
    "id" INTEGER NOT NULL,
    "pingedAt" TIMESTAMP(3) NOT NULL,
    "note" TEXT,

    CONSTRAINT "KeepAlive_pkey" PRIMARY KEY ("id")
);
