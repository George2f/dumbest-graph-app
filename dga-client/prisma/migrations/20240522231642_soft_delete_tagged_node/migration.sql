-- AlterTable
ALTER TABLE "Attribute" ADD COLUMN "deletedAt" DATETIME;

-- AlterTable
ALTER TABLE "Comment" ADD COLUMN "deletedAt" DATETIME;

-- AlterTable
ALTER TABLE "Graph" ADD COLUMN "deletedAt" DATETIME;

-- AlterTable
ALTER TABLE "Link" ADD COLUMN "deletedAt" DATETIME;

-- AlterTable
ALTER TABLE "Node" ADD COLUMN "deletedAt" DATETIME;

-- AlterTable
ALTER TABLE "Tag" ADD COLUMN "deletedAt" DATETIME;

-- CreateTable
CREATE TABLE "TaggedWith" (
    "tagId" INTEGER NOT NULL,
    "nodeId" INTEGER NOT NULL,

    PRIMARY KEY ("tagId", "nodeId"),
    CONSTRAINT "TaggedWith_tagId_fkey" FOREIGN KEY ("tagId") REFERENCES "Tag" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "TaggedWith_nodeId_fkey" FOREIGN KEY ("nodeId") REFERENCES "Node" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
