-- CreateTable
CREATE TABLE "Admin" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "email" TEXT NOT NULL,
    "hash" TEXT NOT NULL,
    "salt" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'admin',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "ExternalApiToken" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "token" TEXT NOT NULL,
    "expiresAt" DATETIME NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "email" TEXT NOT NULL,
    "firstName" TEXT,
    "lastName" TEXT,
    "approved" BOOLEAN NOT NULL DEFAULT false
);

-- CreateTable
CREATE TABLE "Document" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" INTEGER NOT NULL,
    "docType" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "adminNotes" TEXT,
    "verifiedAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Document_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Setting" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "key" TEXT NOT NULL,
    "value" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "ship_owners" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" INTEGER NOT NULL,
    "companyName" TEXT NOT NULL,
    "imoNumber" TEXT,
    "website" TEXT,
    "hqAddress" TEXT NOT NULL,
    "vesselTypes" TEXT NOT NULL,
    "fleetSize" TEXT NOT NULL,
    "primaryTradingArea" TEXT NOT NULL,
    "contactFullName" TEXT NOT NULL,
    "contactRole" TEXT NOT NULL,
    "contactEmail" TEXT NOT NULL,
    "contactPhone" TEXT NOT NULL,
    "document1" TEXT,
    "document2" TEXT,
    "document3" TEXT,
    "document4" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "ship_owners_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Contract" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "shipOwnerId" INTEGER NOT NULL,
    "contractId" TEXT NOT NULL,
    "vesselName" TEXT NOT NULL,
    "vesselImoNumber" TEXT,
    "position" TEXT NOT NULL,
    "positionType" TEXT NOT NULL,
    "startDate" DATETIME NOT NULL,
    "endDate" DATETIME NOT NULL,
    "duration" TEXT NOT NULL,
    "requiredCertifications" TEXT NOT NULL,
    "dayRate" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'open',
    "clientName" TEXT NOT NULL,
    "clientCompany" TEXT,
    "specificInstructions" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Contract_shipOwnerId_fkey" FOREIGN KEY ("shipOwnerId") REFERENCES "ship_owners" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ContractPosition" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "contractId" INTEGER NOT NULL,
    "position" TEXT NOT NULL,
    "specifications" TEXT,
    "assignedSeafarer" INTEGER,
    "status" TEXT NOT NULL DEFAULT 'open',
    "assignedAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "ContractPosition_contractId_fkey" FOREIGN KEY ("contractId") REFERENCES "Contract" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Admin_email_key" ON "Admin"("email");

-- CreateIndex
CREATE UNIQUE INDEX "ExternalApiToken_token_key" ON "ExternalApiToken"("token");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Setting_key_key" ON "Setting"("key");

-- CreateIndex
CREATE UNIQUE INDEX "ship_owners_userId_key" ON "ship_owners"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Contract_contractId_key" ON "Contract"("contractId");
