import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Reset document ID 3 (seaman's book) to pending status
  const resetDoc = await prisma.document.update({
    where: { id: 3 },
    data: {
      status: "pending",
      adminNotes: null,
      verifiedAt: null,
    },
  });

  console.log("✅ Reset seaman book document to pending:", resetDoc);

  // Also create another pending seaman book for testing
  const newSeamanBook = await prisma.document.create({
    data: {
      userId: 3, // Jane Captain
      docType: "seamans_book_new",
      status: "pending",
      adminNotes: null,
    },
  });

  console.log("✅ Created new pending seaman book:", newSeamanBook);
}

main()
  .catch((e) => {
    console.error("❌ Reset failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
