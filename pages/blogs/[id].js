import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { fetchBlogsFromGoogleDocs } from '../../lib/googleDocs';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

export default function BlogDetail() {
  const router = useRouter();
  const { id } = router.query;
  const [blog, setBlog] = useState(null);

  useEffect(() => {
    if (id) {
      const fetchBlog = async () => {
        const blogDoc = await getDoc(doc(db, 'blogs', id));
        if (blogDoc.exists()) {
          const data = blogDoc.data();
          const content = await fetchBlogsFromGoogleDocs(data.googleDocId);
          setBlog({ id: blogDoc.id, ...data, content: content.content });
        }
      };
      fetchBlog();
    }
  }, [id]);

  if (!blog) return <p className="text-center mt-8">Loading...</p>;

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="container mx-auto p-4 mt-20">
        <h1 className="text-3xl font-bold mb-4">{blog.title}</h1>
        <div className="prose">{blog.content}</div>
      </div>
      <Footer />
    </div>
  );
}
