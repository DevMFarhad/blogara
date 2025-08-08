import prisma from "@/lib/prisma";
import seedAdmin from "@/lib/utils/seedAdmin";

async function main() {
    console.log("🌱 Starting database seed...");

    await seedAdmin();

    console.log("✅ Database seeding completed successfully.");
}

main()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async (e) => {
        console.error("❌ Seeding error:", e);
        await prisma.$disconnect();
        process.exit(1);
    });
