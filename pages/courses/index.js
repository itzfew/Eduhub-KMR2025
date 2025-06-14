import CourseCard from '../../components/CourseCard';

// Inside the component
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
  {courses.map(course => (
    <CourseCard key={course.id} course={course} />
  ))}
</div>
