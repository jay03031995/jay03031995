import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  baseUrl: string;
}

export default function Pagination({ currentPage, totalPages, baseUrl }: PaginationProps) {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  const getPageUrl = (page: number) => {
    const separator = baseUrl.includes('?') ? '&' : '?';
    return `${baseUrl}${separator}page=${page}`;
  };

  return (
    <nav className="mt-16 flex items-center justify-center space-x-2">
      <Link
        href={getPageUrl(Math.max(1, currentPage - 1))}
        className={cn(
          "flex h-10 w-10 items-center justify-center rounded-full border bg-white transition-colors hover:bg-gray-50",
          currentPage === 1 && "pointer-events-none opacity-50"
        )}
      >
        <ChevronLeft className="h-5 w-5" />
      </Link>

      {pages.map((page) => (
        <Link
          key={page}
          href={getPageUrl(page)}
          className={cn(
            "flex h-10 w-10 items-center justify-center rounded-full border text-sm font-medium transition-colors",
            currentPage === page
              ? "border-blue-600 bg-blue-600 text-white"
              : "bg-white text-gray-700 hover:bg-gray-50 hover:border-gray-300"
          )}
        >
          {page}
        </Link>
      ))}

      <Link
        href={getPageUrl(Math.min(totalPages, currentPage + 1))}
        className={cn(
          "flex h-10 w-10 items-center justify-center rounded-full border bg-white transition-colors hover:bg-gray-50",
          currentPage === totalPages && "pointer-events-none opacity-50"
        )}
      >
        <ChevronRight className="h-5 w-5" />
      </Link>
    </nav>
  );
}
