import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Building2, Check, ExternalLink } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { ProgressRing } from '../components/ui/ProgressRing';
import { SkillBadge } from '../components/shared/SkillBadge';
import { useData } from '../context/DataContext';
import { fetchJobBridge } from '../api';

export const JobDetails: React.FC = () => {
  const { id: jobId } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { jobs, skills, userSkills, loading } = useData();
  const [bridge, setBridge] = useState<any[]>([]);

  useEffect(() => {
    if (jobId) {
      fetchJobBridge(jobId).then(setBridge).catch(console.error);
    }
  }, [jobId]);

  if (loading) return <div className="p-8 text-neutral-dark text-center py-20">Loading job details...</div>;
  
  const job = jobs.find(j => j.id === jobId);

  if (!job) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold text-neutral-darkest">Job not found</h2>
        <Button onClick={() => navigate('/jobs')} className="mt-4">Back to Jobs</Button>
      </div>
    );
  }

  const requiredSkillsDetails = job.requirements?.map(req => ({
    ...req,
    skill: skills.find(s => s.id === req.skillId)!
  })).filter(req => req.skill) || [];

  const matchedSkills = requiredSkillsDetails.filter(req => userSkills.includes(req.skillId));
  const missingSkills = requiredSkillsDetails.filter(req => !userSkills.includes(req.skillId));

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-500 pb-12">
      <button 
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-neutral-dark hover:text-primary transition-colors text-sm font-medium"
      >
        <ArrowLeft size={16} /> Back to Jobs
      </button>

      <div className="flex flex-col md:flex-row items-center gap-6 bg-white p-6 md:p-8 rounded-xl border border-neutral-light shadow-sm">
        <ProgressRing value={job.matchPercentage} size={100} strokeWidth={10} />
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-neutral-darkest mb-2">{job.title}</h1>
          <div className="flex items-center gap-4 text-neutral-dark">
            <div className="flex items-center gap-1.5">
              <Building2 size={18} />
              <span className="font-medium text-lg">{job.company}</span>
            </div>
            <Badge variant={job.matchPercentage >= 70 ? 'success' : job.matchPercentage >= 50 ? 'warning' : 'default'}>
              {job.matchPercentage}% Match
            </Badge>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Job Context */}
        <div className="lg:col-span-1 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Role Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-neutral-dark leading-relaxed">
                {job.description}
              </p>
            </CardContent>
          </Card>
          
          <Card className="bg-primary/5 border-primary/20">
            <CardHeader className="border-primary/10 pb-3">
              <CardTitle className="text-primary-dark">Recommended Prep</CardTitle>
            </CardHeader>
            <CardContent className="pt-2">
              <ol className="list-decimal list-inside space-y-3 text-sm text-neutral-dark font-medium">
                {missingSkills.slice(0, 3).map((req, i) => (
                  <li key={i} className="leading-tight">
                    Learn <span className="font-bold text-primary-dark">{req.skill.name}</span> fundamentals
                  </li>
                ))}
                {missingSkills.length === 0 && (
                  <li className="text-success flex items-center gap-2 list-none">
                    <Check size={16} /> You're ready to apply!
                  </li>
                )}
              </ol>
              
              <Link to="/career-graph" className="mt-6 block">
                <Button variant="outline" className="w-full gap-2 border-primary/20 text-primary-dark hover:bg-primary/10">
                  <ExternalLink size={16} /> View Career Graph
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Skill Gap Analysis */}
        <div className="lg:col-span-2 space-y-6">
          
          <Card className="border-success/30 bg-success/5">
            <CardHeader className="pb-4">
              <CardTitle className="text-success-dark flex items-center gap-2">
                <Check size={20} /> Skills You Have
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {matchedSkills.map(req => (
                  <SkillBadge key={req.skillId} name={req.skill.name} hasSkill className="bg-white border-success/30" />
                ))}
                {matchedSkills.length === 0 && (
                  <p className="text-neutral-dark italic text-sm">You don't have any of the required skills yet.</p>
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="border-warning/30 bg-warning/5">
            <CardHeader className="pb-4">
              <CardTitle className="text-warning-dark">Missing Skills (Your Gap)</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {missingSkills.length === 0 && (
                <p className="text-success italic font-medium">You have no skill gaps for this role!</p>
              )}
              {missingSkills.map(req => (
                <div key={req.skillId} className="bg-white p-4 rounded-lg border border-warning/20 shadow-sm flex flex-col sm:flex-row justify-between gap-4">
                  <div>
                    <h4 className="font-bold text-neutral-darkest mb-1">{req.skill.name}</h4>
                    <p className="text-sm text-neutral-dark">{req.explanation}</p>
                  </div>
                  <div className="flex sm:flex-col items-center sm:items-end gap-2 shrink-0">
                    <Badge variant={req.importance === 'high' ? 'error' : 'warning'}>
                      {req.importance === 'high' ? 'High Priority' : 'Med Priority'}
                    </Badge>
                    <span className="text-xs font-medium text-neutral uppercase">
                      Difficulty: {req.difficulty}
                    </span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

        </div>

        {bridge.length > 0 && (
          <div className="mt-8 animate-in slide-in-from-bottom-4 duration-500 delay-150">
            <h3 className="text-xl font-bold text-neutral-darkest mb-4 flex items-center gap-2">
              <span className="w-8 h-8 rounded-full bg-accent/10 text-accent flex items-center justify-center">🚀</span>
              Skill Bridge Recommendations
            </h3>
            <p className="text-neutral-dark mb-4">Leverage what you already know! Based on your current skills, here are the easiest ways to bridge your gap for this role:</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {bridge.map((b, i) => (
                <Card key={i} className="border-l-4 border-accent hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <p className="text-sm">
                      Since you know <strong className="text-accent-dark">{b.currentSkill}</strong>, you can easily learn <strong className="text-primary-dark">{b.recommendedSkill}</strong>.
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
