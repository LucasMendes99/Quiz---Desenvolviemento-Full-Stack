import Card from './Card';
import { accuracy } from '../utils/progressStorage';

export default function Dashboard({ progress, trailsAvailable }) {
  const stats = [
    { label: 'Perguntas respondidas', value: progress.answeredQuestions },
    { label: 'Acertos', value: progress.correctAnswers },
    { label: 'Taxa de acerto', value: `${accuracy(progress)}%` },
    { label: 'Flashcards revisados', value: progress.reviewedFlashcards.length },
    { label: 'Trilhas disponíveis', value: trailsAvailable },
    { label: 'Temas concluídos', value: progress.completedTopics.length },
    { label: 'XP', value: progress.xp },
    { label: 'Tentativas', value: progress.attemptHistory.length },
    { label: 'Favoritas', value: progress.favoriteQuestions.length }
  ];

  return (
    <section className="dashboard" aria-label="Dashboard de progresso">
      {stats.map((stat) => (
        <Card key={stat.label} className="statCard">
          <span>{stat.label}</span>
          <strong>{stat.value}</strong>
        </Card>
      ))}
    </section>
  );
}
