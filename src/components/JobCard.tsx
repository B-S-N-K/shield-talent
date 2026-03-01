import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Clock, DollarSign, Briefcase } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Job } from '@/types';
import { useTranslation } from '@/lib/i18n';

export const JobCard: React.FC<{ job: Job }> = ({ job }) => {
  const { t } = useTranslation();

  return (
    <div className={cn(
      "group relative bg-shield-card-bg border-[1.5px] rounded-xl p-5 flex flex-col md:flex-row md:items-center gap-5 mb-3 transition-all duration-200",
      job.featured 
        ? "border-shield-navy-lt/30" 
        : "border-shield-border-l hover:border-[#b4bcca] hover:shadow-[0_8px_36px_rgba(0,0,0,0.13)] hover:-translate-y-[2px]"
    )}>
      {job.featured && (
        <span className="absolute top-3.5 right-3.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-shield-navy-lt/10 text-[#4a80cc] border border-shield-navy-lt/20">
          {t('featured')}
        </span>
      )}

      {/* Company Logo Placeholder */}
      <div className="h-14 w-14 rounded-xl bg-shield-bg-light border-[1.5px] border-shield-border-l flex items-center justify-center text-shield-text-l font-heading font-bold text-lg flex-shrink-0">
        {job.company.substring(0, 2).toUpperCase()}
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-shield-text-lm font-medium text-xs tracking-wide mb-1">
          {job.company}
        </p>
        <h3 className="text-base font-semibold text-shield-text-l mb-2 leading-snug">
          {job.title}
        </h3>
        
        <div className="flex flex-wrap items-center gap-y-2 gap-x-4 text-xs text-shield-text-lm mb-3">
          <div className="flex items-center gap-1.5">
            <MapPin className="h-3.5 w-3.5" />
            {job.location}
          </div>
          <div className="flex items-center gap-1.5">
            <DollarSign className="h-3.5 w-3.5" />
            {job.salary}
          </div>
          <div className="flex items-center gap-1.5">
            <Briefcase className="h-3.5 w-3.5" />
            {job.type}
          </div>
          <div className="flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5" />
            {job.postedAt}
          </div>
        </div>

        <div className="flex flex-wrap gap-1.5">
          {job.tags.map((tag) => (
            <span 
              key={tag} 
              className="px-2.5 py-1 rounded-md text-[11px] font-medium bg-shield-bg-light text-shield-text-lm border border-shield-border-l"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      <div className="flex-shrink-0 mt-4 md:mt-0">
        <Link 
          to={`/jobs/${job.id}`}
          className="inline-block px-5 py-2.5 bg-shield-bg-light text-shield-text-l border-[1.5px] border-shield-border-l rounded-lg font-semibold text-sm transition-all hover:bg-shield-black hover:text-white hover:border-shield-black whitespace-nowrap"
        >
          {t('view')}
        </Link>
      </div>
    </div>
  );
}
