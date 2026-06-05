-- CreateTable
CREATE TABLE "Department" (
    "code" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "note" TEXT,
    "contactName" TEXT,
    "contactAddress" TEXT,
    "contactPhone" TEXT,
    "contactEmail" TEXT
);

-- CreateTable
CREATE TABLE "Refusal" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "departmentCode" TEXT NOT NULL,
    "date" DATETIME NOT NULL,
    "motif" TEXT NOT NULL,
    "typeOperation" TEXT NOT NULL,
    "commentaire" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Refusal_departmentCode_fkey" FOREIGN KEY ("departmentCode") REFERENCES "Department" ("code") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "NewsItem" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "departmentCode" TEXT NOT NULL,
    "tag" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "NewsItem_departmentCode_fkey" FOREIGN KEY ("departmentCode") REFERENCES "Department" ("code") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "AdminUser" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "AdminUser_email_key" ON "AdminUser"("email");
