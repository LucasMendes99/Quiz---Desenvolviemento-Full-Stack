const STORAGE_KEY = 'quiz-full-stack-progress';

const defaultProgress = {
  answeredQuestions: 0,
  correctAnswers: 0,
  bestScore: 0,
  completedTopics: [],
  reviewedFlashcards: [],
  wrongQuestions: [],
  favoriteQuestions: [],
  attemptHistory: [],
  continueSession: null,
  xp: 0,
  badges: []
};

export function loadProgress() {
  try {
    const savedProgress = localStorage.getItem(STORAGE_KEY);
    return savedProgress ? normalizeProgress(JSON.parse(savedProgress)) : defaultProgress;
  } catch {
    return defaultProgress;
  }
}

export function saveProgress(progress) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
}

export function accuracy(progress) {
  if (!progress.answeredQuestions) {
    return 0;
  }

  return Math.round((progress.correctAnswers / progress.answeredQuestions) * 100);
}

export function levelFromXp(xp) {
  return Math.floor(xp / 100) + 1;
}

export function normalizeProgress(progress) {
  return {
    ...defaultProgress,
    ...progress,
    completedTopics: progress.completedTopics || [],
    reviewedFlashcards: progress.reviewedFlashcards || [],
    wrongQuestions: progress.wrongQuestions || [],
    favoriteQuestions: progress.favoriteQuestions || [],
    attemptHistory: progress.attemptHistory || [],
    badges: progress.badges || []
  };
}
