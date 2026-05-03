import { journeySteps } from '../data/journey';
import Badge from './Badge';
import Card from './Card';

function badgeVariant(status) {
  if (status === 'ativo') return 'active';
  if (status === 'concluído') return 'done';
  if (status === 'em construção') return 'muted';
  return 'locked';
}

export default function Jornada({ completedTopics, onBack }) {
  return (
    <Card className="journeyPanel">
      <div className="quizTopbar">
        <button className="ghostButton" type="button" onClick={onBack}>
          Voltar
        </button>
        <span className="mutedText">Trilha Full Stack</span>
      </div>

      <p className="eyebrow">Jornada</p>
      <h2>Seu caminho de aprendizado Full Stack</h2>

      <div className="journeyList">
        {journeySteps.map((step, index) => {
          const status = completedTopics.includes(step.id) ? 'concluído' : step.status;

          return (
            <article key={step.id} className="journeyStep">
              <span className="journeyIndex">{String(index + 1).padStart(2, '0')}</span>
              <div>
                <h3>{step.title}</h3>
                <p>{index === 0 ? 'Base para colaborar e versionar projetos.' : 'Conteúdo planejado para as próximas fases.'}</p>
              </div>
              <Badge variant={badgeVariant(status)}>{status}</Badge>
            </article>
          );
        })}
      </div>
    </Card>
  );
}
