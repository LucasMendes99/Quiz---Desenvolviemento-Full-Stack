import Card from './Card';
import { levelFromXp } from '../utils/progressStorage';

export default function Gamification({ progress }) {
  const level = levelFromXp(progress.xp);
  const nextLevelXp = level * 100;
  const currentLevelXp = (level - 1) * 100;
  const levelProgress = Math.min(100, Math.round(((progress.xp - currentLevelXp) / (nextLevelXp - currentLevelXp)) * 100));

  return (
    <Card className="gamificationCard">
      <div>
        <p className="eyebrow">Gamificação</p>
        <h2>Nível {level}</h2>
        <p className="mutedParagraph">{progress.xp} XP acumulados</p>
      </div>

      <div className="progressTrack" aria-hidden="true">
        <span style={{ width: `${levelProgress}%` }} />
      </div>

      <div className="badgeShelf">
        {progress.badges.length > 0 ? (
          progress.badges.map((badge) => <span key={badge}>{badge}</span>)
        ) : (
          <span>Nenhuma conquista ainda</span>
        )}
      </div>
    </Card>
  );
}
