import { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebase';
import CourseCard from '../components/CourseCard';
import BlogPost from '../components/BlogPost';
import PublicNote from '../components/PublicNote';

export default function Home() {
  const [courses, setCourses] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [notes, setNotes] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      // Fetch courses
      const coursesSnap = await getDocs(collection(db, 'courses'));
      setCourses(coursesSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));

      // Fetch blogs from Google Docs (via API)
      const blogsData = await fetchBlogsFromGoogleDocs();
      setBlogs(blogsData);

      // Fetch public notes
      const notesSnap = await getDocs(collection(db, 'publicNotes'));
      setNotes(notesSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    };
    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="container mx-auto p-4">
        <h1 className="text-4xl font-bold text-center mb-8">Welcome to EduHub-KMR</h1>
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">Featured Courses</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map(course => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        </section>
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">Latest Blogs</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {blogs.map(blog => (
              <BlogPost key={blog.id} blog={blog} />
            ))}
          </div>
        </section>
        <section>
          <h2 className="text-2xl font-semibold mb-4">Public Notes</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {notes.map(note => (
              <PublicNote key={note.id} note={note} />
            ))}
          </div>
        </section>
      </div>
      <Footer />
    </div>
  );
}
