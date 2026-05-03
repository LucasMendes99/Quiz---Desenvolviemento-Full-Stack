import Card from './Card';

export default function NotFound({ onHome }) {
  return (
    <Card className="notFoundPanel">
      <p className="eyebrow">404</p>
      <h2>Página não encontrada</h2>
      <p className="mutedParagraph">Essa área não existe no FullStack Quiz. Volte para o início e escolha uma trilha.</p>
      <button className="primaryButton" type="button" onClick={onHome}>
        Voltar para o início
      </button>
    </Card>
  );
}
