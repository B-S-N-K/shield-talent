import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTranslation } from '@/lib/i18n';

export function Navbar() {
  const [isOpen, setIsOpen] = React.useState(false);
  const { t, lang, setLang } = useTranslation();

  return (
    <nav className="bg-shield-black border-b border-shield-gray-line sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center gap-3 group">
              <div className="h-8 w-8 bg-shield-navy-lt rounded-md flex items-center justify-center">
                <Shield className="h-4 w-4 text-white" />
              </div>
              <span className="font-heading font-bold text-xl text-shield-off-white tracking-[0.12em] uppercase">
                Shield Talent
              </span>
            </Link>
            <div className="hidden md:ml-10 md:flex md:space-x-2">
              <Link to="/jobs" className="text-shield-silver hover:text-white hover:bg-shield-gray-dark px-3 py-1.5 rounded-md text-sm font-medium transition-colors tracking-wide">
                {t('nav_jobs')}
              </Link>
              <Link to="/companies" className="text-shield-silver hover:text-white hover:bg-shield-gray-dark px-3 py-1.5 rounded-md text-sm font-medium transition-colors tracking-wide">
                {t('nav_companies')}
              </Link>
              <Link to="/salaries" className="text-shield-silver hover:text-white hover:bg-shield-gray-dark px-3 py-1.5 rounded-md text-sm font-medium transition-colors tracking-wide">
                {t('nav_salaries')}
              </Link>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-4">
            {/* Language Switcher */}
            <div className="flex items-center gap-1 bg-shield-gray-dark border border-shield-gray-mid rounded-md px-1.5 py-1">
              <button 
                onClick={() => setLang('cs')}
                className={cn("text-xs font-semibold px-2 py-1 rounded transition-colors", lang === 'cs' ? "bg-shield-navy-lt text-white" : "text-shield-silver hover:text-shield-off-white")}
              >
                CS
              </button>
              <span className="text-shield-gray-mid text-xs">|</span>
              <button 
                onClick={() => setLang('en')}
                className={cn("text-xs font-semibold px-2 py-1 rounded transition-colors", lang === 'en' ? "bg-shield-navy-lt text-white" : "text-shield-silver hover:text-shield-off-white")}
              >
                EN
              </button>
            </div>

            <Link to="/login" className="text-shield-silver hover:text-shield-off-white hover:border-shield-navy-lt border border-shield-gray-mid px-4 py-1.5 rounded-lg text-sm font-medium transition-colors">
              {t('nav_login')}
            </Link>
            <Link
              to="/post-job"
              className="bg-shield-navy-lt hover:bg-shield-navy-mid text-white px-5 py-2 rounded-lg text-sm font-bold transition-all hover:-translate-y-[1px] tracking-wide"
            >
              {t('nav_hire')}
            </Link>
          </div>
          <div className="flex items-center md:hidden gap-3">
            <div className="flex items-center gap-1 bg-shield-gray-dark border border-shield-gray-mid rounded-md px-1 py-0.5">
              <button 
                onClick={() => setLang('cs')}
                className={cn("text-[10px] font-semibold px-1.5 py-0.5 rounded", lang === 'cs' ? "bg-shield-navy-lt text-white" : "text-shield-silver")}
              >
                CS
              </button>
              <button 
                onClick={() => setLang('en')}
                className={cn("text-[10px] font-semibold px-1.5 py-0.5 rounded", lang === 'en' ? "bg-shield-navy-lt text-white" : "text-shield-silver")}
              >
                EN
              </button>
            </div>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-shield-silver hover:text-white hover:bg-shield-gray-dark focus:outline-none"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden bg-shield-black border-b border-shield-gray-line">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link to="/jobs" className="text-shield-silver hover:text-white block px-3 py-2 text-base font-medium">{t('nav_jobs')}</Link>
            <Link to="/companies" className="text-shield-silver hover:text-white block px-3 py-2 text-base font-medium">{t('nav_companies')}</Link>
            <Link to="/post-job" className="text-shield-accent hover:text-white block px-3 py-2 text-base font-medium">{t('nav_hire')}</Link>
          </div>
        </div>
      )}
    </nav>
  );
}
