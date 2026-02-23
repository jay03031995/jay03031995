import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-[#0b0c1f] border-t border-border-dark pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          <div className="flex flex-col gap-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-white rounded-sm flex items-center justify-center text-background-dark">
                <span className="material-symbols-outlined text-[20px]">hub</span>
              </div>
              <span className="text-white text-lg font-bold uppercase tracking-tight">Extell Systems</span>
            </div>
            <p className="text-text-muted text-sm leading-relaxed font-medium">
              Leading provider of advanced power electronics and ICT network infrastructure for the modern enterprise.
            </p>
            <div className="flex gap-4">
              <Link href="#" className="w-9 h-9 rounded-sm bg-border-dark flex items-center justify-center text-text-muted hover:bg-primary hover:text-white transition-colors">
                <span className="material-symbols-outlined text-[18px]">public</span>
              </Link>
              <Link href="#" className="w-9 h-9 rounded-sm bg-border-dark flex items-center justify-center text-text-muted hover:bg-primary hover:text-white transition-colors">
                <span className="material-symbols-outlined text-[18px]">mail</span>
              </Link>
            </div>
          </div>

          <div>
            <h4 className="text-white font-bold mb-6 uppercase tracking-wider text-sm">Solutions</h4>
            <ul className="space-y-3">
              <li><Link href="/solutions" className="text-text-muted hover:text-primary text-sm font-medium transition-colors">Data Centers</Link></li>
              <li><Link href="/solutions" className="text-text-muted hover:text-primary text-sm font-medium transition-colors">Industrial Power</Link></li>
              <li><Link href="/solutions" className="text-text-muted hover:text-primary text-sm font-medium transition-colors">Fiber Networks</Link></li>
              <li><Link href="/solutions" className="text-text-muted hover:text-primary text-sm font-medium transition-colors">Enterprise IT</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-6 uppercase tracking-wider text-sm">Company</h4>
            <ul className="space-y-3">
              <li><Link href="/about" className="text-text-muted hover:text-primary text-sm font-medium transition-colors">About Us</Link></li>
              <li><Link href="/careers" className="text-text-muted hover:text-primary text-sm font-medium transition-colors">Careers</Link></li>
              <li><Link href="/compliance" className="text-text-muted hover:text-primary text-sm font-medium transition-colors">Compliance</Link></li>
              <li><Link href="/case-studies" className="text-text-muted hover:text-primary text-sm font-medium transition-colors">Case Studies</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-6 uppercase tracking-wider text-sm">Resources</h4>
            <ul className="space-y-3">
              <li><Link href="/support" className="text-text-muted hover:text-primary text-sm font-medium transition-colors">Documentation</Link></li>
              <li><Link href="/support/downloads" className="text-text-muted hover:text-primary text-sm font-medium transition-colors">Downloads Center</Link></li>
              <li><Link href="/support" className="text-text-muted hover:text-primary text-sm font-medium transition-colors">Support Portal</Link></li>
              <li><Link href="/contact" className="text-text-muted hover:text-primary text-sm font-medium transition-colors">Contact Sales</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border-dark pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-text-muted text-xs font-medium">© {new Date().getFullYear()} Extell Systems Inc. All rights reserved.</p>
          <div className="flex gap-6">
            <Link href="#" className="text-text-muted hover:text-white text-xs font-medium">Privacy Policy</Link>
            <Link href="#" className="text-text-muted hover:text-white text-xs font-medium">Terms of Service</Link>
            <Link href="#" className="text-text-muted hover:text-white text-xs font-medium">Sitemap</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
