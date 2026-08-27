import React from 'react';
import { Link } from 'react-router-dom';
import { Plus, Target } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { ProgressRing } from '../components/ui/ProgressRing';
import { SkillBadge } from '../components/shared/SkillBadge';
import { JobCard } from '../components/shared/JobCard';
import { useData } from '../context/DataContext';

export const Dashboard: React.FC = () => {
  const { skills, userSkills, jobs, loading } = useData();

  if (loading || jobs.length === 0) return <div className="p-8 text-neutral-dark">Loading dashboard...</div>;

  const currentSkills = skills.filter(s => userSkills.includes(s.id));
  const targetJob = jobs[0]; // Top match

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-bold text-neutral-darkest">Good morning 👋</h1>
        <p className="text-neutral mt-2 text-lg">Explore where your current skills can take you.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Your Skills</CardTitle>
              <Link to="/assessment">
                <Button variant="ghost" size="sm" className="text-primary gap-1">
                  <Plus size={16} /> Add Skill
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {currentSkills.map(skill => (
                  <SkillBadge key={skill.id} name={skill.name} />
                ))}
              </div>
            </CardContent>
          </Card>

          <div>
            <h2 className="text-xl font-bold text-neutral-darkest mb-4">Recent Career Paths</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {jobs.slice(0, 2).map(job => (
                <JobCard key={job.id} job={job} />
              ))}
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          <Card className="bg-primary-dark text-white border-none">
            <CardContent className="p-6 text-center">
              <div className="inline-flex items-center justify-center p-3 bg-white/10 rounded-full mb-4">
                <Target size={24} className="text-accent" />
              </div>
              <h3 className="text-sm font-medium text-white/80 uppercase tracking-wider mb-1">Career Goal</h3>
              <div className="text-2xl font-bold mb-6">{targetJob.title}</div>
              <Link to={`/gap-analysis`} className="block w-full">
                <Button variant="secondary" className="w-full">Analyze Skill Gap</Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 flex flex-col items-center text-center">
              <ProgressRing value={targetJob.matchPercentage} size={140} strokeWidth={14} className="mb-4" />
              <div className="font-semibold text-neutral-darkest">Match with {targetJob.title}</div>
              
              <div className="grid grid-cols-3 gap-2 w-full mt-6">
                <div className="bg-neutral-lightest p-3 rounded-lg flex flex-col items-center">
                  <div className="text-lg font-bold text-neutral-darkest">{targetJob.requirements.length}</div>
                  <div className="text-xs font-medium text-neutral-dark uppercase">Skills</div>
                </div>
                <div className="bg-success/10 p-3 rounded-lg flex flex-col items-center">
                  <div className="text-lg font-bold text-success">
                    {targetJob.requirements.filter(r => userSkills.includes(r.skillId)).length}
                  </div>
                  <div className="text-xs font-medium text-success uppercase">Matched</div>
                </div>
                <div className="bg-error/10 p-3 rounded-lg flex flex-col items-center">
                  <div className="text-lg font-bold text-error">
                    {targetJob.requirements.filter(r => !userSkills.includes(r.skillId)).length}
                  </div>
                  <div className="text-xs font-medium text-error uppercase">Missing</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recommended Next Skills</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-neutral-light">
                {targetJob.requirements?.filter(r => !userSkills.includes(r.skillId)).slice(0, 3).map((req, i) => {
                  const skill = skills.find(s => s.id === req.skillId);
                  return (
                    <div key={req.skillId} className="p-4 flex gap-4 items-start hover:bg-neutral-lightest transition-colors">
                      <div className="mt-0.5 bg-neutral-light rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold text-neutral-dark">
                        {i + 1}
                      </div>
                      <div>
                        <div className="font-semibold text-neutral-darkest">{skill?.name}</div>
                        <div className="text-sm text-neutral mt-1 line-clamp-2">{req.explanation}</div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </div>

      </div>
    </div>
  );
};
