import { driver } from '../api/db';
import dotenv from 'dotenv';
dotenv.config();

const skills = [
  { id: 's1', name: 'JavaScript', category: 'language' },
  { id: 's2', name: 'TypeScript', category: 'language' },
  { id: 's3', name: 'React', category: 'framework' },
  { id: 's4', name: 'Node.js', category: 'framework' },
  { id: 's5', name: 'Python', category: 'language' },
  { id: 's6', name: 'Data Extraction', category: 'concept' },
  { id: 's7', name: 'SQL', category: 'language' },
  { id: 's8', name: 'Docker', category: 'tool' },
  { id: 's9', name: 'AWS', category: 'tool' },
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

const jobs = [
  {
    id: 'j1', title: 'Full Stack Engineer', company: 'TechNova', description: 'Build and maintain scalable web applications across the full stack. You will work on both frontend interfaces and backend APIs, ensuring high performance and reliability.',
    requirements: [
      { skillId: 's1', importance: 'high', difficulty: 'medium', explanation: 'Essential for web development.' },
      { skillId: 's2', importance: 'high', difficulty: 'medium', explanation: 'Provides type safety across the stack.' },
      { skillId: 's3', importance: 'high', difficulty: 'medium', explanation: 'Core library for building user interfaces.' },
      { skillId: 's4', importance: 'high', difficulty: 'medium', explanation: 'Runtime for backend services.' },
      { skillId: 's7', importance: 'medium', difficulty: 'medium', explanation: 'Database management.' },
      { skillId: 's10', importance: 'high', difficulty: 'easy', explanation: 'Version control.' }
    ]
  },
  {
    id: 'j2', title: 'Backend Engineer', company: 'DataFlow', description: 'Design and implement robust backend services and APIs. Focus on data modeling, performance optimization, and infrastructure.',
    requirements: [
      { skillId: 's2', importance: 'high', difficulty: 'medium', explanation: 'For typed backend code.' },
      { skillId: 's4', importance: 'high', difficulty: 'medium', explanation: 'Primary backend runtime.' },
      { skillId: 's7', importance: 'high', difficulty: 'medium', explanation: 'Core data storage.' },
      { skillId: 's8', importance: 'high', difficulty: 'hard', explanation: 'Containerization is required for deployments.' },
      { skillId: 's12', importance: 'high', difficulty: 'hard', explanation: 'Crucial for scalable architectures.' },
      { skillId: 's15', importance: 'medium', difficulty: 'hard', explanation: 'Container orchestration.' }
    ]
  },
  {
    id: 'j3', title: 'Frontend Engineer', company: 'PixelPerfect', description: 'Create engaging and responsive user interfaces. Work closely with designers to bring concepts to life.',
    requirements: [
      { skillId: 's1', importance: 'high', difficulty: 'medium', explanation: 'Core language.' },
      { skillId: 's2', importance: 'medium', difficulty: 'medium', explanation: 'Increasingly used for newer components.' },
      { skillId: 's3', importance: 'high', difficulty: 'medium', explanation: 'Primary UI framework.' },
      { skillId: 's10', importance: 'high', difficulty: 'easy', explanation: 'Version control.' },
      { skillId: 's17', importance: 'medium', difficulty: 'medium', explanation: 'Data fetching mechanism.' }
    ]
  },
  {
    id: 'j4', title: 'AI Engineer', company: 'NeuroSys', description: 'Develop machine learning models and integrate them into production systems.',
    requirements: [
      { skillId: 's5', importance: 'high', difficulty: 'easy', explanation: 'Primary language for ML.' },
      { skillId: 's6', importance: 'medium', difficulty: 'medium', explanation: 'Data extraction.' },
      { skillId: 's8', importance: 'medium', difficulty: 'hard', explanation: 'Model deployment.' },
      { skillId: 's11', importance: 'high', difficulty: 'hard', explanation: 'Core ML concepts and algorithms.' },
      { skillId: 's9', importance: 'medium', difficulty: 'hard', explanation: 'Cloud infrastructure for ML.' }
    ]
  }
];

const relationships = [
  { sourceId: 's1', targetId: 's2', type: 'leads_to' },
  { sourceId: 's1', targetId: 's3', type: 'leads_to' },
  { sourceId: 's1', targetId: 's4', type: 'leads_to' },
  { sourceId: 's5', targetId: 's11', type: 'leads_to' },
  { sourceId: 's7', targetId: 's6', type: 'leads_to' },
  { sourceId: 's8', targetId: 's15', type: 'leads_to' },
  { sourceId: 's10', targetId: 's16', type: 'leads_to' }
];

async function seed() {
  const session = driver.session();
  try {
    console.log('Starting database seed...');
    await session.run('MATCH (n) DETACH DELETE n');

    console.log('Inserting Skills...');
    for (const skill of skills) {
      await session.run(`CREATE (s:Skill {id: $id, name: $name, category: $category})`, skill);
    }

    console.log('Inserting Jobs and Requirements...');
    for (const job of jobs) {
      const { id, title, company, description, requirements } = job;
      await session.run(`CREATE (j:Job {id: $id, title: $title, company: $company, description: $description})`, { id, title, company, description });
      for (const req of requirements) {
        await session.run(`
          MATCH (j:Job {id: $jobId})
          MATCH (s:Skill {id: $skillId})
          CREATE (j)-[:REQUIRES {importance: $importance, difficulty: $difficulty, explanation: $explanation}]->(s)
        `, { jobId: id, ...req });
      }
    }

    console.log('Inserting Skill Relationships...');
    for (const rel of relationships) {
      await session.run(`
        MATCH (source:Skill {id: $sourceId})
        MATCH (target:Skill {id: $targetId})
        CREATE (source)-[:LEADS_TO]->(target)
      `, rel);
    }

    console.log('Inserting User Data...');
    await session.run(`CREATE (u:User {id: 'u1', name: 'Test User'})`);
    const initialUserSkills = ['s1', 's3', 's4', 's10'];
    for (const skillId of initialUserSkills) {
      await session.run(`
        MATCH (u:User {id: 'u1'})
        MATCH (s:Skill {id: $skillId})
        CREATE (u)-[:HAS_SKILL]->(s)
      `, { skillId });
    }

    console.log('✅ Seed completed successfully!');
  } catch (error) {
    console.error('Error seeding data:', error);
  } finally {
    await session.close();
    await driver.close();
  }
}

seed();
