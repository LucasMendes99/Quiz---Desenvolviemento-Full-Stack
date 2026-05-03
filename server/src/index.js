import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import { PrismaClient } from '@prisma/client';
import { gitQuestions, topics as initialTopics } from './initialData.js';

dotenv.config();

const app = express();
const prisma = process.env.DATABASE_URL ? new PrismaClient() : null;
const port = process.env.PORT || 3001;
const QUESTION_LIMIT = 10;
const memoryAttempts = [];
let nextMemoryAttemptId = 1;

app.use(cors());
app.use(express.json());

function toPublicQuestion(question) {
  return {
    id: question.id,
    level: question.level,
    text: question.text,
    options: question.options
  };
}

function resultMessage(score, total) {
  const percent = total === 0 ? 0 : score / total;

  if (percent === 1) {
    return 'Excelente! Você acertou todas.';
  }

  if (percent >= 0.7) {
    return 'Muito bom! Você já tem uma boa base.';
  }

  if (percent >= 0.4) {
    return 'Bom começo. Revise os conceitos e tente novamente.';
  }

  return 'Continue praticando. Git e GitHub ficam mais claros com repeticao.';
}

function shuffle(items) {
  return [...items].sort(() => Math.random() - 0.5);
}

function quizLimit(value) {
  const parsedLimit = Number(value);

  if (!Number.isInteger(parsedLimit)) {
    return QUESTION_LIMIT;
  }

  return Math.min(QUESTION_LIMIT, Math.max(1, parsedLimit));
}

app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    database: prisma ? 'postgresql' : 'memory'
  });
});

app.get('/api/topics', async (req, res, next) => {
  try {
    if (!prisma) {
      return res.json({ topics: initialTopics });
    }

    const topics = await prisma.topic.findMany({
      orderBy: { id: 'asc' }
    });

    res.json({ topics });
  } catch (error) {
    next(error);
  }
});

app.post('/api/quizzes/start', async (req, res, next) => {
  try {
    const topicSlug = req.body.topicSlug || 'git-e-github';
    const limit = quizLimit(req.body.limit);

    if (!prisma) {
      const topic = initialTopics.find((item) => item.slug === topicSlug);

      if (!topic) {
        return res.status(404).json({ message: 'Tema não encontrado.' });
      }

      if (topic.status !== 'available') {
        return res.status(400).json({ message: 'Este tema ainda está em construção.' });
      }

      const topicQuestions = gitQuestions.filter((question) => question.topicId === topic.id);

      if (topicQuestions.length < limit) {
        return res.status(400).json({
          message: `Este tema precisa ter pelo menos ${limit} perguntas.`
        });
      }

      const selectedQuestions = shuffle(topicQuestions).slice(0, limit);
      const attempt = {
        id: nextMemoryAttemptId,
        topicId: topic.id,
        questionIds: selectedQuestions.map((question) => question.id),
        answers: [],
        score: 0,
        totalQuestions: selectedQuestions.length,
        finishedAt: null
      };

      nextMemoryAttemptId += 1;
      memoryAttempts.push(attempt);

      return res.status(201).json({
        attemptId: attempt.id,
        topic: {
          id: topic.id,
          name: topic.name,
          slug: topic.slug
        },
        questions: selectedQuestions.map(toPublicQuestion)
      });
    }

    const topic = await prisma.topic.findUnique({
      where: { slug: topicSlug },
      include: { questions: true }
    });

    if (!topic) {
      return res.status(404).json({ message: 'Tema não encontrado.' });
    }

    if (topic.status !== 'available') {
      return res.status(400).json({ message: 'Este tema ainda está em construção.' });
    }

    if (topic.questions.length < limit) {
      return res.status(400).json({
        message: `Este tema precisa ter pelo menos ${limit} perguntas.`
      });
    }

    const selectedQuestions = shuffle(topic.questions).slice(0, limit);

    const attempt = await prisma.quizAttempt.create({
      data: {
        topicId: topic.id,
        totalQuestions: selectedQuestions.length,
        questions: {
          create: selectedQuestions.map((question) => ({
            questionId: question.id
          }))
        }
      }
    });

    res.status(201).json({
      attemptId: attempt.id,
      topic: {
        id: topic.id,
        name: topic.name,
        slug: topic.slug
      },
      questions: selectedQuestions.map(toPublicQuestion)
    });
  } catch (error) {
    next(error);
  }
});

