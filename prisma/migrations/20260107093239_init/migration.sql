-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "email" TEXT,
    "password" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'TENANT',
    "status" TEXT NOT NULL DEFAULT 'active',
    "lastLoginAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "House" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "code" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "area" REAL NOT NULL,
    "monthlyRent" REAL NOT NULL,
    "waterRate" REAL NOT NULL DEFAULT 3.0,
    "electricRate" REAL NOT NULL DEFAULT 0.8,
    "status" TEXT NOT NULL DEFAULT 'available',
    "remark" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "landlordId" TEXT NOT NULL,
    CONSTRAINT "House_landlordId_fkey" FOREIGN KEY ("landlordId") REFERENCES "Landlord" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Landlord" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "remark" TEXT,
    "userId" TEXT NOT NULL,
    CONSTRAINT "Landlord_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Tenant" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "idCard" TEXT NOT NULL,
    "emergencyContact" TEXT,
    "emergencyPhone" TEXT,
    "remark" TEXT,
    "userId" TEXT NOT NULL,
    CONSTRAINT "Tenant_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "LeaseContract" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "contractNo" TEXT NOT NULL,
    "startDate" DATETIME NOT NULL,
    "endDate" DATETIME NOT NULL,
    "deposit" REAL NOT NULL,
    "monthlyRent" REAL NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'active',
    "pdfUrl" TEXT NOT NULL,
    "email" TEXT,
    "remark" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "houseId" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    CONSTRAINT "LeaseContract_houseId_fkey" FOREIGN KEY ("houseId") REFERENCES "House" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "LeaseContract_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "MeterReading" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "month" DATETIME NOT NULL,
    "waterPrev" REAL NOT NULL DEFAULT 0,
    "waterCurrent" REAL NOT NULL DEFAULT 0,
    "waterUsed" REAL NOT NULL DEFAULT 0,
    "electricPrev" REAL NOT NULL DEFAULT 0,
    "electricCurrent" REAL NOT NULL DEFAULT 0,
    "electricUsed" REAL NOT NULL DEFAULT 0,
    "remark" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "houseId" TEXT NOT NULL,
    CONSTRAINT "MeterReading_houseId_fkey" FOREIGN KEY ("houseId") REFERENCES "House" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Bill" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "billNo" TEXT NOT NULL,
    "month" DATETIME NOT NULL,
    "dueDate" DATETIME NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'unpaid',
    "rent" REAL NOT NULL DEFAULT 0,
    "waterUsed" REAL NOT NULL DEFAULT 0,
    "waterFee" REAL NOT NULL DEFAULT 0,
    "electricUsed" REAL NOT NULL DEFAULT 0,
    "electricFee" REAL NOT NULL DEFAULT 0,
    "totalFee" REAL NOT NULL DEFAULT 0,
    "remark" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "houseId" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "contractId" TEXT NOT NULL,
    "readingId" TEXT,
    CONSTRAINT "Bill_houseId_fkey" FOREIGN KEY ("houseId") REFERENCES "House" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Bill_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Bill_contractId_fkey" FOREIGN KEY ("contractId") REFERENCES "LeaseContract" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Bill_readingId_fkey" FOREIGN KEY ("readingId") REFERENCES "MeterReading" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "PaymentRecord" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "paymentNo" TEXT NOT NULL,
    "amount" REAL NOT NULL DEFAULT 0,
    "paymentDate" DATETIME NOT NULL,
    "method" TEXT NOT NULL DEFAULT 'cash',
    "proofImage" TEXT,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "remark" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "billId" TEXT NOT NULL,
    CONSTRAINT "PaymentRecord_billId_fkey" FOREIGN KEY ("billId") REFERENCES "Bill" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Maintenance" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "maintenanceNo" TEXT NOT NULL,
    "title" TEXT,
    "description" TEXT,
    "images" TEXT,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "remark" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "houseId" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    CONSTRAINT "Maintenance_houseId_fkey" FOREIGN KEY ("houseId") REFERENCES "House" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Maintenance_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "User_phone_key" ON "User"("phone");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "House_code_key" ON "House"("code");

-- CreateIndex
CREATE UNIQUE INDEX "Landlord_userId_key" ON "Landlord"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Tenant_idCard_key" ON "Tenant"("idCard");

-- CreateIndex
CREATE UNIQUE INDEX "Tenant_userId_key" ON "Tenant"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "LeaseContract_contractNo_key" ON "LeaseContract"("contractNo");

-- CreateIndex
CREATE UNIQUE INDEX "MeterReading_houseId_month_key" ON "MeterReading"("houseId", "month");

-- CreateIndex
CREATE UNIQUE INDEX "Bill_billNo_key" ON "Bill"("billNo");

-- CreateIndex
CREATE UNIQUE INDEX "PaymentRecord_paymentNo_key" ON "PaymentRecord"("paymentNo");

-- CreateIndex
CREATE UNIQUE INDEX "Maintenance_maintenanceNo_key" ON "Maintenance"("maintenanceNo");
