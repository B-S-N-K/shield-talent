import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Navbar } from '@/components/Navbar';
import { HomePage } from '@/pages/HomePage';
import { PostJobPage } from '@/pages/PostJobPage';
import { JobDetailPage } from '@/pages/JobDetailPage';
import { Shield } from 'lucide-react';
import { TranslationProvider, useTranslation } from '@/lib/i18n';

function AppContent() {
  const { t } = useTranslation();
  
  return (
    <div className="min-h-screen bg-shield-bg-light text-shield-text-l font-sans selection:bg-shield-navy-lt selection:text-white flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/jobs/:id" element={<JobDetailPage />} />
          <Route path="/post-job" element={<PostJobPage />} />
          {/* Add more routes as we build them */}
        </Routes>
      </main>
      
      <footer className="bg-shield-black border-t border-shield-gray-line pt-12 pb-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
            <div className="col-span-1 md:col-span-1">
              <div className="flex items-center gap-2 mb-4">
                <div className="h-8 w-8 bg-shield-navy-lt rounded-md flex items-center justify-center">
                  <Shield className="h-4 w-4 text-white" />
                </div>
                <span className="font-heading font-bold text-lg text-shield-off-white tracking-[0.12em] uppercase">
                  Shield Talent
                </span>
              </div>
              <p className="text-shield-silver text-sm leading-relaxed max-w-[220px]">
                {t('footer_brand')}
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold text-shield-silver-lt text-xs tracking-widest uppercase mb-4">{t('footer_candidates')}</h4>
              <ul className="space-y-2.5">
                <li><a href="#" className="text-shield-silver hover:text-shield-accent text-sm transition-colors">{t('footer_browse')}</a></li>
                <li><a href="#" className="text-shield-silver hover:text-shield-accent text-sm transition-colors">{t('footer_companies')}</a></li>
                <li><a href="#" className="text-shield-silver hover:text-shield-accent text-sm transition-colors">{t('footer_salary')}</a></li>
                <li><a href="#" className="text-shield-silver hover:text-shield-accent text-sm transition-colors">{t('footer_cv')}</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-shield-silver-lt text-xs tracking-widest uppercase mb-4">{t('footer_employers')}</h4>
              <ul className="space-y-2.5">
                <li><a href="#" className="text-shield-silver hover:text-shield-accent text-sm transition-colors">{t('footer_post')}</a></li>
                <li><a href="#" className="text-shield-silver hover:text-shield-accent text-sm transition-colors">{t('footer_pricing')}</a></li>
                <li><a href="#" className="text-shield-silver hover:text-shield-accent text-sm transition-colors">{t('footer_promo')}</a></li>
                <li><a href="#" className="text-shield-silver hover:text-shield-accent text-sm transition-colors">{t('footer_hr')}</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-shield-silver-lt text-xs tracking-widest uppercase mb-4">{t('footer_company')}</h4>
              <ul className="space-y-2.5">
                <li><a href="#" className="text-shield-silver hover:text-shield-accent text-sm transition-colors">{t('footer_about')}</a></li>
                <li><a href="#" className="text-shield-silver hover:text-shield-accent text-sm transition-colors">{t('footer_privacy')}</a></li>
                <li><a href="#" className="text-shield-silver hover:text-shield-accent text-sm transition-colors">{t('footer_terms')}</a></li>
                <li><a href="#" className="text-shield-silver hover:text-shield-accent text-sm transition-colors">{t('footer_contact')}</a></li>
              </ul>
            </div>
          </div>
          
          <div className="mt-12 pt-6 border-t border-shield-gray-line flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-shield-silver">
            <span>{t('footer_copy')}</span>
            <span>{t('footer_tag')}</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <TranslationProvider>
      <Router>
        <AppContent />
      </Router>
    </TranslationProvider>
  );
}
