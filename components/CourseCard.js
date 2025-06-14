import Link from 'next/link';

export default function CourseCard({ course }) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform transform hover:scale-105">
      <img
        src={course.thumbnail || '/placeholder.jpg'}
        alt={course.title}
        className="w-full h-48 object-cover"
      />
      <div className="p-4">
        <h3 className="text-xl font-semibold text-gray-800 truncate">{course.title}</h3>
        <p className="text-gray-600 mt-2 text-sm line-clamp-3">{course.description}</p>
        <Link href={`/courses/${course.id}`}>
          <button className="mt-4 w-full bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors">
            View Course
          </button>
        </Link>
      </div>
    </div>
  );
}
