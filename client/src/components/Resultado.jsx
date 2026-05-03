import Card from './Card';

function performanceMessage(percent) {
  if (percent >= 90) {
    return 'Excelente desempenho. Você domina bem os fundamentos desta trilha.';
  }

  if (percent >= 70) {
    return 'Muito bom. Você está construindo uma base forte.';
  }

  if (percent >= 50) {
    return 'Bom começo. Revise os pontos de dúvida e refaça o quiz.';
  }

  return 'Continue praticando. Use os flashcards antes de tentar novamente.';
}

export default function Resultado({ result, bestScore, onRetry, onBackToTrails }) {
  const errors = result.totalQuestions - result.score;
  const percent = Math.round((result.score / result.totalQuestions) * 100);

  return (
    <Card className="resultPanel">
      <p className="eyebrow">Resultado final</p>
      <h2>{percent}% de aproveitamento</h2>
      <p>{performanceMessage(percent)}</p>

      <div className="resultGrid">
        <div>
          <span>Pontuação</span>
          <strong>{result.score}/{result.totalQuestions}</strong>
        </div>
        <div>
          <span>Acertos</span>
          <strong>{result.score}</strong>
        </div>
        <div>
          <span>Erros</span>
          <strong>{errors}</strong>
        </div>
        <div>
          <span>Porcentagem</span>
          <strong>{percent}%</strong>
        </div>
        <div>
          <span>Melhor score</span>
          <strong>{Math.max(bestScore, percent)}%</strong>
        </div>
      </div>

      <div className="actionsRow">
        <button className="primaryButton" type="button" onClick={onRetry}>
          Refazer quiz
        </button>
        <button className="secondaryButton" type="button" onClick={onBackToTrails}>
          Voltar para trilhas
        </button>
      </div>
    </Card>
  );
}
