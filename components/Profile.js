import { useState, useEffect } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, db } from '../lib/firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { sendPasswordResetEmail } from 'firebase/auth';

export default function Profile() {
  const [user] = useAuthState(auth);
  const [profile, setProfile] = useState({ name: '', email: '', phoneNumber: '' });
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (user) {
      const fetchProfile = async () => {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
          setProfile(userDoc.data());
        }
      };
      fetchProfile();
    }
  }, [user]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await updateDoc(doc(db, 'users', user.uid), {
        name: profile.name,
        phoneNumber: profile.phoneNumber,
      });
      setMessage('Profile updated successfully!');
      setIsEditing(false);
    } catch (err) {
      setError(err.message);
    }
  };

  const handlePasswordReset = async () => {
    try {
      await sendPasswordResetEmail(auth, user.email);
      setMessage('Password reset email sent!');
    } catch (err) {
      setError(err.message);
    }
  };

  if (!user) return <p className="text-center mt-8">Please log in to view your profile.</p>;

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md mt-20">
      <h2 className="text-2xl font-bold mb-4">Your Profile</h2>
      {isEditing ? (
        <form onSubmit={handleUpdate} className="space-y-4">
          <input
            type="text"
            value={profile.name}
            onChange={(e) => setProfile({ ...profile, name: e.target.value })}
            placeholder="Name"
            className="w-full p-2 border rounded"
          />
          <input
            type="text"
            value={profile.phoneNumber}
            onChange={(e) => setProfile({ ...profile, phoneNumber: e.target.value })}
            placeholder="Phone Number"
            className="w-full p-2 border rounded"
          />
          <input
            type="email"
            value={profile.email}
            disabled
            className="w-full p-2 border rounded bg-gray-100"
          />
          <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded">
            Save Changes
          </button>
          <button
            type="button"
            onClick={() => setIsEditing(false)}
            className="w-full bg-gray-500 text-white p-2 rounded mt-2"
          >
            Cancel
          </button>
        </form>
      ) : (
        <div className="space-y-4">
          <p><strong>Name:</strong> {profile.name}</p>
          <p><strong>Email:</strong> {profile.email}</p>
          <p><strong>Phone:</strong> {profile.phoneNumber}</p>
          <button
            onClick={() => setIsEditing(true)}
            className="w-full bg-blue-500 text-white p-2 rounded"
          >
            Edit Profile
          </button>
          <button
            onClick={handlePasswordReset}
            className="w-full bg-red-500 text-white p-2 rounded"
          >
            Reset Password
          </button>
        </div>
      )}
      {error && <p className="text-red-500 mt-4">{error}</p>}
      {message && <p className="text-green-500 mt-4">{message}</p>}
    </div>
  );
}
