import Link from 'next/link';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../lib/firebase';

export default function Navbar() {
  const [user] = useAuthState(auth);

  return (
    <nav className="bg-blue-600 text-white p-4 fixed w-full top-0 z-10 md:flex md:justify-between">
      <div className="flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold">
          EduHub-KMR
        </Link>
        <div className="md:hidden">
          {/* Hamburger menu for mobile */}
          <button className="focus:outline-none">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>
      <div className="hidden md:flex space-x-4">
        <Link href="/courses">Courses</Link>
        <Link href="/blogs">Blogs</Link>
        <Link href="/notes">Notes</Link>
        {user && user.email === 'admin@eduhub.com' && <Link href="/admin">Admin</Link>}
        {user ? (
          <Link href="/profile">Profile</Link>
        ) : (
          <>
            <Link href="/login">Login</Link>
            <Link href="/signup">Sign Up</Link>
          </>
        )}
      </div>
    </nav>
  );
}
