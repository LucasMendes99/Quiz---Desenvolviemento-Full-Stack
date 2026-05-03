import Card from './Card';

export default function Landing({ progress, onStart, onTrails, onContinue }) {
  const stats = [
    { label: 'Quizzes', value: '10+' },
    { label: 'Flashcards', value: '5' },
    { label: 'Trilhas', value: '6' },
    { label: 'Progresso local', value: `${progress.bestScore}%` }
  ];

  return (
    <section className="landing">
      <div className="landingHero">
        <p className="brandName">FullStack Quiz</p>
        <h1>Domine Desenvolvimento Full Stack</h1>
        <p className="subtitle">
          Aprenda desenvolvimento web praticando com quizzes, flashcards e trilhas de estudo.
        </p>

        <div className="heroActions">
          {progress.continueSession && (
            <button className="continueButton" type="button" onClick={onContinue}>
              Continuar de onde parei
            </button>
          )}
          <button className="primaryButton" type="button" onClick={onStart}>
            Começar agora
          </button>
          <button className="secondaryButton" type="button" onClick={onTrails}>
            Ver trilhas
          </button>
        </div>
      </div>

      <section className="quickStats" aria-label="Resumo da plataforma">
        {stats.map((stat) => (
          <Card key={stat.label} className="quickStat">
            <span>{stat.label}</span>
            <strong>{stat.value}</strong>
          </Card>
        ))}
      </section>
    </section>
  );
}
