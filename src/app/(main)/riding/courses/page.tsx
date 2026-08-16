import { getTranslations } from "next-intl/server";
import { getCourses } from "@/data/mock/riding";
import { PageHeader } from "@/components/ui/primitives";
import { CoursesList } from "@/components/riding/CoursesList";

export const revalidate = 300;

export default async function CoursesPage() {
  const t = await getTranslations("riding");
  const courses = await getCourses();

  return (
    <div className="mx-auto max-w-6xl px-4 py-6">
      <PageHeader
        title={t("courses.title")}
        description={t("courses.description")}
      />
      <div className="mt-6 animate-fade-up">
        <CoursesList courses={courses} />
      </div>
    </div>
  );
}
