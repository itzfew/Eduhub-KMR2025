import { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import PublicNote from '../../components/PublicNote';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

export default function Notes() {
  const [notes, setNotes] = useState([]);

  useEffect(() => {
    const fetchNotes = async () => {
      const notesSnap = await getDocs(collection(db, 'publicNotes'));
      setNotes(notesSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    };
    fetchNotes();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="container mx-auto p-4 mt-20">
        <h1 className="text-3xl font-bold mb-6">Public Notes</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {notes.map(note => (
            <PublicNote key={note.id} note={note} />
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
}
