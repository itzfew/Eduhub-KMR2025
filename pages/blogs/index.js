import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import BlogPost from '../../components/BlogPost';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import axios from 'axios';

export async function getServerSideProps() {
  try {
    const blogsSnap = await getDocs(collection(db, 'blogs'));
    const blogsData = await Promise.all(
      blogsSnap.docs.map(async doc => {
        const data = doc.data();
        const response = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/api/blogs/${data.googleDocId}`);
        return { id: doc.id, ...data, content: response.data.content };
      })
    );
    return { props: { blogs: blogsData } };
  } catch (error) {
    console.error('Error fetching blogs:', error);
    return { props: { blogs: [] } };
  }
}

export default function Blogs({ blogs }) {
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
