import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MapPin, Clock, DollarSign, Briefcase, ChevronLeft, CheckCircle, Upload } from 'lucide-react';
import { Job } from '@/types';
import { useTranslation } from '@/lib/i18n';

export function JobDetailPage() {
  const { id } = useParams();
  const { t } = useTranslation();
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [applicationSent, setApplicationSent] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
    cvUrl: ''
  });

  useEffect(() => {
    fetch(`/api/jobs/${id}`)
      .then(res => res.json())
      .then(data => {
        setJob(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to fetch job", err);
        setLoading(false);
      });
  }, [id]);

  const handleApply = async (e: React.FormEvent) => {
    e.preventDefault();
    setApplying(true);
    
    try {
      const response = await fetch('/api/applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jobId: id,
          ...formData
        })
      });
      
      if (response.ok) {
        setApplicationSent(true);
      } else {
        alert('Failed to send application');
      }
    } catch (error) {
      console.error('Error applying:', error);
      alert('Error applying');
    } finally {
      setApplying(false);
    }
  };

  if (loading) return <div className="min-h-screen bg-shield-bg-light flex items-center justify-center text-shield-text-lm">Loading...</div>;
  if (!job) return <div className="min-h-screen bg-shield-bg-light flex items-center justify-center text-shield-text-lm">Job not found</div>;

  return (
    <div className="min-h-screen bg-shield-bg-light py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <Link to="/" className="inline-flex items-center text-shield-text-lm hover:text-shield-text-l mb-8 transition-colors text-sm font-medium">
          <ChevronLeft className="h-4 w-4 mr-1" />
          Back to jobs
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white border-[1.5px] border-shield-border-l rounded-2xl overflow-hidden shadow-[0_8px_36px_rgba(0,0,0,0.08)] relative">
              {job.featured && <div className="absolute top-0 left-0 w-full h-1 bg-shield-navy-lt"></div>}
              
              <div className="p-8 border-b border-shield-border-l">
                <div className="flex items-center gap-4 mb-6">
                  <div className="h-16 w-16 rounded-xl bg-shield-bg-light border-[1.5px] border-shield-border-l flex items-center justify-center text-shield-text-l font-heading font-bold text-xl">
                    {job.company.substring(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-shield-text-l mb-1">{job.title}</h1>
                    <div className="text-lg text-shield-navy-lt font-medium">
                      {job.company}
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-4 text-sm text-shield-text-lm">
                  <div className="flex items-center gap-2 bg-shield-bg-light px-4 py-2 rounded-lg border border-shield-border-l">
                    <MapPin className="h-4 w-4" />
                    {job.location}
                  </div>
                  <div className="flex items-center gap-2 bg-shield-bg-light px-4 py-2 rounded-lg border border-shield-border-l">
                    <Briefcase className="h-4 w-4" />
                    {job.type}
                  </div>
                  <div className="flex items-center gap-2 bg-shield-bg-light px-4 py-2 rounded-lg border border-shield-border-l">
                    <DollarSign className="h-4 w-4" />
                    {job.salary}
                  </div>
                  <div className="flex items-center gap-2 bg-shield-bg-light px-4 py-2 rounded-lg border border-shield-border-l">
                    <Clock className="h-4 w-4" />
                    {job.postedAt}
                  </div>
                </div>
              </div>

              <div className="p-8">
                <h3 className="text-lg font-bold text-shield-text-l mb-4 font-heading uppercase tracking-wide">{t('job_briefing')}</h3>
                <div className="prose max-w-none whitespace-pre-wrap text-shield-text-lm leading-relaxed text-sm">
                  {job.description}
                </div>

                <div className="mt-10">
                  <h3 className="text-lg font-bold text-shield-text-l mb-4 font-heading uppercase tracking-wide">{t('job_capabilities')}</h3>
                  <div className="flex flex-wrap gap-2">
                    {job.tags.map(tag => (
                      <span key={tag} className="px-3 py-1.5 text-xs font-medium bg-shield-bg-light text-shield-text-lm border border-shield-border-l rounded-md">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar / Application Form */}
          <div className="lg:col-span-1">
            <div className="bg-white p-6 border-[1.5px] border-shield-border-l rounded-2xl sticky top-24 shadow-[0_8px_36px_rgba(0,0,0,0.08)]">
              <h3 className="text-xl font-bold text-shield-text-l mb-2 font-heading uppercase tracking-wide">{t('job_initiate')}</h3>
              <p className="text-shield-text-lm text-sm mb-6 pb-6 border-b border-shield-border-l">
                {t('job_dossier')}
              </p>

              {applicationSent ? (
                <div className="text-center py-8 bg-shield-bg-light rounded-xl border border-shield-border-l">
                  <CheckCircle className="h-12 w-12 text-shield-navy-lt mx-auto mb-4" />
                  <h4 className="text-lg font-bold text-shield-text-l mb-2">Application Sent</h4>
                  <p className="text-shield-text-lm text-sm">{t('job_success')}</p>
                </div>
              ) : (
                <form onSubmit={handleApply} className="space-y-5">
                  <div>
                    <label className="block text-xs font-bold text-shield-text-lm mb-1.5 uppercase tracking-wider">{t('job_name')}</label>
                    <input
                      type="text"
                      required
                      className="w-full bg-shield-bg-light border-[1.5px] border-shield-border-l rounded-xl px-3 py-2.5 text-shield-text-l text-sm focus:border-shield-navy-lt outline-none transition-colors"
                      value={formData.name}
                      onChange={e => setFormData({...formData, name: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-shield-text-lm mb-1.5 uppercase tracking-wider">{t('job_email')}</label>
                    <input
                      type="email"
                      required
                      className="w-full bg-shield-bg-light border-[1.5px] border-shield-border-l rounded-xl px-3 py-2.5 text-shield-text-l text-sm focus:border-shield-navy-lt outline-none transition-colors"
                      value={formData.email}
                      onChange={e => setFormData({...formData, email: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-shield-text-lm mb-1.5 uppercase tracking-wider">{t('job_link')}</label>
                    <div className="relative">
                      <Upload className="absolute right-3 top-3 h-4 w-4 text-shield-text-lm opacity-60" />
                      <input
                        type="url"
                        required
                        placeholder="https://"
                        className="w-full bg-shield-bg-light border-[1.5px] border-shield-border-l rounded-xl px-3 py-2.5 pr-10 text-shield-text-l text-sm focus:border-shield-navy-lt outline-none transition-colors"
                        value={formData.cvUrl}
                        onChange={e => setFormData({...formData, cvUrl: e.target.value})}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-shield-text-lm mb-1.5 uppercase tracking-wider">{t('job_message')}</label>
                    <textarea
                      rows={4}
                      className="w-full bg-shield-bg-light border-[1.5px] border-shield-border-l rounded-xl px-3 py-2.5 text-shield-text-l text-sm focus:border-shield-navy-lt outline-none transition-colors"
                      value={formData.message}
                      onChange={e => setFormData({...formData, message: e.target.value})}
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={applying}
                    className="w-full bg-shield-black hover:bg-shield-navy-lt text-white font-heading font-bold text-base py-3.5 rounded-xl transition-all hover:-translate-y-[1px] disabled:opacity-50 uppercase tracking-widest"
                  >
                    {applying ? 'TRANSMITTING...' : t('job_submit')}
                  </button>
                </form>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
