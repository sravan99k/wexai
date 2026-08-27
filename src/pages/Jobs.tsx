import React, { useState } from 'react';
import { SearchInput } from '../components/ui/SearchInput';
import { JobCard } from '../components/shared/JobCard';
import { useData } from '../context/DataContext';

export const Jobs: React.FC = () => {
  const { jobs, loading } = useData();
  const [searchQuery, setSearchQuery] = useState('');

  if (loading) return <div className="p-8 text-neutral-dark">Loading jobs...</div>;

  const filteredJobs = jobs.filter(job => 
    job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    job.company.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-bold text-neutral-darkest">Explore Career Opportunities</h1>
        <p className="text-neutral mt-2 text-lg">Find roles that match your skills and discover what you need to learn next.</p>
      </div>

      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between bg-white p-4 rounded-xl border border-neutral-light shadow-sm">
        <SearchInput
          value={searchQuery}
          onChange={setSearchQuery}
          onClear={() => setSearchQuery('')}
          placeholder="Search jobs, skills or technologies..."
          className="w-full md:max-w-md"
        />
        
        <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0 hide-scrollbar">
          <select className="px-3 py-2 bg-neutral-lightest border border-neutral-light rounded-lg text-sm font-medium text-neutral-dark focus:outline-none focus:ring-2 focus:ring-primary">
            <option>All Roles</option>
            <option>Engineering</option>
            <option>Data</option>
          </select>
          <select className="px-3 py-2 bg-neutral-lightest border border-neutral-light rounded-lg text-sm font-medium text-neutral-dark focus:outline-none focus:ring-2 focus:ring-primary">
            <option>Any Match %</option>
            <option>&gt; 70% Match</option>
            <option>&gt; 50% Match</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredJobs.length > 0 ? (
          filteredJobs.map(job => (
            <JobCard key={job.id} job={job} />
          ))
        ) : (
          <div className="col-span-full py-12 text-center text-neutral bg-white rounded-xl border border-dashed border-neutral-light">
            No jobs found matching "{searchQuery}"
          </div>
        )}
      </div>
    </div>
  );
};
