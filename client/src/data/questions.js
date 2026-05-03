export const questionSources = {
  'git-e-github': {
    source: 'API /api/quizzes/start',
    description: 'As perguntas de Git e GitHub são servidas pelo backend e podem usar PostgreSQL ou modo memória.'
  }
};

export const questionExplanations = {
  1: 'Git controla o histórico do código, permitindo registrar versões, comparar mudanças e voltar para estados anteriores.',
  2: 'git init inicializa um repositório Git na pasta atual, criando a estrutura necessária para versionar arquivos.',
  3: 'git status mostra quais arquivos foram modificados, adicionados ao stage ou ainda não estão sendo rastreados.',
  4: 'GitHub é uma plataforma online para hospedar repositórios Git, colaborar com outras pessoas e revisar código.',
  5: 'git add coloca arquivos na área de preparação, indicando que eles devem entrar no próximo commit.',
  6: 'git commit cria um registro no histórico com as mudanças preparadas e uma mensagem descritiva.',
  7: 'git push envia commits locais para um repositório remoto, como um repositório hospedado no GitHub.',
  8: 'git pull busca mudanças do repositório remoto e integra essas mudanças no seu repositório local.',
  9: 'Branches permitem desenvolver funcionalidades ou correções separadamente antes de juntar tudo na branch principal.',
  10: 'Pull Requests organizam a revisão de código antes de uma alteração ser integrada ao projeto principal.'
};
