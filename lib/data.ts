export type UserType = 'student' | 'company';

export type AppUser = {
  name: string;
  email: string;
  role: string;
  company: string;
  type: UserType;
  avatar: string;
};

export type DemoUser = AppUser & { password: string };

export const DEFAULT_AVATAR =
  'https://plus.unsplash.com/premium_photo-1692241091501-984a8a0c35ef?fm=jpg&q=60&w=600&auto=format&fit=crop';

export const DEFAULT_USER: AppUser = {
  name: 'Aluno Versia',
  email: 'aluno@empresa.com',
  role: 'Aluno corporativo',
  company: 'Versia Learning',
  type: 'student',
  avatar: DEFAULT_AVATAR,
};

export const DEMO_USERS: Record<string, DemoUser> = {
  'motiron@gmail.com': {
    name: 'Motiron',
    email: 'motiron@gmail.com',
    password: '123456',
    role: 'Conta empresarial',
    company: 'Motiron',
    type: 'company',
    avatar:
      'https://images.unsplash.com/photo-1560179707-f14e90ef3623?q=80&w=600&auto=format&fit=crop',
  },
};

export type Course = {
  id: number;
  title: string;
  instructor: string;
  progress: number;
  duration: string;
  category: string;
  level: string;
  students: number;
  thumbnail: string;
  description: string;
  companyTrack: string;
};

export const courses: Course[] = [
  {
    id: 1,
    title: 'Liderança Estratégica 4.0',
    instructor: 'Ana Silva',
    progress: 65,
    duration: '8h',
    category: 'Liderança',
    level: 'Avançado',
    students: 1240,
    thumbnail: 'https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=1080&auto=format&fit=crop',
    description:
      'Desenvolva liderança moderna, inteligência emocional, comunicação assertiva e tomada de decisão em ambientes corporativos digitais.',
    companyTrack: 'Gestores e líderes',
  },
  {
    id: 2,
    title: 'Data Analytics Avançado',
    instructor: 'Carlos Mendes',
    progress: 30,
    duration: '12h',
    category: 'Tecnologia',
    level: 'Intermediário',
    students: 890,
    thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1080&auto=format&fit=crop',
    description:
      'Aprenda a transformar dados em indicadores, dashboards e decisões práticas para a empresa.',
    companyTrack: 'Tecnologia e dados',
  },
  {
    id: 3,
    title: 'Cibersegurança Corporativa',
    instructor: 'Roberto Costa',
    progress: 0,
    duration: '10h',
    category: 'Segurança',
    level: 'Avançado',
    students: 654,
    thumbnail: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=1080&auto=format&fit=crop',
    description:
      'Proteção de dados, boas práticas digitais, phishing, senhas, LGPD e resposta a incidentes.',
    companyTrack: 'Todos os colaboradores',
  },
  {
    id: 4,
    title: 'Compliance e Ética Empresarial',
    instructor: 'Juliana Oliveira',
    progress: 100,
    duration: '4h',
    category: 'Compliance',
    level: 'Básico',
    students: 2100,
    thumbnail: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?q=80&w=1080&auto=format&fit=crop',
    description:
      'Políticas internas, postura profissional, ética, LGPD e rotinas de conformidade.',
    companyTrack: 'Obrigatório',
  },
  {
    id: 5,
    title: 'Trabalho em Equipe e Colaboração',
    instructor: 'Marcos Santos',
    progress: 45,
    duration: '6h',
    category: 'Soft Skills',
    level: 'Intermediário',
    students: 1560,
    thumbnail: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=1080&auto=format&fit=crop',
    description:
      'Colaboração, comunicação, resolução de conflitos e produtividade entre equipes.',
    companyTrack: 'Times operacionais',
  },
  {
    id: 6,
    title: 'Inteligência Artificial para Negócios',
    instructor: 'Patricia Lima',
    progress: 0,
    duration: '15h',
    category: 'IA',
    level: 'Avançado',
    students: 780,
    thumbnail: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=1080&auto=format&fit=crop',
    description:
      'Como aplicar IA em atendimento, processos, análise de dados e estratégia empresarial.',
    companyTrack: 'Inovação',
  },
  {
    id: 7,
    title: 'Desenvolvimento Full Stack',
    instructor: 'Fernando Rocha',
    progress: 0,
    duration: '20h',
    category: 'Tecnologia',
    level: 'Intermediário',
    students: 1120,
    thumbnail: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?q=80&w=1080&auto=format&fit=crop',
    description:
      'Fundamentos de front-end, back-end, APIs, banco de dados e deploy.',
    companyTrack: 'Tecnologia e produto',
  },
  {
    id: 8,
    title: 'Gestão de Projetos Ágeis',
    instructor: 'Beatriz Alves',
    progress: 15,
    duration: '9h',
    category: 'Gestão',
    level: 'Intermediário',
    students: 945,
    thumbnail: 'https://images.unsplash.com/photo-1556761175-b413da4baf72?q=80&w=1080&auto=format&fit=crop',
    description:
      'Scrum, Kanban, planejamento, entregas e acompanhamento de projetos.',
    companyTrack: 'Projetos',
  },
  {
    id: 9,
    title: 'Atendimento ao Cliente Premium',
    instructor: 'Camila Rocha',
    progress: 20,
    duration: '5h',
    category: 'Atendimento',
    level: 'Básico',
    students: 1320,
    thumbnail: 'https://images.unsplash.com/photo-1556745757-8d76bdb6984b?q=80&w=1080&auto=format&fit=crop',
    description:
      'Técnicas para atendimento humanizado, resolução de problemas e experiência do cliente.',
    companyTrack: 'Comercial e suporte',
  },
  {
    id: 10,
    title: 'Vendas Consultivas B2B',
    instructor: 'Rafael Nogueira',
    progress: 0,
    duration: '7h',
    category: 'Vendas',
    level: 'Intermediário',
    students: 720,
    thumbnail: 'https://images.unsplash.com/photo-1556761175-4b46a572b786?q=80&w=1080&auto=format&fit=crop',
    description:
      'Prospecção, diagnóstico, negociação e relacionamento com clientes corporativos.',
    companyTrack: 'Comercial',
  },
  {
    id: 11,
    title: 'Excelência Operacional',
    instructor: 'Sofia Andrade',
    progress: 55,
    duration: '11h',
    category: 'Operações',
    level: 'Avançado',
    students: 980,
    thumbnail: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?q=80&w=1080&auto=format&fit=crop',
    description:
      'Padronização, indicadores, melhoria contínua e gestão de rotinas operacionais.',
    companyTrack: 'Operações',
  },
  {
    id: 12,
    title: 'Comunicação Corporativa',
    instructor: 'Helena Martins',
    progress: 75,
    duration: '6h',
    category: 'Soft Skills',
    level: 'Básico',
    students: 1640,
    thumbnail: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?q=80&w=1080&auto=format&fit=crop',
    description:
      'Comunicação clara, reuniões objetivas, feedbacks e alinhamento entre equipes.',
    companyTrack: 'Todos os colaboradores',
  },
];

