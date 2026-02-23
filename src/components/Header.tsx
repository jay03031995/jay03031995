import Link from 'next/link';

export default function Header() {
  return (
    <header className="sticky top-0 z-50 w-full glass-panel">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center text-background-dark">
                <span className="material-symbols-outlined text-[28px]">hub</span>
              </div>
              <div className="flex flex-col">
                <span className="text-white text-xl font-extrabold tracking-tight leading-none uppercase">Extell</span>
                <span className="text-text-muted text-[10px] font-bold tracking-widest uppercase">Systems</span>
              </div>
            </Link>
          </div>

          <nav className="hidden md:flex items-center gap-8">
            <Link href="/products" className="text-sm font-semibold uppercase tracking-wide text-text-light hover:text-primary transition-colors">Products</Link>
            <Link href="/solutions" className="text-sm font-semibold uppercase tracking-wide text-text-light hover:text-primary transition-colors">Solutions</Link>
            <Link href="/about" className="text-sm font-semibold uppercase tracking-wide text-text-light hover:text-primary transition-colors">About Us</Link>
            <Link href="/support" className="text-sm font-semibold uppercase tracking-wide text-text-light hover:text-primary transition-colors">Support</Link>
          </nav>

          <div className="flex items-center gap-4">
            <div className="relative hidden lg:block group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-text-muted group-focus-within:text-primary transition-colors">
                <span className="material-symbols-outlined text-[20px]">search</span>
              </div>
              <input
                className="block w-64 bg-card-dark border border-border-dark rounded-none py-2 pl-10 pr-4 text-sm text-white placeholder-text-muted focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all uppercase placeholder:normal-case"
                placeholder="Search catalog..."
                type="text"
              />
            </div>
            <button className="hidden sm:flex items-center justify-center h-10 px-6 bg-primary hover:bg-primary-hover text-white text-sm font-bold uppercase tracking-wide rounded-none transition-colors shadow-lg shadow-primary/20">
              Client Portal
            </button>
            <button className="md:hidden p-2 text-text-light hover:text-white">
              <span className="material-symbols-outlined">menu</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
