import React from 'react';
import { Link } from 'react-router-dom';
import { Building2, ArrowRight } from 'lucide-react';
import { Card, CardContent } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { ProgressBar } from '../ui/ProgressBar';
import type { Job } from '../../types';

interface JobCardProps {
  job: Job;
}

export const JobCard: React.FC<JobCardProps> = ({ job }) => {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-xl font-bold text-neutral-darkest">{job.title}</h3>
            <div className="flex items-center gap-2 text-neutral-dark mt-1">
              <Building2 size={16} />
              <span className="text-sm font-medium">{job.company}</span>
            </div>
          </div>
          <Badge variant={job.matchPercentage >= 70 ? 'success' : job.matchPercentage >= 50 ? 'warning' : 'default'} className="text-sm px-3 py-1">
            {job.matchPercentage}% Match
          </Badge>
        </div>
        
        <div className="mb-4">
          <ProgressBar value={job.matchPercentage} indicatorClassName={job.matchPercentage >= 70 ? 'bg-success' : job.matchPercentage >= 50 ? 'bg-warning' : 'bg-primary'} />
        </div>

        <p className="text-neutral text-sm line-clamp-2 mb-6">
          {job.description}
        </p>

        <div className="flex items-center justify-between">
          <div className="flex -space-x-2 overflow-hidden">
             {/* Show first 3 requirements as a summary */}
             {job.requirements.slice(0, 3).map((req, i) => (
                <div key={i} className="inline-block h-8 w-8 rounded-full ring-2 ring-white bg-neutral-light flex items-center justify-center text-xs font-bold text-neutral-dark">
                  {req.skillId.replace('s', '')}
                </div>
             ))}
             {job.requirements.length > 3 && (
               <div className="inline-block h-8 w-8 rounded-full ring-2 ring-white bg-neutral-lightest border border-neutral-light flex items-center justify-center text-xs font-bold text-neutral-dark">
                 +{job.requirements.length - 3}
               </div>
             )}
          </div>
          <Link 
            to={`/jobs/${job.id}`}
            className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:text-primary-light transition-colors"
          >
            View Skill Gap
            <ArrowRight size={16} />
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};