export type Lesson = {
  id: number;
  courseId: number;
  title: string;
  duration: string;
  completed: boolean;
};

const lessonTitles = [
  'Introdução e objetivos do curso',
  'Fundamentos essenciais',
  'Ferramentas aplicadas',
  'Exemplos práticos',
  'Estudo de caso empresarial',
  'Atividade guiada',
  'Erros comuns e como evitar',
  'Boas práticas no dia a dia',
  'Resumo do módulo',
  'Avaliação final',
];

export function getCourse(id: string | number): Course {
  return courses.find((course) => course.id === Number(id)) ?? courses[0];
}

export function getLessons(courseId: string | number): Lesson[] {
  const course = getCourse(courseId);
  const completedCount = Math.round((course.progress / 100) * lessonTitles.length);

  return lessonTitles.map((title, index) => ({
    id: course.id * 100 + index + 1,
    courseId: course.id,
    title: index === 0 ? `Introdução: ${course.title}` : title,
    duration: `${String(8 + index * 2).padStart(2, '0')}:00`,
    completed: index < completedCount,
  }));
}

export function getCourseFromLesson(lessonId: string | number): Course {
  const id = Number(lessonId);
  const courseId = Math.max(1, Math.floor(id / 100));
  return getCourse(courseId);
}

export const companyTeams = [
  { name: 'Equipe Comercial', email: 'comercial@motiron.com', progress: 72, courses: 5, status: 'Em andamento' },
  { name: 'Equipe RH', email: 'rh@motiron.com', progress: 88, courses: 7, status: 'Dentro do prazo' },
  { name: 'Equipe Operações', email: 'operacoes@motiron.com', progress: 41, courses: 4, status: 'Atenção' },
  { name: 'Equipe Tecnologia', email: 'tech@motiron.com', progress: 63, courses: 6, status: 'Em andamento' },
  { name: 'Equipe Financeira', email: 'financeiro@motiron.com', progress: 95, courses: 8, status: 'Concluindo' },
  { name: 'Gestores', email: 'gestores@motiron.com', progress: 54, courses: 5, status: 'Em andamento' },
  { name: 'Atendimento', email: 'atendimento@motiron.com', progress: 79, courses: 6, status: 'Dentro do prazo' },
  { name: 'Marketing', email: 'marketing@motiron.com', progress: 36, courses: 3, status: 'Atenção' },
];
