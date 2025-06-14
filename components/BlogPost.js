import Link from 'next/link';

export default function BlogPost({ blog }) {
  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <h3 className="text-xl font-semibold">{blog.title}</h3>
      <p className="text-gray-600 mt-2">{blog.content.substring(0, 100)}...</p>
      <Link href={`/blogs/${blog.id}`}>
        <button className="mt-4 bg-blue-500 text-white px-4 py-2 rounded">
          Read More
        </button>
      </Link>
    </div>
  );
}
