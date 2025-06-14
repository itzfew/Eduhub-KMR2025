import { useEffect, useState } from 'react';
import { collection, getDocs, addDoc, deleteDoc, doc } from 'firebase/firestore';
import { db, storage } from '../../lib/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../../lib/firebase';

export default function AdminDashboard() {
  const [user] = useAuthState(auth);
  const [users, setUsers] = useState([]);
  const [courses, setCourses] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [notes, setNotes] = useState([]);
  const [newCourse, setNewCourse] = useState({ title: '', description: '', file: null });
  const [newBlog, setNewBlog] = useState({ title: '', googleDocId: '' });
  const [newNote, setNewNote] = useState({ title: '', content: '' });

  useEffect(() => {
    if (user?.email !== 'admin@eduhub.com') return; // Restrict to admin
    const fetchData = async () => {
      setUsers((await getDocs(collection(db, 'users'))).docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setCourses((await getDocs(collection(db, 'courses'))).docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setBlogs((await getDocs(collection(db, 'blogs'))).docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setNotes((await getDocs(collection(db, 'publicNotes'))).docs.map(doc => ({ id: doc.id, ...doc.data() })));
    };
    fetchData();
  }, [user]);

  const handleAddCourse = async (e) => {
    e.preventDefault();
    const storageRef = ref(storage, `courses/${newCourse.file.name}`);
    await uploadBytes(storageRef, newCourse.file);
    const fileURL = await getDownloadURL(storageRef);
    await addDoc(collection(db, 'courses'), {
      title: newCourse.title,
      description: newCourse.description,
      fileURL,
      createdAt: new Date(),
    });
    setNewCourse({ title: '', description: '', file: null });
  };

  const handleAddBlog = async (e) => {
    e.preventDefault();
    await addDoc(collection(db, 'blogs'), {
      title: newBlog.title,
      googleDocId: newBlog.googleDocId,
      createdAt: new Date(),
    });
    setNewBlog({ title: '', googleDocId: '' });
  };

  const handleAddNote = async (e) => {
    e.preventDefault();
    await addDoc(collection(db, 'publicNotes'), {
      title: newNote.title,
      content: newNote.content,
      createdAt: new Date(),
    });
    setNewNote({ title: '', content: '' });
  };

  if (user?.email !== 'admin@eduhub.com') return <p>Access Denied</p>;

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Manage Users</h2>
        <ul>
          {users.map(u => (
            <li key={u.id}>{u.name} - {u.email}</li>
          ))}
        </ul>
      </section>
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Add Course</h2>
        <form onSubmit={handleAddCourse} className="space-y-4">
          <input
            type="text"
            placeholder="Course Title"
            value={newCourse.title}
            onChange={(e) => setNewCourse({ ...newCourse, title: e.target.value })}
            className="w-full p-2 border rounded"
          />
          <textarea
            placeholder="Description"
            value={newCourse.description}
            onChange={(e) => setNewCourse({ ...newCourse, description: e.target.value })}
            className="w-full p-2 border rounded"
          />
          <input
            type="file"
            onChange={(e) => setNewCourse({ ...newCourse, file: e.target.files[0] })}
            className="w-full p-2"
          />
          <button type="submit" className="bg-blue-500 text-white p-2 rounded">Add Course</button>
        </form>
      </section>
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Add Blog</h2>
        <form onSubmit={handleAddBlog} className="space-y-4">
          <input
            type="text"
            placeholder="Blog Title"
            value={newBlog.title}
            onChange={(e) => setNewBlog({ ...newBlog, title: e.target.value })}
            className="w-full p-2 border rounded"
          />
          <input
            type="text"
            placeholder="Google Doc ID"
            value={newBlog.googleDocId}
            onChange={(e) => setNewBlog({ ...newBlog, googleDocId: e.target.value })}
            className="w-full p-2 border rounded"
          />
          <button type="submit" className="bg-blue-500 text-white p-2 rounded">Add Blog</button>
        </form>
      </section>
      <section>
        <h2 className="text-2xl font-semibold mb-4">Add Public Note</h2>
        <form onSubmit={handleAddNote} className="space-y-4">
          <input
            type="text"
            placeholder="Note Title"
            value={newNote.title}
            onChange={(e) => setNewNote({ ...newNote, title: e.target.value })}
            className="w-full p-2 border rounded"
          />
          <textarea
            placeholder="Note Content"
            value={newNote.content}
            onChange={(e) => setNewNote({ ...newNote, content: e.target.value })}
            className="w-full p-2 border rounded"
          />
          <button type="submit" className="bg-blue-500 text-white p-2 rounded">Add Note</button>
        </form>
      </section>
    </div>
  );
}
