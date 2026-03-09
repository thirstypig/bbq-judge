import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Clean existing data (order matters for FK constraints)
  await prisma.auditLog.deleteMany();
  await prisma.correctionRequest.deleteMany();
  await prisma.scoreCard.deleteMany();
  await prisma.submission.deleteMany();
  await prisma.categoryRound.deleteMany();
  await prisma.tableAssignment.deleteMany();
  await prisma.table.deleteMany();
  await prisma.competitionJudge.deleteMany();
  await prisma.competitor.deleteMany();
  await prisma.user.deleteMany();
  await prisma.competition.deleteMany();

  // --- Competition ---
  const competition = await prisma.competition.create({
    data: {
      name: "American Royal Open 2026",
      date: new Date("2026-09-20T08:00:00Z"),
      location: "Kansas City, MO",
      status: "ACTIVE",
      judgePin: "1234",
    },
  });

  // --- Organizer ---
  const organizer = await prisma.user.create({
    data: {
      cbjNumber: "ADMIN",
      name: "Sarah Mitchell",
      email: "organizer@bbq-judge.test",
      role: "ORGANIZER",
      pin: "organizer123",
    },
  });

  // --- 12 Judges (CBJ 1 through 12) ---
  const judgeNames = [
    "Marcus Johnson", "Lisa Chen", "David Williams", "Angela Rodriguez",
    "Robert Kim", "Patricia Brown", "James Wilson", "Maria Garcia",
    "Thomas Lee", "Jennifer Martinez", "William Davis", "Sandra Taylor",
  ];

  const judges = [];
  for (let i = 1; i <= 12; i++) {
    const judge = await prisma.user.create({
      data: {
        cbjNumber: String(i),
        name: judgeNames[i - 1],
        email: `judge${i}@bbq-judge.test`,
        // 1 and 7 are table captains
        role: i === 1 || i === 7 ? "TABLE_CAPTAIN" : "JUDGE",
        pin: "1234",
      },
    });
    judges.push(judge);
  }

  // --- Register all judges for the competition (all checked in) ---
  for (const judge of judges) {
    await prisma.competitionJudge.create({
      data: {
        competitionId: competition.id,
        userId: judge.id,
        checkedIn: true,
        checkedInAt: new Date(),
      },
    });
  }

  // --- Table 1: Judge 1 (captain), Judges 2 through 6 ---
  const table1 = await prisma.table.create({
    data: {
      competitionId: competition.id,
      tableNumber: 1,
      captainId: judges[0].id,
    },
  });

  for (let i = 0; i < 6; i++) {
    await prisma.tableAssignment.create({
      data: {
        tableId: table1.id,
        userId: judges[i].id,
        seatNumber: i + 1,
      },
    });
  }

  // --- Table 2: Judge 7 (captain), Judges 8 through 12 ---
  const table2 = await prisma.table.create({
    data: {
      competitionId: competition.id,
      tableNumber: 2,
      captainId: judges[6].id,
    },
  });

  for (let i = 6; i < 12; i++) {
    await prisma.tableAssignment.create({
      data: {
        tableId: table2.id,
        userId: judges[i].id,
        seatNumber: i - 5, // seats 1-6
      },
    });
  }

  // --- 6 Competitors ---
  const competitorData = [
    { anonymousNumber: "101", teamName: "Smokin' Aces" },
    { anonymousNumber: "102", teamName: "Pit Masters United" },
    { anonymousNumber: "103", teamName: "Holy Smokes BBQ" },
    { anonymousNumber: "104", teamName: "The Rib Whisperers" },
    { anonymousNumber: "105", teamName: "Flame & Fortune" },
    { anonymousNumber: "106", teamName: "Low & Slow Legends" },
  ];

  const competitors = [];
  for (const data of competitorData) {
    const c = await prisma.competitor.create({
      data: { competitionId: competition.id, ...data },
    });
    competitors.push(c);
  }

  // --- 4 KCBS Category Rounds ---
  // Chicken = ACTIVE, rest = PENDING
  const categories = [
    { name: "Chicken", order: 1, status: "ACTIVE" },
    { name: "Pork Ribs", order: 2, status: "PENDING" },
    { name: "Pork", order: 3, status: "PENDING" },
    { name: "Brisket", order: 4, status: "PENDING" },
  ];

  const rounds = [];
  for (const cat of categories) {
    const round = await prisma.categoryRound.create({
      data: {
        competitionId: competition.id,
        categoryName: cat.name,
        categoryType: "MANDATORY",
        order: cat.order,
        status: cat.status,
      },
    });
    rounds.push(round);
  }

  const chickenRound = rounds[0];

  // --- Submissions for Chicken round ---
  // Table 1 gets all 6 competitors for Chicken
  const table1Submissions = [];
  for (let i = 0; i < 6; i++) {
    const sub = await prisma.submission.create({
      data: {
        competitorId: competitors[i].id,
        categoryRoundId: chickenRound.id,
        tableId: table1.id,
        boxNumber: i + 1,
        boxCode: competitors[i].anonymousNumber,
      },
    });
    table1Submissions.push(sub);
  }

  // Table 2 gets all 6 competitors for Chicken (different table, OK per BR-2)
  const table2Submissions = [];
  for (let i = 0; i < 6; i++) {
    const sub = await prisma.submission.create({
      data: {
        competitorId: competitors[i].id,
        categoryRoundId: chickenRound.id,
        tableId: table2.id,
        boxNumber: i + 1,
        boxCode: competitors[i].anonymousNumber,
      },
    });
    table2Submissions.push(sub);
  }

  // --- Pre-fill scorecards for Table 1 Chicken ---
  // Generate realistic KCBS scores (valid: 1, 2, 5, 6, 7, 8, 9)
  const scoreData = [
    // competitor 101: strong across the board
    { app: 8, taste: 9, tex: 8 },
    { app: 7, taste: 8, tex: 8 },
    { app: 8, taste: 8, tex: 7 },
    { app: 9, taste: 9, tex: 8 },
    { app: 7, taste: 8, tex: 8 },
    { app: 8, taste: 9, tex: 9 },
    // competitor 102: good but not great
    { app: 7, taste: 7, tex: 6 },
    { app: 6, taste: 7, tex: 7 },
    { app: 7, taste: 6, tex: 7 },
    { app: 7, taste: 7, tex: 6 },
    { app: 6, taste: 7, tex: 7 },
    { app: 7, taste: 7, tex: 7 },
    // competitor 103: fair
    { app: 6, taste: 6, tex: 5 },
    { app: 5, taste: 6, tex: 6 },
    { app: 6, taste: 5, tex: 6 },
    { app: 6, taste: 6, tex: 5 },
    { app: 5, taste: 6, tex: 6 },
    { app: 6, taste: 6, tex: 6 },
    // competitor 104: mixed, one DQ score
    { app: 7, taste: 8, tex: 7 },
    { app: 8, taste: 7, tex: 7 },
    { app: 7, taste: 7, tex: 8 },
    { app: 1, taste: 7, tex: 7 }, // DQ from judge 4 (appearance = 1)
    { app: 7, taste: 8, tex: 7 },
    null, // Judge 6 hasn't scored yet
    // competitor 105: not scored yet (judges haven't gotten here)
    // competitor 106: not scored yet
  ];

  // Create score cards for Table 1 — first 4 competitors scored by judges 1-6
  let scoreIdx = 0;
  for (let compIdx = 0; compIdx < 4; compIdx++) {
    for (let judgeIdx = 0; judgeIdx < 6; judgeIdx++) {
      const scores = scoreData[scoreIdx];
      scoreIdx++;

      if (scores === null) continue; // skip unscored

      const isLocked = true; // all submitted scores are locked
      const submittedAt = new Date(
        Date.now() - (24 - scoreIdx) * 60 * 1000 // stagger timestamps
      );

      await prisma.scoreCard.create({
        data: {
          submissionId: table1Submissions[compIdx].id,
          judgeId: judges[judgeIdx].id,
          appearance: scores.app,
          taste: scores.taste,
          texture: scores.tex,
          locked: isLocked,
          submittedAt,
          appearanceSubmittedAt: submittedAt,
        },
      });
    }
  }

  // --- Create a pending correction request for the DQ score ---
  // Judge 4 (judges[3]) wants to correct their DQ score on competitor 104
  const dqScoreCard = await prisma.scoreCard.findFirst({
    where: {
      submissionId: table1Submissions[3].id, // competitor 104
      judgeId: judges[3].id,
    },
  });

  if (dqScoreCard) {
    await prisma.correctionRequest.create({
      data: {
        scoreCardId: dqScoreCard.id,
        judgeId: judges[3].id,
        reason: "I accidentally submitted a 1 (DQ) for appearance. The chicken had good presentation and I meant to score a 7.",
        status: "PENDING",
      },
    });
  }

  // --- Audit log entries ---
  await prisma.auditLog.create({
    data: {
      competitionId: competition.id,
      actorId: organizer.id,
      action: "CREATE_COMPETITION",
      entityId: competition.id,
      entityType: "Competition",
    },
  });

  await prisma.auditLog.create({
    data: {
      competitionId: competition.id,
      actorId: organizer.id,
      action: "ADVANCE_CATEGORY",
      entityId: chickenRound.id,
      entityType: "CategoryRound",
    },
  });

  // --- Summary ---
  console.log("\n  Seed data created successfully!\n");
  console.log("  Competition: American Royal Open 2026 (ACTIVE)");
  console.log("  ───────────────────────────────────────────────");
  console.log("  Organizer:  organizer@bbq-judge.test / organizer123");
  console.log("  ───────────────────────────────────────────────");
  console.log("  Table 1:    CBJ 1 (captain) + CBJ 2–6, PIN: 1234");
  console.log("  Table 2:    CBJ 7 (captain) + CBJ 8–12, PIN: 1234");
  console.log("  ───────────────────────────────────────────────");
  console.log("  Competitors: 101–106 (6 teams)");
  console.log("  Categories:  Chicken (ACTIVE) | Pork Ribs, Pork, Brisket (PENDING)");
  console.log("  ───────────────────────────────────────────────");
  console.log("  Pre-filled:  Table 1 Chicken — 4 of 6 competitors scored");
  console.log("               Competitor 104 has a DQ score + pending correction");
  console.log("               Competitors 105, 106 await scoring");
  console.log("               Table 2 has no scores yet\n");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
