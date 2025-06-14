import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import DiscussionForum from '../../components/DiscussionForum';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

export default function CourseDetail() {
  const router = useRouter();
  const { id } = router.query;
  const [course, setCourse] = useState(null);

  useEffect(() => {
    if (id) {
      const fetchCourse = async () => {
        const courseDoc = await getDoc(doc(db, 'courses', id));
        if (courseDoc.exists()) {
          setCourse({ id: courseDoc.id, ...courseDoc.data() });
        }
      };
      fetchCourse();
    }
  }, [id]);

  if (!course) return <p className="text-center mt-8">Loading...</p>;

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="container mx-auto p-4 mt-20">
        <h1 className="text-3xl font-bold mb-4">{course.title}</h1>
        <p className="text-gray-600 mb-4">{course.description}</p>
        <a
          href={course.fileURL}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Access Course Content
        </a>
        <div className="mt-8">
          <h2 className="text-2xl font-semibold mb-4">Discussion Forum</h2>
          <DiscussionForum courseId={id} />
        </div>
      </div>
      <Footer />
    </div>
  );
}
