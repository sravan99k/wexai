import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ArrowDown } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { ProgressRing } from '../components/ui/ProgressRing';
import { Badge } from '../components/ui/Badge';
import { SkillBadge } from '../components/shared/SkillBadge';
import { mockJobs, mockSkills, userSkills } from '../data/mockData';

export const GapAnalysis: React.FC = () => {
  const targetJob = mockJobs[0]; // Full Stack Engineer

  const requiredSkills = targetJob.requirements.map(req => {
    return {
      ...req,
      skill: mockSkills.find(s => s.id === req.skillId)!
    };
  });

  const matchedSkills = requiredSkills.filter(req => userSkills.includes(req.skillId));
  const missingSkills = requiredSkills.filter(req => !userSkills.includes(req.skillId));

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-neutral-darkest">Your Skill Gap</h1>
          <p className="text-neutral mt-2 text-lg">
            Target Role: <span className="font-semibold text-primary-dark">{targetJob.title}</span>
          </p>
        </div>
        <Link to="/career-graph">
          <Button variant="secondary" className="gap-2">
            Explore Career Graph <ArrowRight size={18} />
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Match Score Card */}
        <Card className="lg:col-span-1 bg-neutral-lightest border-none flex flex-col items-center justify-center p-8">
          <ProgressRing value={targetJob.matchPercentage} size={160} strokeWidth={16} />
          <div className="mt-4 text-center">
            <h2 className="text-2xl font-bold text-neutral-darkest">Match Score</h2>
            <p className="text-neutral mt-1">Based on {targetJob.requirements.length} required skills</p>
          </div>
        </Card>

        {/* Existing Skills Card */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>You Already Have</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {matchedSkills.map(req => (
                <SkillBadge 
                  key={req.skillId} 
                  name={req.skill.name} 
                  hasSkill 
                  className="w-full justify-start py-2 px-4 bg-success/5 border border-success/20 text-neutral-darkest"
                />
              ))}
            </div>
            {matchedSkills.length === 0 && (
              <p className="text-neutral italic">You don't have any of the required skills yet.</p>
            )}
          </CardContent>
        </Card>

      </div>

      {/* Missing Skills Section */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-neutral-darkest">Missing Skills</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {missingSkills.map(req => (
            <Card key={req.skillId} className="flex flex-col h-full hover:border-primary-light transition-colors">
              <CardContent className="p-5 flex-1 flex flex-col">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-bold text-neutral-darkest">{req.skill.name}</h3>
                  <Badge variant={req.importance === 'high' ? 'error' : req.importance === 'medium' ? 'warning' : 'default'}>
                    {req.importance === 'high' ? 'High Priority' : req.importance === 'medium' ? 'Med Priority' : 'Low Priority'}
                  </Badge>
                </div>
                
                <div className="text-sm font-medium text-neutral mb-3">
                  Difficulty: <span className="capitalize text-neutral-dark">{req.difficulty}</span>
                </div>
                
                <p className="text-neutral-dark mb-6 flex-1">
                  {req.explanation}
                </p>
                
                <Button variant="outline" className="w-full mt-auto">
                  Explore Skill &rarr;
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Recommended Path Section */}
      <Card>
        <CardHeader>
          <CardTitle>Recommended Learning Path</CardTitle>
          <p className="text-sm text-neutral mt-1">A suggested progression to close your skill gap efficiently.</p>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center max-w-md mx-auto py-4">
            {missingSkills.map((req, index) => (
              <React.Fragment key={req.skillId}>
                <div className="w-full bg-white border-2 border-primary-light/50 rounded-xl p-4 text-center shadow-sm relative">
                  <div className="absolute -left-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-xs font-bold">
                    {index + 1}
                  </div>
                  <h4 className="font-bold text-lg text-primary-dark">{req.skill.name}</h4>
                  <p className="text-sm text-neutral mt-1">Estimated difficulty: {req.difficulty}</p>
                </div>
                
                {index < missingSkills.length - 1 && (
                  <div className="py-2 text-primary-light">
                    <ArrowDown size={24} />
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>
        </CardContent>
      </Card>

    </div>
  );
};
