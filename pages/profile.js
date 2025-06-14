import Profile from '../components/Profile';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function ProfilePage() {
  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <Profile />
      <Footer />
    </div>
  );
}
