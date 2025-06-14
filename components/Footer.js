import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-gray-800 text-white p-4 mt-8">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
        <p>&copy; 2025 EduHub-KMR. All rights reserved.</p>
        <div className="space-x-4 mt-4 md:mt-0">
          <Link href="/about">About</Link>
          <Link href="/contact">Contact</Link>
          <Link href="/privacy">Privacy Policy</Link>
        </div>
      </div>
    </footer>
  );
}
