import { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { fetchBlogsFromGoogleDocs } from '../../lib/googleDocs';
import BlogPost from '../../components/BlogPost';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

export default function Blogs() {
  const [blogs, setBlogs] = useState([]);

  useEffect(() => {
    const fetchBlogs = async () => {
      const blogsSnap = await getDocs(collection(db, 'blogs'));
      const blogsData = await Promise.all(
        blogsSnap.docs.map(async doc => {
          const data = doc.data();
          const content = await fetchBlogsFromGoogleDocs(data.googleDocId);
          return { id: doc.id, ...data, content: content.content };
        })
      );
      setBlogs(blogsData);
    };
    fetchBlogs();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="container mx-auto p-4 mt-20">
        <h1 className="text-3xl font-bold mb-6">Blog Posts</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {blogs.map(blog => (
            <BlogPost key={blog.id} blog={blog} />
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
}
