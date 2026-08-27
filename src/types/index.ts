export interface Skill {
  id: string;
  name: string;
  category: 'language' | 'framework' | 'tool' | 'concept' | 'database' | 'cloud';
}

export interface JobRequirement {
  skillId: string;
  importance: 'high' | 'medium' | 'low';
  difficulty: 'easy' | 'medium' | 'hard';
  explanation: string;
}

export interface Job {
  id: string;
  title: string;
  company: string;
  matchPercentage: number;
  description: string;
  requirements: JobRequirement[];
}

export interface SkillRelationship {
  sourceId: string;
  targetId: string;
  type: 'leads_to' | 'related' | 'requires';
}

export interface CareerGraphNode {
  id: string;
  label: string;
  type: 'skill_user' | 'skill_missing' | 'job' | 'technology' | 'project';
}

export interface CareerGraphEdge {
  id: string;
  source: string;
  target: string;
}
