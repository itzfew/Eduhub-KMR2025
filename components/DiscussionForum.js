import { useEffect, useState } from 'react';
import { ref, push, onValue } from 'firebase/database';
import { realtimeDb } from '../lib/firebase';

export default function DiscussionForum({ courseId }) {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');

  useEffect(() => {
    const messagesRef = ref(realtimeDb, `forums/${courseId}`);
    onValue(messagesRef, (snapshot) => {
      const data = snapshot.val();
      setMessages(data ? Object.values(data) : []);
    });
  }, [courseId]);

  const handleSendMessage = async () => {
    await push(ref(realtimeDb, `forums/${courseId}`), {
      text: newMessage,
      userId: auth.currentUser.uid,
      timestamp: new Date().toISOString(),
    });
    setNewMessage('');
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow">
      <div className="h-64 overflow-y-auto mb-4">
        {messages.map((msg, idx) => (
          <div key={idx} className="mb-2">
            <p>{msg.text}</p>
            <small>{new Date(msg.timestamp).toLocaleString()}</small>
          </div>
        ))}
      </div>
      <div className="flex">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          className="flex-1 p-2 border rounded-l"
        />
        <button onClick={handleSendMessage} className="bg-blue-500 text-white p-2 rounded-r">
          Send
        </button>
      </div>
    </div>
  );
}
