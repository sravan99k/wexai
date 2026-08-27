import type { Skill, Job, SkillRelationship } from '../types';

export const mockSkills: Skill[] = [
  { id: 's1', name: 'JavaScript', category: 'language' },
  { id: 's2', name: 'TypeScript', category: 'language' },
  { id: 's3', name: 'React', category: 'framework' },
  { id: 's4', name: 'Node.js', category: 'framework' },
  { id: 's5', name: 'Python', category: 'language' },
  { id: 's6', name: 'SQL', category: 'language' },
  { id: 's7', name: 'PostgreSQL', category: 'database' },
  { id: 's8', name: 'Docker', category: 'tool' },
  { id: 's9', name: 'AWS', category: 'cloud' },
  { id: 's10', name: 'Git', category: 'tool' },
  { id: 's11', name: 'Machine Learning', category: 'concept' },
  { id: 's12', name: 'System Design', category: 'concept' },
  { id: 's13', name: 'Go', category: 'language' },
  { id: 's14', name: 'Rust', category: 'language' },
  { id: 's15', name: 'Kubernetes', category: 'tool' },
  { id: 's16', name: 'CI/CD', category: 'concept' },
  { id: 's17', name: 'GraphQL', category: 'tool' },
  { id: 's18', name: 'Vue.js', category: 'framework' },
  { id: 's19', name: 'Angular', category: 'framework' },
];

export const userSkills = ['s1', 's3', 's4', 's10']; // JS, React, Node, Git

export const mockJobs: Job[] = [
  {
    id: 'j1',
    title: 'Full Stack Engineer',
    company: 'TechNova',
    matchPercentage: 72,
    description: 'Build and maintain scalable web applications across the full stack. You will work on both frontend interfaces and backend APIs, ensuring high performance and reliability.',
    requirements: [
      { skillId: 's3', importance: 'high', difficulty: 'medium', explanation: 'Core library for building user interfaces.' },
      { skillId: 's4', importance: 'high', difficulty: 'medium', explanation: 'Runtime for backend services.' },
      { skillId: 's1', importance: 'high', difficulty: 'medium', explanation: 'Essential for web development.' },
      { skillId: 's2', importance: 'high', difficulty: 'medium', explanation: 'Provides type safety across the stack.' },
      { skillId: 's7', importance: 'medium', difficulty: 'medium', explanation: 'Primary relational database.' },
      { skillId: 's8', importance: 'high', difficulty: 'hard', explanation: 'Used to package and deploy applications consistently.' },
      { skillId: 's9', importance: 'medium', difficulty: 'hard', explanation: 'Cloud infrastructure provider.' },
    ],
  },
  {
    id: 'j2',
    title: 'Backend Engineer',
    company: 'DataFlow',
    matchPercentage: 55,
    description: 'Design and implement robust backend services and APIs. Focus on data modeling, performance optimization, and infrastructure.',
    requirements: [
      { skillId: 's4', importance: 'high', difficulty: 'medium', explanation: 'Primary backend runtime.' },
      { skillId: 's2', importance: 'high', difficulty: 'medium', explanation: 'For typed backend code.' },
      { skillId: 's7', importance: 'high', difficulty: 'medium', explanation: 'Core data storage.' },
      { skillId: 's8', importance: 'high', difficulty: 'hard', explanation: 'Containerization is required for deployments.' },
      { skillId: 's9', importance: 'high', difficulty: 'hard', explanation: 'Extensive use of AWS services.' },
      { skillId: 's12', importance: 'high', difficulty: 'hard', explanation: 'Architecting scalable systems.' },
    ],
  },
  {
    id: 'j3',
    title: 'Frontend Engineer',
    company: 'PixelPerfect',
    matchPercentage: 85,
    description: 'Create engaging and responsive user interfaces. Work closely with designers to bring concepts to life.',
    requirements: [
      { skillId: 's1', importance: 'high', difficulty: 'medium', explanation: 'Core language.' },
      { skillId: 's3', importance: 'high', difficulty: 'medium', explanation: 'Primary UI framework.' },
      { skillId: 's2', importance: 'medium', difficulty: 'medium', explanation: 'Increasingly used for newer components.' },
      { skillId: 's10', importance: 'high', difficulty: 'easy', explanation: 'Version control.' },
    ],
  },
  {
    id: 'j4',
    title: 'AI Engineer',
    company: 'NeuroSys',
    matchPercentage: 20,
    description: 'Develop machine learning models and integrate them into production systems.',
    requirements: [
      { skillId: 's5', importance: 'high', difficulty: 'easy', explanation: 'Primary language for ML.' },
      { skillId: 's11', importance: 'high', difficulty: 'hard', explanation: 'Core ML concepts and algorithms.' },
      { skillId: 's6', importance: 'medium', difficulty: 'medium', explanation: 'Data extraction.' },
      { skillId: 's8', importance: 'medium', difficulty: 'hard', explanation: 'Model deployment.' },
    ],
  },
];

export const mockRelationships: SkillRelationship[] = [
  { sourceId: 's1', targetId: 's2', type: 'leads_to' }, // JS -> TS
  { sourceId: 's1', targetId: 's3', type: 'leads_to' }, // JS -> React
  { sourceId: 's4', targetId: 's8', type: 'leads_to' }, // Node -> Docker
  { sourceId: 's7', targetId: 's6', type: 'requires' }, // Postgres requires SQL
  { sourceId: 's8', targetId: 's9', type: 'related' },  // Docker related AWS
  { sourceId: 's5', targetId: 's11', type: 'leads_to' }, // Python -> ML
];
