import Badge from './Badge';
import Card from './Card';

export default function Quiz({
  question,
  currentIndex,
  totalQuestions,
  selectedOption,
  feedback,
  explanation,
  isFavorite,
  onAnswer,
  onNext,
  onBack,
  onToggleFavorite
}) {
  const progress = Math.round(((currentIndex + 1) / totalQuestions) * 100);

  return (
    <Card className="quizPanel">
      <div className="quizTopbar">
        <button className="ghostButton" type="button" onClick={onBack}>
          Voltar
        </button>
        <div className="quizActions">
          <button className="ghostButton" type="button" onClick={() => onToggleFavorite(question)}>
            {isFavorite ? 'Favoritada' : 'Favoritar'}
          </button>
          <Badge variant="active">{question.level}</Badge>
        </div>
      </div>

      <div className="progressRow">
        <span>
          Pergunta {currentIndex + 1} de {totalQuestions}
        </span>
        <span>{progress}% concluído</span>
      </div>
      <div className="progressTrack" aria-hidden="true">
        <span style={{ width: `${progress}%` }} />
      </div>

      <h2>{question.text}</h2>

      <div className="options">
        {question.options.map((option) => {
          const isSelected = selectedOption === option;
          const stateClass = feedback && isSelected
            ? feedback.isCorrect
              ? 'optionCorrect'
              : 'optionWrong'
            : '';

          return (
            <button
              key={option}
              className={`optionButton ${isSelected ? 'optionSelected' : ''} ${stateClass}`}
              type="button"
              disabled={Boolean(feedback)}
              onClick={() => onAnswer(option)}
            >
              {option}
            </button>
          );
        })}
      </div>

      {feedback && (
        <div className={feedback.isCorrect ? 'feedback feedbackCorrect' : 'feedback feedbackWrong'}>
          <strong>
            {feedback.isCorrect
              ? 'Resposta correta. Bom trabalho.'
              : 'Resposta incorreta. Revise esse conceito nos flashcards.'}
          </strong>
          <p>{explanation}</p>
        </div>
      )}

      <button className="primaryButton nextButton" type="button" disabled={!feedback} onClick={onNext}>
        {currentIndex === totalQuestions - 1 ? 'Ver resultado' : 'Próxima pergunta'}
      </button>
    </Card>
  );
}
