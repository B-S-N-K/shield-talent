import React, { useEffect, useState } from 'react';
import { Search, MapPin, Briefcase, Building2, Bell } from 'lucide-react';
import { JobCard } from '@/components/JobCard';
import { Radar } from '@/components/Radar';
import { Job } from '@/types';
import { useTranslation } from '@/lib/i18n';

export function HomePage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const { t } = useTranslation();

  useEffect(() => {
    fetch('/api/jobs')
      .then(res => res.json())
      .then(data => {
        setJobs(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to fetch jobs", err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="min-h-screen bg-shield-bg-light">
      {/* Hero Section */}
      <div className="relative bg-shield-black pt-20 pb-0 overflow-hidden min-h-[580px] flex flex-col justify-center text-center">
        {/* Radar Animation */}
        <Radar />
        
        {/* Faint crosshair grid behind radar */}
        <div className="absolute inset-0 opacity-20 pointer-events-none z-0" style={{
          backgroundImage: 'linear-gradient(var(--color-shield-gray-line) 1px, transparent 1px), linear-gradient(90deg, var(--color-shield-gray-line) 1px, transparent 1px)',
          backgroundSize: '52px 52px',
          maskImage: 'radial-gradient(ellipse 90% 75% at 50% 45%, black, transparent)'
        }}></div>
        
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="inline-flex items-center gap-2 bg-shield-navy-lt/10 border border-shield-navy-lt/40 text-shield-accent text-xs font-semibold px-4 py-1.5 rounded-full mb-6 uppercase tracking-widest">
            <span className="w-1.5 h-1.5 rounded-full bg-shield-accent animate-pulse"></span>
            {t('hero_badge')}
          </div>
          
          <h1 
            className="font-heading text-5xl sm:text-6xl lg:text-[5rem] font-extrabold text-shield-off-white leading-none tracking-tight mb-5 uppercase"
            dangerouslySetInnerHTML={{ __html: t('hero_h1') }}
          />
          
          <p className="max-w-xl mx-auto text-base text-shield-silver mb-10 leading-relaxed">
            {t('hero_sub')}
          </p>

          {/* Category Pills */}
          <div className="flex flex-wrap justify-center gap-2 pb-16">
            {[
              t('cat_engineering'), 
              t('cat_it'), 
              t('cat_trades'), 
              t('cat_logistics'), 
              t('cat_management')
            ].map(cat => (
              <button key={cat} className="inline-flex items-center gap-2 bg-white/5 border border-shield-gray-mid text-shield-silver text-sm font-medium px-4 py-2 rounded-lg hover:bg-shield-navy-lt/20 hover:border-shield-navy-lt/50 hover:text-shield-accent transition-all">
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Fade to white wave */}
        <div className="absolute bottom-0 left-0 w-full h-[140px] pointer-events-none z-20" style={{
          background: 'linear-gradient(to bottom, rgba(17,17,17,0) 0%, rgba(17,17,17,0.6) 45%, rgba(17,17,17,1) 78%, #ffffff 100%)'
        }}></div>
      </div>

      {/* Featured Companies Section */}
      <div className="bg-white py-12 px-4 relative z-30">
        <p className="text-center text-sm text-shield-text-lm mb-6 tracking-wide">
          {t('featured_label')} <a href="#" className="text-shield-text-l font-semibold underline underline-offset-4">{t('featured_link')}</a>{t('featured_label2')}
        </p>
        <div className="flex flex-wrap justify-center gap-4 max-w-5xl mx-auto">
          {['Rheinmetall', 'Thales', 'Airbus'].map(company => (
            <div key={company} className="flex items-center gap-3 bg-white border-[1.5px] border-shield-border-l rounded-xl px-5 py-3 min-w-[195px] cursor-pointer hover:border-shield-navy-lt hover:shadow-[0_4px_20px_rgba(42,82,152,0.1)] hover:-translate-y-0.5 transition-all">
              <div className="w-11 h-11 rounded-lg bg-shield-bg-light border border-shield-border-l flex items-center justify-center font-heading font-bold text-sm text-shield-text-l">
                {company.substring(0, 2).toUpperCase()}
              </div>
              <div>
                <span className="block font-semibold text-sm text-shield-text-l">{company}</span>
                <span className="block text-xs text-shield-text-lm">{t('view')} jobs</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Search Section */}
      <div className="max-w-4xl mx-auto px-4 pt-16 pb-12">
        <h2 className="text-center font-heading font-bold text-3xl sm:text-4xl text-shield-text-l mb-8 uppercase tracking-wide">
          {t('search_heading')}
        </h2>
        
        <div className="bg-white border-[1.5px] border-shield-border-l rounded-2xl p-5 shadow-[0_8px_36px_rgba(0,0,0,0.13)]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
            <div className="flex items-center gap-2 bg-shield-bg-light border-[1.5px] border-shield-border-l rounded-xl px-4 py-2.5 focus-within:border-shield-navy-lt transition-colors">
              <Search className="h-4 w-4 text-shield-text-lm opacity-60" />
              <input 
                type="text" 
                placeholder={t('search_kw_placeholder')}
                className="bg-transparent border-none outline-none w-full text-sm text-shield-text-l placeholder:text-shield-text-lm"
              />
            </div>
            <div className="flex items-center gap-2 bg-shield-bg-light border-[1.5px] border-shield-border-l rounded-xl px-4 py-2.5 focus-within:border-shield-navy-lt transition-colors">
              <MapPin className="h-4 w-4 text-shield-text-lm opacity-60" />
              <select className="bg-transparent border-none outline-none w-full text-sm text-shield-text-l appearance-none cursor-pointer">
                <option value="">{t('search_location')}</option>
                <option>Germany</option>
                <option>France</option>
                <option>United Kingdom</option>
                <option>Czech Republic</option>
                <option>Poland</option>
                <option>Remote</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
            <div className="flex items-center gap-2 bg-shield-bg-light border-[1.5px] border-shield-border-l rounded-xl px-4 py-2.5 focus-within:border-shield-navy-lt transition-colors">
              <Briefcase className="h-4 w-4 text-shield-text-lm opacity-60" />
              <select className="bg-transparent border-none outline-none w-full text-sm text-shield-text-l appearance-none cursor-pointer">
                <option value="">{t('search_function')}</option>
                <option>Engineering</option>
                <option>IT & Cyber</option>
              </select>
            </div>
            <div className="flex items-center gap-2 bg-shield-bg-light border-[1.5px] border-shield-border-l rounded-xl px-4 py-2.5 focus-within:border-shield-navy-lt transition-colors">
              <Building2 className="h-4 w-4 text-shield-text-lm opacity-60" />
              <select className="bg-transparent border-none outline-none w-full text-sm text-shield-text-l appearance-none cursor-pointer">
                <option value="">{t('search_type')}</option>
                <option>Full Time</option>
                <option>Contract</option>
              </select>
            </div>
          </div>
          <button className="w-full bg-shield-black hover:bg-shield-navy-lt text-white rounded-xl font-heading font-bold text-base py-3.5 uppercase tracking-widest transition-all hover:-translate-y-[1px]">
            {t('search_btn')}
          </button>
        </div>
      </div>

      {/* Main Content / Listings */}
      <div className="max-w-4xl mx-auto px-4 pb-24">
        <div className="flex items-center justify-between mb-5 pb-4 border-b-[1.5px] border-shield-border-l">
          <p className="font-semibold text-sm text-shield-text-l">
            <strong className="font-heading text-lg text-shield-navy-lt tracking-wide mr-1">{jobs.length}</strong> 
            {t('open_positions')}
          </p>
          <select className="bg-white border-[1.5px] border-shield-border-l rounded-lg px-3 py-1.5 text-sm text-shield-text-l outline-none cursor-pointer">
            <option>{t('sort_newest')}</option>
            <option>{t('sort_salary')}</option>
          </select>
        </div>

        {/* Hire Banner */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between bg-white border-[1.5px] border-shield-border-l border-l-4 border-l-shield-navy-lt rounded-xl p-4 mb-6 gap-4">
          <p className="text-sm text-shield-text-lm" dangerouslySetInnerHTML={{ __html: '🛡️ ' + t('banner_text') }} />
          <button className="bg-shield-black hover:bg-shield-navy-lt text-white text-sm font-semibold px-5 py-2 rounded-lg whitespace-nowrap transition-colors">
            {t('banner_btn')}
          </button>
        </div>

        <div className="space-y-3">
          {loading ? (
            <div className="text-center py-20 text-shield-text-lm">Loading positions...</div>
          ) : jobs.map((job, index) => (
            <React.Fragment key={job.id}>
              <JobCard job={job} />
              {/* Alert Banner after the first job */}
              {index === 0 && (
                <div className="bg-shield-black rounded-xl p-4 md:p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border border-shield-gray-line my-3 shadow-lg relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-shield-navy-lt/5 rounded-bl-full pointer-events-none"></div>
                  <div className="relative z-10 flex-1">
                    <h3 className="text-white font-bold text-base mb-1 flex items-center gap-2">
                      <Bell className="h-4 w-4 text-[#f59e0b]" />
                      {t('alert_title')}
                    </h3>
                    <p className="text-shield-silver text-xs mb-3 max-w-2xl">
                      {t('alert_sub')}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <span className="bg-shield-gray-dark text-shield-silver text-[11px] px-2.5 py-1 rounded-md border border-shield-gray-mid flex items-center">
                        {t('alert_automate')}
                      </span>
                      <span className="bg-shield-gray-dark text-shield-silver text-[11px] px-2.5 py-1 rounded-md border border-shield-gray-mid flex items-center">
                        {t('alert_never_miss')}
                      </span>
                    </div>
                  </div>
                  <div className="relative z-10 w-full md:w-auto flex-shrink-0">
                    <button className="w-full md:w-auto bg-shield-navy-lt hover:bg-shield-navy-mid text-white text-sm font-semibold px-5 py-2.5 rounded-lg whitespace-nowrap transition-colors shadow-[0_0_15px_rgba(29,78,216,0.3)]">
                      {t('alert_btn')}
                    </button>
                  </div>
                </div>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
}
