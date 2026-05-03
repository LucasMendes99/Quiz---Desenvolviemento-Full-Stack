import Card from './Card';

export default function Sobre({ onBack }) {
  return (
    <Card className="aboutPanel">
      <div className="quizTopbar">
        <button className="ghostButton" type="button" onClick={onBack}>
          Voltar
        </button>
        <span className="mutedText">Sem login. Sem IA. Progresso local.</span>
      </div>

      <p className="eyebrow">Sobre o projeto</p>
      <h2>FullStack Quiz</h2>
      <p className="mutedParagraph">
        Plataforma de estudos para desenvolvedores praticarem fundamentos full stack com quizzes,
        flashcards, trilhas, revisão de erros, favoritos e progresso salvo no navegador.
      </p>
    </Card>
  );
}
