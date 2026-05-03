import Card from './Card';

export default function RevisaoErros({ wrongQuestions, onBack, onClear }) {
  return (
    <Card className="reviewPanel">
      <div className="quizTopbar">
        <button className="ghostButton" type="button" onClick={onBack}>
          Voltar
        </button>
        <span className="mutedText">{wrongQuestions.length} erros salvos</span>
      </div>

      <p className="eyebrow">Revisão de erros</p>
      <h2>Perguntas para revisar</h2>

      {wrongQuestions.length === 0 ? (
        <p className="mutedParagraph">Nenhuma pergunta errada por enquanto. Responda um quiz para montar sua revisão.</p>
      ) : (
        <div className="reviewList">
          {wrongQuestions.map((question) => (
            <article key={`${question.id}-${question.savedAt}`} className="reviewItem">
              <h3>{question.text}</h3>
              <p>Sua resposta: {question.selectedOption}</p>
            </article>
          ))}
        </div>
      )}

      <button className="secondaryButton" type="button" disabled={wrongQuestions.length === 0} onClick={onClear}>
        Limpar revisão
      </button>
    </Card>
  );
}
