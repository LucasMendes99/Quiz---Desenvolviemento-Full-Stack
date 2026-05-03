import Card from './Card';
import TopicIcon from './TopicIcon';

const modeOptions = [
  {
    id: 'quiz',
    icon: 'Quiz',
    title: 'Responder Quiz',
    description: 'Pratique com perguntas objetivas e veja feedback a cada resposta.'
  },
  {
    id: 'quickQuiz',
    icon: '5x',
    title: 'Quiz rápido',
    description: 'Responda 5 perguntas aleatórias para treinar em poucos minutos.'
  },
  {
    id: 'flashcards',
    icon: 'Cards',
    title: 'Estudar com Flashcards',
    description: 'Revise conceitos essenciais com frente e verso.'
  },
  {
    id: 'review',
    icon: 'Erro',
    title: 'Revisar erros',
    description: 'Volte nas perguntas que você errou e fortaleça os pontos fracos.'
  },
  {
    id: 'progress',
    icon: 'XP',
    title: 'Ver progresso',
    description: 'Veja acertos, XP, melhor pontuação e conquistas locais.'
  }
];

export default function StudyMode({ topic, onBack, onSelectMode }) {
  return (
    <section className="modeScreen">
      <div className="screenHeader">
        <button className="ghostButton" type="button" onClick={onBack}>
          Voltar
        </button>
        <div>
          <p className="eyebrow">Modo de estudo</p>
          <h1>Como você quer estudar {topic.name}?</h1>
        </div>
      </div>

      <div className="selectedTrailCard">
        <TopicIcon slug={topic.slug} isActive />
        <div>
          <strong>{topic.name}</strong>
          <p>Escolha um modo para continuar sua sessão de estudos.</p>
        </div>
      </div>

      <section className="modeGrid" aria-label="Modos de estudo">
        {modeOptions.map((option) => (
          <Card
            key={option.id}
            as="button"
            className="modeCard"
            type="button"
            onClick={() => onSelectMode(option.id)}
          >
            <span className="modeIcon">{option.icon}</span>
            <h2>{option.title}</h2>
            <p>{option.description}</p>
          </Card>
        ))}
      </section>
    </section>
  );
}
