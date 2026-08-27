import { driver } from '../api/db.js';
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
  { id: 's20', name: 'C++', category: 'language' },
  { id: 's21', name: 'Deep Learning', category: 'concept' },
  { id: 's22', name: 'Pandas', category: 'tool' },
  { id: 's23', name: 'NoSQL', category: 'language' },
  { id: 's24', name: 'Terraform', category: 'tool' }
];

const jobs = [
  {
    id: 'j1', title: 'Full Stack Engineer', company: 'TechNova', description: 'Build scalable web applications across the full stack.',
    requirements: [
      { skillId: 's1', importance: 'high', difficulty: 'medium', explanation: 'Essential for web development.' },
      { skillId: 's2', importance: 'high', difficulty: 'medium', explanation: 'Provides type safety.' },
      { skillId: 's3', importance: 'high', difficulty: 'medium', explanation: 'Core library.' },
      { skillId: 's4', importance: 'high', difficulty: 'medium', explanation: 'Backend runtime.' },
      { skillId: 's7', importance: 'medium', difficulty: 'medium', explanation: 'Database management.' }
    ]
  },
  {
    id: 'j2', title: 'Backend Engineer', company: 'DataFlow', description: 'Design robust backend services and APIs.',
    requirements: [
      { skillId: 's2', importance: 'high', difficulty: 'medium', explanation: 'Typed backend code.' },
      { skillId: 's4', importance: 'high', difficulty: 'medium', explanation: 'Primary backend runtime.' },
      { skillId: 's7', importance: 'high', difficulty: 'medium', explanation: 'Core data storage.' },
      { skillId: 's12', importance: 'high', difficulty: 'hard', explanation: 'Crucial for scalable architectures.' },
      { skillId: 's13', importance: 'medium', difficulty: 'hard', explanation: 'High performance microservices.' }
    ]
  },
  {
    id: 'j3', title: 'Frontend Engineer', company: 'PixelPerfect', description: 'Create engaging and responsive user interfaces.',
    requirements: [
      { skillId: 's1', importance: 'high', difficulty: 'medium', explanation: 'Core language.' },
      { skillId: 's2', importance: 'medium', difficulty: 'medium', explanation: 'Used for components.' },
      { skillId: 's3', importance: 'high', difficulty: 'medium', explanation: 'Primary UI framework.' },
      { skillId: 's18', importance: 'medium', difficulty: 'medium', explanation: 'Alternative UI framework.' }
    ]
  },
  {
    id: 'j4', title: 'AI Engineer', company: 'NeuroSys', description: 'Develop machine learning models and integrate them into production.',
    requirements: [
      { skillId: 's5', importance: 'high', difficulty: 'easy', explanation: 'Primary language for ML.' },
      { skillId: 's11', importance: 'high', difficulty: 'hard', explanation: 'Core ML concepts.' },
      { skillId: 's21', importance: 'high', difficulty: 'hard', explanation: 'Neural networks.' },
      { skillId: 's20', importance: 'medium', difficulty: 'hard', explanation: 'Performance optimization.' }
    ]
  },
  {
    id: 'j5', title: 'Data Scientist', company: 'QuantMetrics', description: 'Extract insights from massive datasets.',
    requirements: [
      { skillId: 's5', importance: 'high', difficulty: 'easy', explanation: 'Data analysis language.' },
      { skillId: 's7', importance: 'high', difficulty: 'medium', explanation: 'Data querying.' },
      { skillId: 's22', importance: 'high', difficulty: 'medium', explanation: 'Data manipulation.' },
      { skillId: 's11', importance: 'medium', difficulty: 'hard', explanation: 'Predictive modeling.' }
    ]
  },
  {
    id: 'j6', title: 'DevOps Engineer', company: 'CloudOps', description: 'Automate and streamline the deployment processes.',
    requirements: [
      { skillId: 's8', importance: 'high', difficulty: 'medium', explanation: 'Containerization.' },
      { skillId: 's15', importance: 'high', difficulty: 'hard', explanation: 'Orchestration.' },
      { skillId: 's9', importance: 'high', difficulty: 'hard', explanation: 'Cloud infrastructure.' },
      { skillId: 's16', importance: 'high', difficulty: 'medium', explanation: 'Deployment pipelines.' },
      { skillId: 's24', importance: 'high', difficulty: 'medium', explanation: 'Infrastructure as code.' }
    ]
  },
  {
    id: 'j7', title: 'Cloud Engineer', company: 'SkyScale', description: 'Build and maintain highly available cloud infrastructures.',
    requirements: [
      { skillId: 's9', importance: 'high', difficulty: 'hard', explanation: 'Primary cloud provider.' },
      { skillId: 's8', importance: 'medium', difficulty: 'medium', explanation: 'App isolation.' },
      { skillId: 's24', importance: 'high', difficulty: 'medium', explanation: 'Infrastructure as code.' },
      { skillId: 's5', importance: 'low', difficulty: 'easy', explanation: 'Scripting.' }
    ]
  },
  {
    id: 'j8', title: 'Product Engineer', company: 'LaunchPad', description: 'End-to-end product development focusing on user experience and business logic.',
    requirements: [
      { skillId: 's1', importance: 'high', difficulty: 'medium', explanation: 'Web fundamentals.' },
      { skillId: 's3', importance: 'high', difficulty: 'medium', explanation: 'Frontend.' },
      { skillId: 's4', importance: 'medium', difficulty: 'medium', explanation: 'Backend API.' },
      { skillId: 's23', importance: 'medium', difficulty: 'medium', explanation: 'Flexible data modeling.' }
    ]
  },
  {
    id: 'j9', title: 'Software Engineer', company: 'GlobalTech', description: 'Generalist software engineering across various systems.',
    requirements: [
      { skillId: 's5', importance: 'high', difficulty: 'medium', explanation: 'General programming.' },
      { skillId: 's7', importance: 'high', difficulty: 'medium', explanation: 'Data access.' },
      { skillId: 's10', importance: 'high', difficulty: 'easy', explanation: 'Source control.' },
      { skillId: 's12', importance: 'medium', difficulty: 'hard', explanation: 'Architecture.' }
    ]
  },
  {
    id: 'j10', title: 'ML Engineer', company: 'DeepScale', description: 'Deploy and scale machine learning models into production environments.',
    requirements: [
      { skillId: 's5', importance: 'high', difficulty: 'medium', explanation: 'Model scripts.' },
      { skillId: 's11', importance: 'high', difficulty: 'hard', explanation: 'ML algorithms.' },
      { skillId: 's8', importance: 'high', difficulty: 'medium', explanation: 'Model containerization.' },
      { skillId: 's15', importance: 'medium', difficulty: 'hard', explanation: 'Scaling models.' },
      { skillId: 's9', importance: 'high', difficulty: 'hard', explanation: 'Cloud ML services.' }
    ]
  }
];

const relationships = [
  { sourceId: 's1', targetId: 's2', type: 'leads_to' },
  { sourceId: 's1', targetId: 's3', type: 'leads_to' },
  { sourceId: 's1', targetId: 's4', type: 'leads_to' },
  { sourceId: 's5', targetId: 's11', type: 'leads_to' },
  { sourceId: 's5', targetId: 's22', type: 'leads_to' },
  { sourceId: 's11', targetId: 's21', type: 'leads_to' },
  { sourceId: 's7', targetId: 's6', type: 'leads_to' },
  { sourceId: 's8', targetId: 's15', type: 'leads_to' },
  { sourceId: 's10', targetId: 's16', type: 'leads_to' },
  { sourceId: 's9', targetId: 's24', type: 'leads_to' }
];

async function seed() {
  const session = driver.session();
  try {
    console.log('Starting database seed with 10 jobs...');
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
    // Seed user with JS to trigger the JavaScript -> TypeScript -> Job bridge path perfectly
    const initialUserSkills = ['s1', 's4', 's10']; 
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
  }
}

seed();
