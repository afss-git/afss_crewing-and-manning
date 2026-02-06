import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Create some sample users first
  const users = await Promise.all([
    prisma.user.upsert({
      where: { email: "john.seafarer@example.com" },
      update: {},
      create: {
        email: "john.seafarer@example.com",
        firstName: "John",
        lastName: "Mariner",
        approved: false,
      },
    }),
    prisma.user.upsert({
      where: { email: "jane.captain@example.com" },
      update: {},
      create: {
        email: "jane.captain@example.com",
        firstName: "Jane",
        lastName: "Captain",
        approved: false,
      },
    }),
  ]);

  console.log("Created users:", users);

  // Create sample documents for these users
  const documents = await Promise.all([
    prisma.document.upsert({
      where: { id: 1 },
      update: {},
      create: {
        userId: users[0].id,
        docType: "certificate_competency",
        status: "pending",
        adminNotes: null,
      },
    }),
    prisma.document.upsert({
      where: { id: 2 },
      update: {},
      create: {
        userId: users[0].id,
        docType: "medical_certificate",
        status: "pending",
        adminNotes: null,
      },
    }),
    prisma.document.upsert({
      where: { id: 3 },
      update: {},
      create: {
        userId: users[1].id,
        docType: "certificate_competency",
        status: "pending",
        adminNotes: null,
      },
    }),
    prisma.document.upsert({
      where: { id: 4 },
      update: {},
      create: {
        userId: users[1].id,
        docType: "seamans_book",
        status: "approved",
        adminNotes: "Valid and current",
        verifiedAt: new Date(),
      },
    }),
  ]);

  console.log("Created documents:", documents);

  console.log("✅ Database seeded successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
