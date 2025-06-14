import { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebase';
import CourseCard from '../components/CourseCard';
import BlogPost from '../components/BlogPost';
import PublicNote from '../components/PublicNote';
import Navbar from '../components/Navbar'; // Add this import
import Footer from '../components/Footer';
import axios from 'axios';

export default function Home() {
  const [courses, setCourses] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch courses
        const coursesSnap = await getDocs(collection(db, 'courses'));
        setCourses(coursesSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));

        // Fetch blogs
        const blogsSnap = await getDocs(collection(db, 'blogs'));
        const blogsData = await Promise.all(
          blogsSnap.docs.map(async doc => {
            const data = doc.data();
            try {
              const response = await axios.get(`/api/blogs/${data.googleDocId}`);
              return { id: doc.id, ...data, content: response.data.content };
            } catch (err) {
              return { id: doc.id, ...data, content: 'Error fetching content' };
            }
          })
        );
        setBlogs(blogsData);

        // Fetch public notes
        const notesSnap = await getDocs(collection(db, 'publicNotes'));
        setNotes(notesSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));

        setLoading(false);
      } catch (err) {
        setError('Failed to fetch data');
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <p className="text-center mt-20">Loading...</p>;
  if (error) return <p className="text-center mt-20 text-red-500">{error}</p>;

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="container mx-auto p-4 pt-20">
        <h1 className="text-4xl font-bold text-center mb-8">Welcome to EduHub-KMR</h1>
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">Featured Courses</h2>
          {courses.length === 0 ? (
            <p className="text-center text-gray-600">No courses available.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.map(course => (
                <CourseCard key={course.id} course={course} />
              ))}
            </div>
          )}
        </section>
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">Latest Blogs</h2>
          {blogs.length === 0 ? (
            <p className="text-center text-gray-600">No blogs available.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {blogs.map(blog => (
                <BlogPost key={blog.id} blog={blog} />
              ))}
            </div>
          )}
        </section>
        <section>
          <h2 className="text-2xl font-semibold mb-4">Public Notes</h2>
          {notes.length === 0 ? (
            <p className="text-center text-gray-600">No notes available.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {notes.map(note => (
                <PublicNote key={note.id} note={note} />
              ))}
            </div>
          )}
        </section>
      </div>
      <Footer />
    </div>
  );
}
