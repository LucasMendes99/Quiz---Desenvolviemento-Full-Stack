import Badge from './Badge';
import TopicIcon from './TopicIcon';
import { useMemo, useState } from 'react';
import { topicDescriptions, trailCatalog } from '../data/topics';

export default function TopicGrid({ topics, onSelectTopic }) {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('todos');
  const enrichedTopics = useMemo(
    () =>
      topics.map((topic) => ({
        ...topic,
        group: trailCatalog.find((trail) => trail.slug === topic.slug)?.group || 'outros'
      })),
    [topics]
  );
  const filteredTopics = enrichedTopics.filter((topic) => {
    const matchesSearch = topic.name.toLowerCase().includes(search.toLowerCase());
    const matchesFilter =
      filter === 'todos' ||
      (filter === 'ativos' && topic.status === 'available') ||
      (filter === 'construcao' && topic.status !== 'available') ||
      topic.group === filter;

    return matchesSearch && matchesFilter;
  });

  return (
    <>
      <div className="trailFilters">
        <input
          type="search"
          value={search}
          placeholder="Buscar trilha..."
          onChange={(event) => setSearch(event.target.value)}
        />
        <select value={filter} onChange={(event) => setFilter(event.target.value)}>
          <option value="todos">Todas</option>
          <option value="ativos">Ativas</option>
          <option value="construcao">Em construção</option>
          <option value="fundamentos">Fundamentos</option>
          <option value="frontend">Frontend</option>
          <option value="backend">Backend</option>
        </select>
      </div>

      <section className="topics" aria-label="Temas do quiz">
      {filteredTopics.map((topic) => {
        const description = topicDescriptions[topic.slug] || 'Conteúdo em preparação.';
        const isAvailable = topic.status === 'available';

        if (isAvailable) {
          return (
            <button
              key={topic.id}
              className="topic topicActive"
              type="button"
              onClick={() => onSelectTopic(topic)}
            >
              <div className="topicMain">
                <TopicIcon slug={topic.slug} isActive />
                <div className="topicContent">
                  <Badge variant="active">Ativo</Badge>
                  <h2>{topic.name}</h2>
                  <p>{description}</p>
                </div>
              </div>
              <span className="topicAction">Escolher trilha</span>
            </button>
          );
        }

        return (
          <article key={topic.id} className="topic">
            <div className="topicMain">
              <TopicIcon slug={topic.slug} />
              <div className="topicContent">
                <h2>{topic.name}</h2>
                <p>{description}</p>
              </div>
            </div>
            <Badge>Em construção</Badge>
          </article>
        );
      })}
      </section>
    </>
  );
}
