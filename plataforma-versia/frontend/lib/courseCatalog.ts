export interface LessonItem {
  id: number;
  title: string;
  duration: string;
  completed?: boolean;
  videoUrl?: string;
  poster?: string;
}

export interface CourseModule {
  title: string;
  duration: string;
  lessons: LessonItem[];
}

export interface CourseDetail {
  id: number;
  title: string;
  instructor: {
    name: string;
    role: string;
    avatar: string;
  };
  thumbnail: string;
  description: string;
  progress: number;
  duration: string;
  students: number;
  rating: number;
  reviews: number;
  category: string;
  level: string;
  isPremium?: boolean;
  modules: CourseModule[];
}

const sampleVideos = [
  {
    videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
    poster: 'https://peach.blender.org/wp-content/uploads/title_an_full.jpg',
  },
  {
    videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
    poster: 'https://mango.blender.org/wp-content/uploads/2012/05/01_vfx_preview_01.png',
  },
  {
    videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4',
    poster: 'https://durian.blender.org/wp-content/uploads/2010/05/sintel_poster_01.jpg',
  },
  {
    videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    poster: 'https://peach.blender.org/wp-content/uploads/bbb-splash.png',
  },
  {
    videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    poster: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?q=80&w=1080',
  },
  {
    videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
    poster: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=1080',
  },
];

function lessonId(courseId: number, index: number) {
  return courseId === 1 ? index : courseId * 100 + index;
}

function buildLessons(courseId: number, titles: string[], durations: string[]) {
  return titles.map((title, index) => ({
    id: lessonId(courseId, index + 1),
    title,
    duration: durations[index] || '15min',
    completed: courseId === 1 && index < 3,
    ...sampleVideos[index % sampleVideos.length],
  }));
}

function buildModules(courseId: number, moduleTitles: string[], lessonTitles: string[][]): CourseModule[] {
  let lessonCounter = 0;
  return moduleTitles.map((title, moduleIndex) => {
    const lessons = lessonTitles[moduleIndex].map((lessonTitle, localIndex) => {
      lessonCounter += 1;
      const sample = sampleVideos[(lessonCounter - 1) % sampleVideos.length];
      return {
        id: lessonId(courseId, lessonCounter),
        title: lessonTitle,
        duration: ['10:53', '12:12', '14:48', '09:56', '15:00', '25:00', '20:00', '18:30'][localIndex % 8],
        completed: courseId === 1 && lessonCounter <= 3,
        ...sample,
      };
    });

    return {
      title,
      duration: ['2h', '2.5h', '2h', '1.5h'][moduleIndex] || '2h',
      lessons,
    };
  });
}

const leadershipModules = buildModules(1, [
  'Fundamentos da Liderança Moderna',
  'Comunicação e Influência',
  'Gestão de Equipes de Alto Desempenho',
  'Tomada de Decisão Estratégica',
], [
  ['Introdução à Liderança 4.0', 'O Papel do Líder na Era Digital', 'Estilos de Liderança Contemporâneos', 'Autoconhecimento e Inteligência Emocional'],
  ['Comunicação Assertiva', 'Técnicas de Persuasão', 'Feedback Construtivo', 'Gestão de Conflitos'],
  ['Construindo Equipes Eficazes', 'Motivação e Engajamento', 'Delegação Estratégica', 'Cultura Organizacional'],
  ['Análise e Resolução de Problemas', 'Pensamento Estratégico', 'Gestão de Riscos', 'Projeto Final'],
]);

