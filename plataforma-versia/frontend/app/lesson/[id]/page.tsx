import { courseCatalog, getFlatLessons } from '@/lib/courseCatalog';
import LessonClientPage from './LessonClientPage';

export function generateStaticParams() {
  return courseCatalog.flatMap((course) => getFlatLessons(course).map((lesson) => ({ id: String(lesson.id) })));
}

export default function Page() {
  return <LessonClientPage />;
}
