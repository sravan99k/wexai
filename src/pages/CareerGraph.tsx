import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { fetchGraphData } from '../api';

export const CareerGraph: React.FC = () => {
  const [nodes, setNodes] = useState<any[]>([]);
  const [edges, setEdges] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await fetchGraphData();
        setNodes(data.nodes);
        setEdges(data.edges);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  if (loading) return <div className="p-8 text-neutral-dark">Loading graph data...</div>;

  const jobNodes = nodes.filter(n => n.type === 'job');
  const skillNodes = nodes.filter(n => n.type === 'skill');

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-12">
      <div>
        <h1 className="text-3xl font-bold text-neutral-darkest">Explore Career Graph</h1>
        <p className="text-neutral mt-2 text-lg">Understand how foundational skills lead to advanced tools and job opportunities.</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Column 1: Core Skills & Concepts */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-neutral-darkest mb-6 pb-2 border-b-2 border-primary-light/30">
            1. Foundational Skills
          </h2>
          {skillNodes.map(skill => {
            const leadsToEdges = edges.filter(e => e.source === skill.id);
            if (leadsToEdges.length === 0) return null; // Only show if it leads to something
            
            return (
              <Card key={skill.id} className="border-l-4 border-l-primary/60 hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <h3 className="font-bold text-neutral-darkest">{skill.label}</h3>
                  <div className="mt-2 text-sm text-neutral-dark">
                    <span className="font-semibold">Leads to:</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {leadsToEdges.map(r => {
                        const target = nodes.find(s => s.id === r.target && s.type === 'skill');
                        return target ? <Badge key={target.id} variant="outline" className="text-xs">{target.label}</Badge> : null;
                      })}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Column 2: Advanced Tools & Frameworks */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-neutral-darkest mb-6 pb-2 border-b-2 border-accent-light/30">
            2. Tools & Frameworks
          </h2>
          {skillNodes.map(skill => (
            <Card key={skill.id} className="border-l-4 border-l-accent/60 hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <h3 className="font-bold text-neutral-darkest">{skill.label}</h3>
                <div className="mt-2 text-sm text-neutral-dark">
                  <span className="font-semibold">Required by:</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {edges.filter(e => e.target === skill.id).map(r => {
                      const target = nodes.find(s => s.id === r.source && s.type === 'job');
                      return target ? <Badge key={target.id} variant="outline" className="text-[10px] py-0">{target.label}</Badge> : null;
                    })}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Column 3: Job Roles */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-neutral-darkest mb-6 pb-2 border-b-2 border-success/30">
            3. Career Opportunities
          </h2>
          {jobNodes.map(job => (
            <Card key={job.id} className="border-l-4 border-l-success/60 bg-success/5 hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <h3 className="font-bold text-neutral-darkest">{job.label}</h3>
                <div className="mt-3">
                  <span className="text-xs font-semibold text-neutral-dark">Key Requirements:</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {edges.filter(e => e.source === job.id).slice(0, 5).map(req => {
                      const skill = nodes.find(s => s.id === req.target);
                      return skill ? <Badge key={skill.id} variant="default" className="text-[10px] py-0">{skill.label}</Badge> : null;
                    })}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

      </div>
    </div>
  );
};
