import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import axios from 'axios';

export default function BlogDetail() {
  const router = useRouter();
  const { id } = router.query;
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (id) {
      const fetchBlog = async () => {
        try {
          // Fetch blog metadata from Firestore
          const blogDoc = await getDoc(doc(db, 'blogs', id));
          if (!blogDoc.exists()) {
            setError('Blog not found');
            setLoading(false);
            return;
          }

          const data = blogDoc.data();
          // Fetch blog content from Google Docs via API route
          const response = await axios.get(`/api/blogs/${data.googleDocId}`);
          setBlog({ id: blogDoc.id, ...data, content: response.data.content });
          setLoading(false);
        } catch (err) {
          setError(err.message);
          setLoading(false);
        }
      };
      fetchBlog();
    }
  }, [id]);

  if (loading) return <p className="text-center mt-20">Loading...</p>;
  if (error) return <p className="text-center mt-20 text-red-500">{error}</p>;
  if (!blog) return null;

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="container mx-auto p-4 mt-20">
        <h1 className="text-3xl font-bold mb-4">{blog.title}</h1>
        <div className="prose max-w-none">{blog.content}</div>
      </div>
      <Footer />
    </div>
  );
}
