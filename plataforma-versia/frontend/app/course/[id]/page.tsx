import { courseCatalog } from '@/lib/courseCatalog';
import CourseClientPage from './CourseClientPage';

export function generateStaticParams() {
  return courseCatalog.map((course) => ({ id: String(course.id) }));
}

export default function Page() {
  return <CourseClientPage />;
}
