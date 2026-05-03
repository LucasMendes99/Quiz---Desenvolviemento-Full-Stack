import { PrismaClient } from '@prisma/client';
import { gitQuestions, topics } from '../src/initialData.js';

const prisma = new PrismaClient();

async function main() {
  for (const topic of topics) {
    const { id, ...topicData } = topic;

    await prisma.topic.upsert({
      where: { slug: topicData.slug },
      update: topicData,
      create: topicData
    });
  }

  const gitTopic = await prisma.topic.findUniqueOrThrow({
    where: { slug: 'git-e-github' }
  });

  const attempts = await prisma.quizAttempt.findMany({
    where: { topicId: gitTopic.id },
    select: { id: true }
  });
  const attemptIds = attempts.map((attempt) => attempt.id);

  if (attemptIds.length > 0) {
    await prisma.quizAnswer.deleteMany({
      where: { attemptId: { in: attemptIds } }
    });

    await prisma.quizAttemptQuestion.deleteMany({
      where: { attemptId: { in: attemptIds } }
    });

    await prisma.quizAttempt.deleteMany({
      where: { id: { in: attemptIds } }
    });
  }

  await prisma.question.deleteMany({
    where: { topicId: gitTopic.id }
  });

  await prisma.question.createMany({
    data: gitQuestions.map((question) => ({
      level: question.level,
      text: question.text,
      options: question.options,
      correctAnswer: question.correctAnswer,
      topicId: gitTopic.id
    }))
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
