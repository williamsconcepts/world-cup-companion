import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const brazil = await prisma.team.upsert({
    where: { name: "Brazil" },
    update: {},
    create: { name: "Brazil", shortName: "BRA", group: "A" },
  });
  const argentina = await prisma.team.upsert({
    where: { name: "Argentina" },
    update: {},
    create: { name: "Argentina", shortName: "ARG", group: "A" },
  });

  await prisma.player.createMany({
    data: [
      { name: "Sample Striker", position: "FWD", number: 9, teamId: brazil.id },
      { name: "Sample Playmaker", position: "MID", number: 10, teamId: argentina.id },
    ],
    skipDuplicates: true,
  });

  await prisma.match.create({
    data: {
      stage: "Group A",
      kickoffAt: new Date(Date.now() + 1000 * 60 * 60 * 24),
      homeTeamId: brazil.id,
      awayTeamId: argentina.id,
      venue: "Sample Stadium",
    },
  });

  console.log("Seed complete.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