const courseModuleTemplates: Record<number, { moduleTitles: string[]; lessonTitles: string[][] }> = {
  2: {
    moduleTitles: ['Fundamentos de Dados', 'Dashboards e Indicadores', 'Análise Avançada', 'Projeto Analítico'],
    lessonTitles: [
      ['Visão Geral de Data Analytics', 'Métricas que Importam', 'Qualidade e Limpeza de Dados', 'Modelagem de Dados'],
      ['Criação de Dashboards', 'KPIs Executivos', 'Storytelling com Dados', 'Relatórios Automatizados'],
      ['Segmentação de Clientes', 'Previsões e Tendências', 'Análise de Cohort', 'Experimentos A/B'],
      ['Diagnóstico do Negócio', 'Plano de Medição', 'Entrega do Projeto', 'Apresentação Final'],
    ],
  },
  3: {
    moduleTitles: ['Cultura de Segurança', 'Riscos Digitais', 'Proteção Corporativa', 'Resposta a Incidentes'],
    lessonTitles: [
      ['Introdução à Cibersegurança', 'Principais Ameaças', 'Boas Práticas para Equipes', 'Segurança em Senhas'],
      ['Phishing e Engenharia Social', 'Proteção de Dispositivos', 'Redes Seguras', 'Privacidade e Dados'],
      ['Políticas de Acesso', 'Backups e Continuidade', 'Ferramentas de Monitoramento', 'Auditorias Internas'],
      ['Plano de Resposta', 'Comunicação em Incidentes', 'Lições Aprendidas', 'Simulado Final'],
    ],
  },
  4: {
    moduleTitles: ['Ética no Ambiente Corporativo', 'Normas e Procedimentos', 'Conduta Profissional', 'Avaliação Final'],
    lessonTitles: [
      ['Introdução ao Compliance', 'Código de Conduta', 'Conflitos de Interesse', 'Canal de Denúncias'],
      ['Políticas Internas', 'LGPD no Dia a Dia', 'Anticorrupção', 'Registros e Evidências'],
      ['Tomada de Decisão Ética', 'Comunicação Transparente', 'Responsabilidade Individual', 'Casos Práticos'],
      ['Revisão Geral', 'Checklist de Conduta', 'Simulado de Compliance', 'Certificação'],
    ],
  },
  5: {
    moduleTitles: ['Colaboração Moderna', 'Comunicação em Equipe', 'Produtividade Coletiva', 'Projeto Colaborativo'],
    lessonTitles: [
      ['Mindset Colaborativo', 'Papéis dentro da Equipe', 'Confiança e Segurança Psicológica', 'Rituais de Alinhamento'],
      ['Comunicação Clara', 'Escuta Ativa', 'Reuniões Produtivas', 'Feedback entre Pares'],
      ['Gestão de Prioridades', 'Ferramentas Colaborativas', 'Documentação Viva', 'Acompanhamento de Entregas'],
      ['Desafio em Grupo', 'Análise dos Resultados', 'Plano de Melhoria', 'Encerramento'],
    ],
  },
  6: {
    moduleTitles: ['IA para Decisão', 'Automação Inteligente', 'Aplicações no Negócio', 'Estratégia de IA'],
    lessonTitles: [
      ['O que é IA Generativa', 'Oportunidades para Empresas', 'Riscos e Limites da IA', 'Prompting para Profissionais'],
      ['Automação de Processos', 'Chatbots Corporativos', 'Análise de Documentos', 'Produtividade com IA'],
      ['IA em Marketing', 'IA em Operações', 'IA em Atendimento', 'IA em Pessoas'],
      ['Roadmap de Adoção', 'Governança de IA', 'Métricas de Sucesso', 'Projeto Final'],
    ],
  },
  7: {
    moduleTitles: ['Front-end Moderno', 'Back-end e APIs', 'Banco de Dados', 'Deploy e Produto'],
    lessonTitles: [
      ['HTML, CSS e Componentes', 'React e Estado', 'Next.js na Prática', 'Consumo de APIs'],
      ['Rotas e Controllers', 'Autenticação', 'Validação de Dados', 'Boas Práticas de API'],
      ['Modelagem Relacional', 'Prisma ORM', 'Consultas e Relatórios', 'Segurança de Dados'],
      ['Deploy na Vercel', 'Variáveis de Ambiente', 'Monitoramento', 'Projeto Full Stack'],
    ],
  },
  8: {
    moduleTitles: ['Mentalidade Ágil', 'Scrum na Prática', 'Kanban e Fluxo', 'Gestão de Entregas'],
    lessonTitles: [
      ['Manifesto Ágil', 'Papéis e Responsabilidades', 'Planejamento Adaptativo', 'Priorização de Backlog'],
      ['Sprint Planning', 'Daily Meeting', 'Review e Retrospectiva', 'Métricas Scrum'],
      ['Quadros Kanban', 'Limites de WIP', 'Lead Time e Cycle Time', 'Melhoria Contínua'],
      ['Roadmap de Produto', 'Gestão de Stakeholders', 'Riscos e Dependências', 'Case Final'],
    ],
  },
};

