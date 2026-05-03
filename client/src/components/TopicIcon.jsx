import { topicIcons } from '../data/topics';

export default function TopicIcon({ slug, isActive }) {
  return (
    <span className={isActive ? 'topicIcon topicIconActive' : 'topicIcon'} aria-hidden="true">
      {topicIcons[slug] || 'Dev'}
    </span>
  );
}
