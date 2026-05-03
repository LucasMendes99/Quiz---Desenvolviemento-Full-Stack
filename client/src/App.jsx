import { useEffect, useMemo, useState } from 'react';
import Dashboard from './components/Dashboard';
import Flashcard from './components/Flashcard';
import Gamification from './components/Gamification';
import Jornada from './components/Jornada';
import Landing from './components/Landing';
import NotFound from './components/NotFound';
import Quiz from './components/Quiz';
import RevisaoErros from './components/RevisaoErros';
import Resultado from './components/Resultado';
import Sobre from './components/Sobre';
import StudyMode from './components/StudyMode';
import TopicGrid from './components/TopicGrid';
import Card from './components/Card';
import { questionExplanations } from './data/questions';
import { loadProgress, saveProgress } from './utils/progressStorage';

const VIEWS = {
  landing: 'landing',
  trails: 'trails',
  mode: 'mode',
  progress: 'progress',
  quiz: 'quiz',
  result: 'result',
  flashcards: 'flashcards',
  review: 'review',
  about: 'about',
  notFound: 'notFound'
};

const ACTIVE_TOPIC = 'git-e-github';

async function apiRequest(url, options) {
  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json'
    },
    ...options
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || 'Não foi possível completar a ação.');
  }

  return data;
}

