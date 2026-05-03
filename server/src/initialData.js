export const topics = [
  { id: 1, name: 'Git e GitHub', slug: 'git-e-github', status: 'available' },
  { id: 2, name: 'Fundamentos do HTML e do CSS', slug: 'html-css', status: 'construction' },
  { id: 3, name: 'JavaScript', slug: 'javascript', status: 'construction' },
  { id: 4, name: 'TypeScript', slug: 'typescript', status: 'construction' },
  { id: 5, name: 'Node.js', slug: 'node-js', status: 'construction' },
  { id: 6, name: 'API REST', slug: 'api-rest', status: 'construction' },
  { id: 7, name: 'React', slug: 'react', status: 'construction' },
  { id: 8, name: 'Banco de dados', slug: 'banco-de-dados', status: 'construction' }
];

export const gitQuestions = [
  {
    id: 1,
    topicId: 1,
    level: 'facil',
    text: 'O que é o Git?',
    options: [
      'Um sistema de controle de versão',
      'Uma linguagem de programação',
      'Um editor de código',
      'Um navegador de internet'
    ],
    correctAnswer: 'Um sistema de controle de versão'
  },
  {
    id: 2,
    topicId: 1,
    level: 'facil',
    text: 'Qual comando cria um novo repositório Git na pasta atual?',
    options: ['git init', 'git start', 'git new', 'git create'],
    correctAnswer: 'git init'
  },
  {
    id: 3,
    topicId: 1,
    level: 'facil',
    text: 'Para que serve o comando git status?',
    options: [
      'Mostrar o estado dos arquivos no repositório',
      'Enviar arquivos para o GitHub',
      'Apagar o histórico do projeto',
      'Criar uma nova conta no GitHub'
    ],
    correctAnswer: 'Mostrar o estado dos arquivos no repositório'
  },
  {
    id: 4,
    topicId: 1,
    level: 'facil',
    text: 'O que é o GitHub?',
    options: [
      'Uma plataforma para hospedar repositórios Git',
      'Um banco de dados',
      'Uma biblioteca de componentes React',
      'Um terminal para executar comandos'
    ],
    correctAnswer: 'Uma plataforma para hospedar repositórios Git'
  },
  {
    id: 5,
    topicId: 1,
    level: 'intermediario',
    text: 'Qual é a função do comando git add?',
    options: [
      'Preparar arquivos para o próximo commit',
      'Criar uma branch remota',
      'Baixar um repositório do GitHub',
      'Publicar uma aplicação'
    ],
    correctAnswer: 'Preparar arquivos para o próximo commit'
  },
  {
    id: 6,
    topicId: 1,
    level: 'intermediario',
    text: 'O que o comando git commit faz?',
    options: [
      'Registra uma versão dos arquivos preparados',
      'Envia automaticamente o código para produção',
      'Instala dependências do projeto',
      'Troca a senha do GitHub'
    ],
    correctAnswer: 'Registra uma versão dos arquivos preparados'
  },
  {
    id: 7,
    topicId: 1,
    level: 'intermediario',
    text: 'Qual comando envia commits locais para um repositório remoto?',
    options: ['git push', 'git pull', 'git clone', 'git status'],
    correctAnswer: 'git push'
  },
  {
    id: 8,
    topicId: 1,
    level: 'dificil',
    text: 'Qual é a diferença principal entre git pull e git push?',
    options: [
      'git pull baixa mudanças do remoto; git push envia mudanças para o remoto',
      'git pull cria commits; git push cria branches',
      'git pull apaga arquivos; git push renomeia arquivos',
      'git pull inicia o Git; git push instala o GitHub'
    ],
    correctAnswer: 'git pull baixa mudanças do remoto; git push envia mudanças para o remoto'
  },
  {
    id: 9,
    topicId: 1,
    level: 'dificil',
    text: 'O que é uma branch no Git?',
    options: [
      'Uma linha de desenvolvimento separada dentro do repositório',
      'Uma senha usada para acessar o GitHub',
      'Um arquivo obrigatório de configuração',
      'Um tipo de banco de dados'
    ],
    correctAnswer: 'Uma linha de desenvolvimento separada dentro do repositório'
  },
  {
    id: 10,
    topicId: 1,
    level: 'dificil',
    text: 'Para que serve um Pull Request no GitHub?',
    options: [
      'Propor, revisar e discutir mudanças antes de juntar ao projeto',
      'Baixar automaticamente todos os repositórios de uma conta',
      'Criar uma pasta local sem histórico Git',
      'Transformar JavaScript em HTML'
    ],
    correctAnswer: 'Propor, revisar e discutir mudanças antes de juntar ao projeto'
  }
];