app.post('/api/quizzes/:attemptId/answer', async (req, res, next) => {
  try {
    const attemptId = Number(req.params.attemptId);
    const questionId = Number(req.body.questionId);
    const selectedOption = req.body.selectedOption;

    if (!Number.isInteger(attemptId) || !Number.isInteger(questionId) || !selectedOption) {
      return res.status(400).json({ message: 'Dados da resposta invalidos.' });
    }

    if (!prisma) {
      const attempt = memoryAttempts.find((item) => item.id === attemptId);

      if (!attempt) {
        return res.status(404).json({ message: 'Tentativa de quiz não encontrada.' });
      }

      if (attempt.finishedAt) {
        return res.status(400).json({ message: 'Este quiz já foi finalizado.' });
      }

      const question = gitQuestions.find((item) => item.id === questionId);

      if (!question || question.topicId !== attempt.topicId || !attempt.questionIds.includes(questionId)) {
        return res.status(400).json({
          message: 'Esta pergunta não pertence a esta tentativa.'
        });
      }

      if (!question.options.includes(selectedOption)) {
        return res.status(400).json({ message: 'Alternativa inválida para esta pergunta.' });
      }

      const existingAnswer = attempt.answers.find((answer) => answer.questionId === questionId);

      if (existingAnswer) {
        return res.status(400).json({ message: 'Esta pergunta já foi respondida.' });
      }

      const isCorrect = question.correctAnswer === selectedOption;
      attempt.answers.push({ questionId, selectedOption, isCorrect });
      attempt.score = attempt.answers.filter((answer) => answer.isCorrect).length;

      return res.json({
        isCorrect,
        currentScore: attempt.score
      });
    }

    const attempt = await prisma.quizAttempt.findUnique({
      where: { id: attemptId },
      include: {
        topic: true,
        answers: true,
        questions: true
      }
    });

    if (!attempt) {
      return res.status(404).json({ message: 'Tentativa de quiz não encontrada.' });
    }

    if (attempt.finishedAt) {
      return res.status(400).json({ message: 'Este quiz já foi finalizado.' });
    }

    const question = await prisma.question.findUnique({
      where: { id: questionId }
    });

    const belongsToAttempt = attempt.questions.some(
      (attemptQuestion) => attemptQuestion.questionId === questionId
    );

    if (!question || question.topicId !== attempt.topicId || !belongsToAttempt) {
      return res.status(400).json({
        message: 'Esta pergunta não pertence a esta tentativa.'
      });
    }

    if (!question.options.includes(selectedOption)) {
      return res.status(400).json({ message: 'Alternativa inválida para esta pergunta.' });
    }

    const existingAnswer = attempt.answers.find((answer) => answer.questionId === questionId);

    if (existingAnswer) {
      return res.status(400).json({ message: 'Esta pergunta já foi respondida.' });
    }

    const isCorrect = question.correctAnswer === selectedOption;

    await prisma.quizAnswer.create({
      data: {
        attemptId,
        questionId,
        selectedOption,
        isCorrect
      }
    });

    const currentScore = await prisma.quizAnswer.count({
      where: {
        attemptId,
        isCorrect: true
      }
    });

    await prisma.quizAttempt.update({
      where: { id: attemptId },
      data: { score: currentScore }
    });

    res.json({
      isCorrect,
      currentScore
    });
  } catch (error) {
    next(error);
  }
});

app.post('/api/quizzes/:attemptId/finish', async (req, res, next) => {
  try {
    const attemptId = Number(req.params.attemptId);

    if (!Number.isInteger(attemptId)) {
      return res.status(400).json({ message: 'Tentativa inválida.' });
    }

    if (!prisma) {
      const attempt = memoryAttempts.find((item) => item.id === attemptId);

      if (!attempt) {
        return res.status(404).json({ message: 'Tentativa de quiz não encontrada.' });
      }

      attempt.score = attempt.answers.filter((answer) => answer.isCorrect).length;
      attempt.finishedAt = new Date();

      return res.json({
        result: {
          score: attempt.score,
          totalQuestions: attempt.totalQuestions,
          message: resultMessage(attempt.score, attempt.totalQuestions)
        }
      });
    }

    const attempt = await prisma.quizAttempt.findUnique({
      where: { id: attemptId },
      include: { answers: true }
    });

    if (!attempt) {
      return res.status(404).json({ message: 'Tentativa de quiz não encontrada.' });
    }

    const score = attempt.answers.filter((answer) => answer.isCorrect).length;

    const updatedAttempt = await prisma.quizAttempt.update({
      where: { id: attemptId },
      data: {
        score,
        finishedAt: new Date()
      }
    });

    res.json({
      result: {
        score: updatedAttempt.score,
        totalQuestions: updatedAttempt.totalQuestions,
        message: resultMessage(updatedAttempt.score, updatedAttempt.totalQuestions)
      }
    });
  } catch (error) {
    next(error);
  }
});

app.use((req, res) => {
  res.status(404).json({ message: 'Rota não encontrada.' });
});

app.use((error, req, res, next) => {
  console.error(error);
  res.status(500).json({ message: 'Erro interno do servidor.' });
});

app.listen(port, () => {
  console.log(`API rodando em http://localhost:${port}`);
  console.log(prisma ? 'Usando PostgreSQL via DATABASE_URL.' : 'Usando dados em memoria. Configure DATABASE_URL para usar PostgreSQL.');
});
