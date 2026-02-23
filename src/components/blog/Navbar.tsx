import Link from 'next/link';
import { Search } from 'lucide-react';

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 border-b bg-white/80 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link href="/" className="text-2xl font-bold text-gray-900">
              The Blog
            </Link>
            <div className="ml-10 hidden space-x-8 md:flex">
              <Link href="/" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">Home</Link>
              <Link href="/blog/category/technology" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">Technology</Link>
              <Link href="/blog/category/design" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">Design</Link>
              <Link href="/blog/category/culture" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">Culture</Link>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/search" className="rounded-full p-2 text-gray-500 hover:bg-gray-100 transition-colors">
              <Search className="h-5 w-5" />
            </Link>
            <Link href="/admin">
              <span className="text-sm font-medium text-blue-600 hover:text-blue-700">Admin</span>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