export default function App() {
  const [topics, setTopics] = useState([]);
  const [view, setView] = useState(() => (window.location.pathname === '/' ? VIEWS.landing : VIEWS.notFound));
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [attemptId, setAttemptId] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState('');
  const [feedback, setFeedback] = useState(null);
  const [score, setScore] = useState(0);
  const [quizMode, setQuizMode] = useState('complete');
  const [quizLimit, setQuizLimit] = useState(10);
  const [result, setResult] = useState(null);
  const [progress, setProgress] = useState(loadProgress);
  const [error, setError] = useState('');

  const currentQuestion = questions[currentIndex];
  const availableTopic = useMemo(
    () => topics.find((topic) => topic.status === 'available'),
    [topics]
  );
  const visibleTopics = topics.filter((topic) =>
    ['git-e-github', 'html-css', 'javascript', 'typescript', 'react', 'node-js'].includes(topic.slug)
  );
  const trailsAvailable = visibleTopics.filter((topic) => topic.status === 'available').length;

  useEffect(() => {
    loadTopics();
  }, []);

  useEffect(() => {
    saveProgress(progress);
  }, [progress]);

  async function loadTopics() {
    try {
      setIsLoading(true);
      const data = await apiRequest('/api/topics');
      setTopics(data.topics);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }

  async function startQuiz(topicSlug, limit = 10, mode = 'complete') {
    try {
      setIsLoading(true);
      setError('');
      const data = await apiRequest('/api/quizzes/start', {
        method: 'POST',
        body: JSON.stringify({ topicSlug, limit })
      });

      setAttemptId(data.attemptId);
      setQuestions(data.questions);
      setCurrentIndex(0);
      setSelectedOption('');
      setFeedback(null);
      setScore(0);
      setQuizMode(mode);
      setQuizLimit(limit);
      setResult(null);
      setProgress((currentProgress) => ({
        ...currentProgress,
        continueSession: {
          view: 'mode',
          topicSlug
        }
      }));
      setView(VIEWS.quiz);
    } catch (err) {
      setError(err.message);
      setView(VIEWS.trails);
    } finally {
      setIsLoading(false);
    }
  }

  async function answerQuestion(option) {
    if (!currentQuestion || feedback) {
      return;
    }

    try {
      setError('');
      setSelectedOption(option);
      const data = await apiRequest(`/api/quizzes/${attemptId}/answer`, {
        method: 'POST',
        body: JSON.stringify({
          questionId: currentQuestion.id,
          selectedOption: option
        })
      });

      setFeedback({ isCorrect: data.isCorrect });
      setScore(data.currentScore);
      setProgress((currentProgress) => ({
        ...currentProgress,
        answeredQuestions: currentProgress.answeredQuestions + 1,
        correctAnswers: currentProgress.correctAnswers + (data.isCorrect ? 1 : 0),
        xp: currentProgress.xp + (data.isCorrect ? 10 : 0),
        wrongQuestions: data.isCorrect
          ? currentProgress.wrongQuestions
          : [
              {
                id: currentQuestion.id,
                text: currentQuestion.text,
                selectedOption: option,
                savedAt: Date.now()
              },
              ...currentProgress.wrongQuestions.filter((question) => question.id !== currentQuestion.id)
            ].slice(0, 12)
      }));
    } catch (err) {
      setError(err.message);
    }
  }

  async function nextQuestion() {
    const isLastQuestion = currentIndex === questions.length - 1;

    if (!isLastQuestion) {
      setCurrentIndex((index) => index + 1);
      setSelectedOption('');
      setFeedback(null);
      return;
    }

    await finishQuiz();
  }

  async function finishQuiz() {
    try {
      const data = await apiRequest(`/api/quizzes/${attemptId}/finish`, {
        method: 'POST'
      });
      const finalResult = data.result;
      const percent = Math.round((finalResult.score / finalResult.totalQuestions) * 100);
      const finishedAt = new Date().toISOString();

      setResult(finalResult);
      setProgress((currentProgress) => ({
        ...currentProgress,
        bestScore: Math.max(currentProgress.bestScore, percent),
        completedTopics: percent >= 70 && !currentProgress.completedTopics.includes(ACTIVE_TOPIC)
          ? [...currentProgress.completedTopics, ACTIVE_TOPIC]
          : currentProgress.completedTopics,
        badges: [
          ...new Set([
            ...currentProgress.badges,
            'Primeiro Quiz',
            ...(percent >= 90 ? ['Mestre do Git'] : [])
          ])
        ],
        attemptHistory: [
          {
            id: `${attemptId}-${finishedAt}`,
            topicSlug: selectedTopic?.slug || ACTIVE_TOPIC,
            topicName: selectedTopic?.name || 'Git e GitHub',
            mode: quizMode === 'quick' ? 'Quiz rápido' : 'Quiz completo',
            score: finalResult.score,
            totalQuestions: finalResult.totalQuestions,
            percent,
            finishedAt
          },
          ...currentProgress.attemptHistory
        ].slice(0, 10),
        continueSession: {
          view: 'result',
          topicSlug: selectedTopic?.slug || ACTIVE_TOPIC
        }
      }));
      setView(VIEWS.result);
    } catch (err) {
      setError(err.message);
    }
  }

  function markFlashcardAsLearned(cardId) {
    setProgress((currentProgress) => {
      if (currentProgress.reviewedFlashcards.includes(cardId)) {
        return currentProgress;
      }

      return {
        ...currentProgress,
        reviewedFlashcards: [...currentProgress.reviewedFlashcards, cardId],
        xp: currentProgress.xp + 5
      };
    });
  }

  function toggleFavoriteQuestion(question) {
    setProgress((currentProgress) => {
      const exists = currentProgress.favoriteQuestions.some((favorite) => favorite.id === question.id);

      return {
        ...currentProgress,
        favoriteQuestions: exists
          ? currentProgress.favoriteQuestions.filter((favorite) => favorite.id !== question.id)
          : [
              {
                id: question.id,
                text: question.text,
                savedAt: Date.now()
              },
              ...currentProgress.favoriteQuestions
            ].slice(0, 20)
      };
    });
  }

  function clearWrongQuestions() {
    setProgress((currentProgress) => ({
      ...currentProgress,
      wrongQuestions: []
    }));
  }

  function goHome() {
    setError('');
    setView(VIEWS.landing);
  }

  function openTrails() {
    setError('');
    setView(VIEWS.trails);
  }

  function selectTopic(topic) {
    if (topic.status !== 'available') {
      return;
    }

    setSelectedTopic(topic);
    setProgress((currentProgress) => ({
      ...currentProgress,
      continueSession: {
        view: 'mode',
        topicSlug: topic.slug
      }
    }));
    setError('');
    setView(VIEWS.mode);
  }

  function selectMode(mode) {
    if (!selectedTopic) {
      return;
    }

    if (mode === 'quiz') {
      startQuiz(selectedTopic.slug, 10, 'complete');
      return;
    }

    if (mode === 'quickQuiz') {
      startQuiz(selectedTopic.slug, 5, 'quick');
      return;
    }

    if (mode === 'flashcards') {
      setView(VIEWS.flashcards);
      return;
    }

    if (mode === 'review') {
      setView(VIEWS.review);
      return;
    }

    if (mode === 'progress') {
      setView(VIEWS.progress);
    }
  }

  function continueSession() {
    const session = progress.continueSession;

    if (!session) {
      openTrails();
      return;
    }

    const topic = visibleTopics.find((item) => item.slug === session.topicSlug) || availableTopic;

    if (topic) {
      setSelectedTopic(topic);
    }

    setView(session.view === 'result' ? VIEWS.progress : VIEWS.mode);
  }

  return (
    <main className="page">
      <section className="shell">
        <header className="header">
          <div>
            <p className="eyebrow">FullStack Quiz</p>
            <h1>FullStack Quiz</h1>
            <p className="subtitle">
              Quizzes, flashcards e trilhas para praticar desenvolvimento web.
            </p>
          </div>

          <nav className="navTabs" aria-label="Navegação principal">
            <button className={view === VIEWS.landing ? 'navTab active' : 'navTab'} type="button" onClick={goHome}>
              Início
            </button>
            <button className={view === VIEWS.trails ? 'navTab active' : 'navTab'} type="button" onClick={openTrails}>
              Trilhas
            </button>
            <button className={view === VIEWS.progress ? 'navTab active' : 'navTab'} type="button" onClick={() => setView(VIEWS.progress)}>
              Progresso
            </button>
            <button className={view === VIEWS.review ? 'navTab active' : 'navTab'} type="button" onClick={() => setView(VIEWS.review)}>
              Revisão
            </button>
            <button className={view === VIEWS.about ? 'navTab active' : 'navTab'} type="button" onClick={() => setView(VIEWS.about)}>
              Sobre
            </button>
          </nav>
        </header>

        {error && (
          <div className="notice error">
            <strong>Erro:</strong> {error}
          </div>
        )}

        {isLoading && (
          <section className="card">
            <p>Carregando...</p>
          </section>
        )}

        {!isLoading && view === VIEWS.landing && (
          <Landing progress={progress} onStart={openTrails} onTrails={openTrails} onContinue={continueSession} />
        )}

        {!isLoading && view === VIEWS.trails && (
          <div className="homeStack">
            <section className="homeIntro">
              <div>
                <p className="eyebrow">Escolha de trilha</p>
                <h2>O que você quer estudar hoje?</h2>
              </div>
              <span className="bestScore">Melhor pontuação: {progress.bestScore}%</span>
            </section>

            <TopicGrid topics={visibleTopics} onSelectTopic={selectTopic} />
          </div>
        )}

        {!isLoading && view === VIEWS.mode && selectedTopic && (
          <StudyMode topic={selectedTopic} onBack={openTrails} onSelectMode={selectMode} />
        )}

        {!isLoading && view === VIEWS.progress && (
          <div className="homeStack">
            <section className="homeIntro">
              <div>
                <p className="eyebrow">Progresso local</p>
                <h2>Seu painel de evolução</h2>
              </div>
              <button className="ghostButton" type="button" onClick={selectedTopic ? () => setView(VIEWS.mode) : openTrails}>
                Voltar
              </button>
            </section>
            <Dashboard progress={progress} trailsAvailable={trailsAvailable} />
            <Gamification progress={progress} />
            <Jornada completedTopics={progress.completedTopics} onBack={openTrails} />
            <div className="historyGrid">
              <Card className="historyPanel">
                <p className="eyebrow">Histórico</p>
                <h2>Tentativas recentes</h2>
                {progress.attemptHistory.length === 0 ? (
                  <p className="mutedParagraph">Nenhuma tentativa finalizada ainda.</p>
                ) : (
                  progress.attemptHistory.map((attempt) => (
                    <article key={attempt.id} className="historyItem">
                      <strong>{attempt.topicName}</strong>
                      <span>{attempt.mode} · {attempt.percent}% · {attempt.score}/{attempt.totalQuestions}</span>
                    </article>
                  ))
                )}
              </Card>
              <Card className="historyPanel">
                <p className="eyebrow">Favoritas</p>
                <h2>Perguntas salvas</h2>
                {progress.favoriteQuestions.length === 0 ? (
                  <p className="mutedParagraph">Favorite perguntas durante o quiz para revisar depois.</p>
                ) : (
                  progress.favoriteQuestions.map((question) => (
                    <article key={question.id} className="historyItem">
                      <strong>{question.text}</strong>
                    </article>
                  ))
                )}
              </Card>
            </div>
          </div>
        )}

        {!isLoading && view === VIEWS.quiz && currentQuestion && (
          <Quiz
            question={currentQuestion}
            currentIndex={currentIndex}
            totalQuestions={questions.length}
            selectedOption={selectedOption}
            feedback={feedback}
            explanation={questionExplanations[currentQuestion.id] || 'Revise esse conceito e pratique novamente para fixar melhor.'}
            isFavorite={progress.favoriteQuestions.some((favorite) => favorite.id === currentQuestion.id)}
            onAnswer={answerQuestion}
            onNext={nextQuestion}
            onBack={selectedTopic ? () => setView(VIEWS.mode) : openTrails}
            onToggleFavorite={toggleFavoriteQuestion}
          />
        )}

        {!isLoading && view === VIEWS.result && result && (
          <Resultado
            result={result}
            bestScore={progress.bestScore}
            onRetry={() => (selectedTopic || availableTopic) && startQuiz((selectedTopic || availableTopic).slug, quizLimit, quizMode)}
            onBackToTrails={openTrails}
          />
        )}

        {!isLoading && view === VIEWS.flashcards && (
          <Flashcard
            reviewedIds={progress.reviewedFlashcards}
            onMarkLearned={markFlashcardAsLearned}
            onBack={selectedTopic ? () => setView(VIEWS.mode) : openTrails}
          />
        )}

        {!isLoading && view === VIEWS.review && (
          <RevisaoErros wrongQuestions={progress.wrongQuestions} onBack={selectedTopic ? () => setView(VIEWS.mode) : openTrails} onClear={clearWrongQuestions} />
        )}

        {!isLoading && view === VIEWS.about && (
          <Sobre onBack={goHome} />
        )}

        {!isLoading && view === VIEWS.notFound && (
          <NotFound onHome={goHome} />
        )}

      </section>
    </main>
  );
}
