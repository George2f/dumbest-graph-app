/*
  Warnings:

  - You are about to drop the `Nodes` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Nodes";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "Node" (
    "id" INTEGER NOT NULL,
    "graphName" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    PRIMARY KEY ("id", "graphName"),
    CONSTRAINT "Node_graphName_fkey" FOREIGN KEY ("graphName") REFERENCES "Graph" ("name") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Link" (
    "id" INTEGER NOT NULL,
    "graphName" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "sourceId" INTEGER NOT NULL,
    "targetId" INTEGER NOT NULL,

    PRIMARY KEY ("id", "graphName"),
    CONSTRAINT "Link_graphName_fkey" FOREIGN KEY ("graphName") REFERENCES "Graph" ("name") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Link_sourceId_graphName_fkey" FOREIGN KEY ("sourceId", "graphName") REFERENCES "Node" ("id", "graphName") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Link_targetId_graphName_fkey" FOREIGN KEY ("targetId", "graphName") REFERENCES "Node" ("id", "graphName") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Comment" (
    "id" INTEGER NOT NULL,
    "graphName" TEXT NOT NULL,
    "nodeId" INTEGER,
    "linkId" INTEGER,
    "text" TEXT NOT NULL,

    PRIMARY KEY ("id", "graphName"),
    CONSTRAINT "Comment_graphName_fkey" FOREIGN KEY ("graphName") REFERENCES "Graph" ("name") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Comment_nodeId_graphName_fkey" FOREIGN KEY ("nodeId", "graphName") REFERENCES "Node" ("id", "graphName") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Comment_linkId_graphName_fkey" FOREIGN KEY ("linkId", "graphName") REFERENCES "Link" ("id", "graphName") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Tag" (
    "id" INTEGER NOT NULL,
    "graphName" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "color" TEXT NOT NULL,

    PRIMARY KEY ("id", "graphName"),
    CONSTRAINT "Tag_graphName_fkey" FOREIGN KEY ("graphName") REFERENCES "Graph" ("name") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Graph" (
    "name" TEXT NOT NULL PRIMARY KEY
);

-- CreateIndex
CREATE UNIQUE INDEX "Graph_name_key" ON "Graph"("name");
