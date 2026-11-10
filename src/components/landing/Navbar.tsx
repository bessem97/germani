import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Droplets, Menu, X, Activity } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import logo from '@/images/logo.png';

const navLinks = [
  { label: 'Fonctionnalités', href: '#features' },
  { label: 'Analyses Intelligentes', href: '#analytics' },
  { label: 'Supervision Live', href: '#monitoring' },
  { label: 'Cartographie Réseau', href: '#interactive-map' },
  { label: 'IA Prédictive', href: '#ai-prediction' },
];

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={cn(
        'fixed left-0 right-0 top-0 z-50 transition-all duration-500 border-b',
        isScrolled
          ? 'bg-[#030712]/80 backdrop-blur-xl border-cyan-500/10 shadow-[0_4px_30px_rgba(0,0,0,0.4)]'
          : 'bg-transparent border-transparent'
      )}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="relative flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500 via-blue-600 to-indigo-700 p-[1px] transition-all duration-300 group-hover:scale-105 group-hover:shadow-[0_0_20px_rgba(6,182,212,0.4)]">
              <div className="flex h-full w-full items-center justify-center rounded-[10px] bg-[#030712] overflow-hidden">
                <img src={logo} alt="Qatra Mind" className="h-full w-full object-cover" />
              </div>
              <div className="absolute -bottom-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-cyan-500">
                <Droplets className="h-2.5 w-2.5 text-white animate-pulse" />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold tracking-wider text-white leading-none flex items-center gap-1">
                Qatra <span className="text-cyan-400">Mind</span>
              </span>
              <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest mt-0.5">IoT & AI Water Security</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden items-center gap-8 lg:flex">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-sm font-medium text-slate-400 transition-colors hover:text-cyan-400"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* CTA Buttons */}
          <div className="hidden items-center gap-4 lg:flex">
            <Link to="/dashboard" className="relative group overflow-hidden rounded-xl p-[1px]">
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-blue-600 transition-all duration-500 group-hover:opacity-100" />
              <Button className="relative bg-[#0b0f19] text-white hover:bg-transparent transition-all duration-300 rounded-[10px] px-6 py-2.5 text-sm font-medium">
                Accéder au Dashboard
                <Activity className="ml-2 h-4 w-4 text-cyan-400 animate-pulse" />
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden flex h-10 w-10 items-center justify-center rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700 transition-all"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? (
              <X className="h-5 w-5 text-white" />
            ) : (
              <Menu className="h-5 w-5 text-white" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="border-t border-slate-900 bg-[#030712]/95 backdrop-blur-2xl lg:hidden animate-in slide-in-from-top-5 duration-300">
          <div className="space-y-2 px-4 py-6">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="block rounded-xl px-4 py-3 text-base font-medium text-slate-300 hover:bg-slate-900 hover:text-cyan-400 transition-all"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {link.label}
              </a>
            ))}
            <div className="mt-6 border-t border-slate-900 pt-6 px-4">
              <Link to="/dashboard" className="block w-full">
                <Button className="w-full bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-700 text-white shadow-[0_4px_20px_rgba(6,182,212,0.3)] hover:opacity-90 py-6 text-base font-medium rounded-xl">
                  Accéder au Dashboard
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
