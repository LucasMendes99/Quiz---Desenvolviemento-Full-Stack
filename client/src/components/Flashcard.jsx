import { useMemo, useState } from 'react';
import { flashcards } from '../data/flashcards';
import Card from './Card';

export default function Flashcard({ reviewedIds, onMarkLearned, onBack }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const currentCard = flashcards[currentIndex];
  const isLearned = useMemo(
    () => reviewedIds.includes(currentCard.id),
    [currentCard.id, reviewedIds]
  );

  function goToCard(nextIndex) {
    setCurrentIndex(nextIndex);
    setIsFlipped(false);
  }

  return (
    <Card className="flashcardPanel">
      <div className="quizTopbar">
        <button className="ghostButton" type="button" onClick={onBack}>
          Voltar
        </button>
        <span className="mutedText">
          {currentIndex + 1} de {flashcards.length}
        </span>
      </div>

      <p className="eyebrow">Flashcards de Git e GitHub</p>
      <button className={`flashcard ${isFlipped ? 'flashcardFlipped' : ''}`} type="button" onClick={() => setIsFlipped((value) => !value)}>
        <span>{isFlipped ? 'Verso' : 'Frente'}</span>
        <strong>{isFlipped ? currentCard.back : currentCard.front}</strong>
      </button>

      <div className="actionsRow">
        <button className="secondaryButton" type="button" disabled={currentIndex === 0} onClick={() => goToCard(currentIndex - 1)}>
          Anterior
        </button>
        <button className="primaryButton" type="button" onClick={() => setIsFlipped((value) => !value)}>
          Virar card
        </button>
        <button className="secondaryButton" type="button" disabled={currentIndex === flashcards.length - 1} onClick={() => goToCard(currentIndex + 1)}>
          Próximo
        </button>
      </div>

      <button className="learnedButton" type="button" disabled={isLearned} onClick={() => onMarkLearned(currentCard.id)}>
        {isLearned ? 'Marcado como aprendido' : 'Marcar como aprendido'}
      </button>
    </Card>
  );
}