export const courseCatalog: CourseDetail[] = [
  {
    id: 1,
    title: 'Liderança Estratégica 4.0',
    instructor: { name: 'Ana Silva', role: 'Especialista em Liderança Corporativa', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=400&h=400&auto=format&fit=crop' },
    thumbnail: 'https://images.unsplash.com/photo-1770240366266-57290c83cd5f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsZWFkZXJzaGlwJTIwZGV2ZWxvcG1lbnQlMjBtZW50b3IlMjBjb2FjaGluZ3xlbnwxfHx8fDE3NzQyMzQ0ODV8MA&ixlib=rb-4.1.0&q=80&w=1080',
    description: 'Desenvolva habilidades de liderança moderna e estratégica para liderar equipes de alto desempenho na era digital. Este curso aborda técnicas avançadas de gestão, comunicação efetiva e tomada de decisão estratégica.',
    progress: 65,
    duration: '8h',
    students: 1240,
    rating: 4.8,
    reviews: 342,
    category: 'Liderança',
    level: 'Avançado',
    modules: leadershipModules,
  },
  {
    id: 2,
    title: 'Data Analytics Avançado',
    instructor: { name: 'Carlos Mendes', role: 'Especialista em Business Intelligence', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=400&h=400&auto=format&fit=crop' },
    thumbnail: 'https://images.unsplash.com/photo-1759661966728-4a02e3c6ed91?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkYXRhJTIwYW5hbHl0aWNzJTIwZGFzaGJvYXJkJTIwdGVjaG5vbG9neXxlbnwxfHx8fDE3NzQxNzc3NTd8MA&ixlib=rb-4.1.0&q=80&w=1080',
    description: 'Aprenda a transformar dados em decisões estratégicas com dashboards, indicadores executivos, análise de tendências e modelos de acompanhamento de performance.',
    progress: 30,
    duration: '12h',
    students: 890,
    rating: 4.7,
    reviews: 218,
    category: 'Tecnologia',
    level: 'Intermediário',
    isPremium: true,
    modules: buildModules(2, courseModuleTemplates[2].moduleTitles, courseModuleTemplates[2].lessonTitles),
  },
  {
    id: 3,
    title: 'Cibersegurança Corporativa',
    instructor: { name: 'Roberto Costa', role: 'Consultor em Segurança Digital', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400&h=400&auto=format&fit=crop' },
    thumbnail: 'https://images.unsplash.com/photo-1768224656445-33d078c250b7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjeWJlcnNlY3VyaXR5JTIwZGlnaXRhbCUyMG5ldHdvcmslMjBzZWN1cml0eXxlbnwxfHx8fDE3NzQyMzQ0ODZ8MA&ixlib=rb-4.1.0&q=80&w=1080',
    description: 'Capacite sua equipe para reduzir riscos digitais, prevenir ataques e responder a incidentes com segurança, clareza e velocidade.',
    progress: 0,
    duration: '10h',
    students: 654,
    rating: 4.9,
    reviews: 176,
    category: 'Segurança',
    level: 'Avançado',
    isPremium: true,
    modules: buildModules(3, courseModuleTemplates[3].moduleTitles, courseModuleTemplates[3].lessonTitles),
  },
  {
    id: 4,
    title: 'Compliance e Ética Empresarial',
    instructor: { name: 'Juliana Oliveira', role: 'Especialista em Compliance', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=400&h=400&auto=format&fit=crop' },
    thumbnail: 'https://images.unsplash.com/photo-1758691736067-b309ee3ef7b9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb3Jwb3JhdGUlMjBidXNpbmVzcyUyMHRyYWluaW5nJTIwcHJlc2VudGF0aW9ufGVufDF8fHx8MTc3NDIzNDQ4NHww&ixlib=rb-4.1.0&q=80&w=1080',
    description: 'Entenda normas internas, código de conduta, privacidade e práticas éticas essenciais para proteger a empresa e seus colaboradores.',
    progress: 100,
    duration: '4h',
    students: 2100,
    rating: 4.6,
    reviews: 509,
    category: 'Compliance',
    level: 'Básico',
    modules: buildModules(4, courseModuleTemplates[4].moduleTitles, courseModuleTemplates[4].lessonTitles),
  },
  {
    id: 5,
    title: 'Trabalho em Equipe e Colaboração',
    instructor: { name: 'Marcos Santos', role: 'Mentor de Cultura Organizacional', avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=400&h=400&auto=format&fit=crop' },
    thumbnail: 'https://images.unsplash.com/photo-1769740333462-9a63bfa914bc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjB0ZWFtJTIwY29sbGFib3JhdGlvbiUyMG9mZmljZXxlbnwxfHx8fDE3NzQyMDI4ODl8MA&ixlib=rb-4.1.0&q=80&w=1080',
    description: 'Fortaleça colaboração, comunicação e produtividade em equipes modernas com práticas aplicáveis ao dia a dia corporativo.',
    progress: 45,
    duration: '6h',
    students: 1560,
    rating: 4.8,
    reviews: 294,
    category: 'Soft Skills',
    level: 'Intermediário',
    modules: buildModules(5, courseModuleTemplates[5].moduleTitles, courseModuleTemplates[5].lessonTitles),
  },
  {
    id: 6,
    title: 'Inteligência Artificial para Negócios',
    instructor: { name: 'Patricia Lima', role: 'Estrategista em IA Corporativa', avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=400&h=400&auto=format&fit=crop' },
    thumbnail: 'https://images.unsplash.com/photo-1760629863094-5b1e8d1aae74?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhcnRpZmljaWFsJTIwaW50ZWxsaWdlbmNlJTIwcm9ib3QlMjBmdXR1cmlzdGljfGVufDF8fHx8MTc3NDE2NDEyMXww&ixlib=rb-4.1.0&q=80&w=1080',
    description: 'Descubra como aplicar IA para aumentar produtividade, melhorar atendimento, automatizar processos e apoiar decisões estratégicas.',
    progress: 0,
    duration: '15h',
    students: 780,
    rating: 4.9,
    reviews: 188,
    category: 'IA',
    level: 'Avançado',
    isPremium: true,
    modules: buildModules(6, courseModuleTemplates[6].moduleTitles, courseModuleTemplates[6].lessonTitles),
  },
  {
    id: 7,
    title: 'Desenvolvimento Full Stack',
    instructor: { name: 'Fernando Rocha', role: 'Engenheiro de Software Sênior', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=400&h=400&auto=format&fit=crop' },
    thumbnail: 'https://images.unsplash.com/photo-1672385277648-85eddc237a2b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzb2Z0d2FyZSUyMGRldmVsb3BtZW50JTIwY29kaW5nJTIwcHJvZ3JhbW1pbmd8ZW58MXx8fHwxNzc0MjM0NDg3fDA&ixlib=rb-4.1.0&q=80&w=1080',
    description: 'Construa aplicações modernas com front-end, back-end, banco de dados e deploy profissional usando tecnologias atuais.',
    progress: 0,
    duration: '20h',
    students: 1120,
    rating: 4.7,
    reviews: 321,
    category: 'Tecnologia',
    level: 'Intermediário',
    isPremium: true,
    modules: buildModules(7, courseModuleTemplates[7].moduleTitles, courseModuleTemplates[7].lessonTitles),
  },
  {
    id: 8,
    title: 'Gestão de Projetos Ágeis',
    instructor: { name: 'Beatriz Alves', role: 'Agile Coach', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=400&h=400&auto=format&fit=crop' },
    thumbnail: 'https://images.unsplash.com/photo-1764025130362-0162c3dd2035?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjB0ZWNoJTIwd29ya3NwYWNlJTIwZGlnaXRhbCUyMGxlYXJuaW5nfGVufDF8fHx8MTc3NDIzNDQ4NHww&ixlib=rb-4.1.0&q=80&w=1080',
    description: 'Aprenda a planejar, acompanhar e entregar projetos com métodos ágeis, Scrum, Kanban e gestão visual de fluxo.',
    progress: 15,
    duration: '9h',
    students: 945,
    rating: 4.8,
    reviews: 267,
    category: 'Gestão',
    level: 'Intermediário',
    modules: buildModules(8, courseModuleTemplates[8].moduleTitles, courseModuleTemplates[8].lessonTitles),
  },
];

export function getCourseById(id: string | number) {
  return courseCatalog.find((course) => course.id === Number(id));
}

export function getFlatLessons(course: CourseDetail) {
  return course.modules.flatMap((module) => module.lessons.map((lesson) => ({ ...lesson, moduleTitle: module.title })));
}

export function getCourseByLessonId(id: string | number) {
  const lessonIdNumber = Number(id);
  return courseCatalog.find((course) => getFlatLessons(course).some((lesson) => lesson.id === lessonIdNumber));
}
