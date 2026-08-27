import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { driver } from './db.js';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// 1. Healthcheck and Connection Test
app.get('/api/health', async (req, res) => {
  res.json({ status: 'ok' });
});

// 2. Get All Skills
app.get('/api/skills', async (req, res) => {
  const session = driver.session();
  try {
    const result = await session.run(`MATCH (s:Skill) RETURN s.id AS id, s.name AS name, s.category AS category ORDER BY s.name`);
    const skills = result.records.map((record: any) => ({
      id: record.get('id'),
      name: record.get('name'),
      category: record.get('category'),
    }));
    res.json(skills);
  } catch (error) {
    console.error('Error fetching skills:', error);
    res.status(500).json({ error: 'Failed to fetch skills' });
  } finally {
    await session.close();
  }
});

// 2b. Add a Custom Skill
app.post('/api/skills', async (req, res) => {
  const { id, name, category } = req.body;
  const session = driver.session();
  try {
    await session.run(`
      MERGE (s:Skill {name: $name})
      ON CREATE SET s.id = $id, s.category = $category
      RETURN s
    `, { id, name, category: category || 'tool' });
    res.json({ success: true, id, name });
  } catch (error) {
    console.error('Error adding skill:', error);
    res.status(500).json({ error: 'Failed to add custom skill' });
  } finally {
    await session.close();
  }
});

// 3. Get User's Skills
app.get('/api/user/skills', async (req, res) => {
  const session = driver.session();
  try {
    const result = await session.run(`
      MATCH (u:User {id: 'u1'})-[:HAS_SKILL]->(s:Skill)
      RETURN s.id AS id
    `);
    const skillIds = result.records.map((record: any) => record.get('id'));
    res.json(skillIds);
  } catch (error) {
    console.error('Error fetching user skills:', error);
    res.status(500).json({ error: 'Failed to fetch user skills' });
  } finally {
    await session.close();
  }
});

// 4. Get Jobs and calculate Match Score (Multi-Hop Query Optimized)
app.get('/api/jobs', async (req, res) => {
  const session = driver.session();
  try {
    const result = await session.run(`
      MATCH (j:Job)-[r:REQUIRES]->(s:Skill)
      OPTIONAL MATCH (u:User {id: 'u1'})-[:HAS_SKILL]->(s)
      WITH j, count(r) AS totalRequired, count(u) AS matchedSkills, collect({
        skillId: s.id, importance: r.importance, difficulty: r.difficulty, explanation: r.explanation
      }) AS requirements
      RETURN j, totalRequired, matchedSkills, toInteger((toFloat(matchedSkills) / totalRequired) * 100) AS matchPercentage, requirements
      ORDER BY matchPercentage DESC
    `);
    
    const jobs = result.records.map((record: any) => {
      const jobNode = record.get('j').properties;
      const matchPercentage = record.get('matchPercentage').toNumber();
      const requirements = record.get('requirements');

      return {
        ...jobNode,
        matchPercentage,
        requirements
      };
    });
    
    res.json(jobs);
  } catch (error) {
    console.error('Error fetching jobs:', error);
    res.status(500).json({ error: 'Failed to fetch jobs' });
  } finally {
    await session.close();
  }
});

// 4b. Genuine 2+ Hop Traversal: Skill Bridge
app.get('/api/jobs/:id/bridge', async (req, res) => {
  const jobId = req.params.id;
  const session = driver.session();
  try {
    const result = await session.run(`
      MATCH (u:User {id: 'u1'})-[:HAS_SKILL]->(current:Skill)
      MATCH (current)-[:LEADS_TO*1..2]->(related:Skill)
      MATCH (job:Job {id: $jobId})-[:REQUIRES]->(related)
      WHERE NOT (u)-[:HAS_SKILL]->(related)
      RETURN DISTINCT current.name AS currentSkill, related.name AS recommendedSkill, job.title AS targetJob
    `, { jobId });
    
    const bridges = result.records.map((record: any) => ({
      currentSkill: record.get('currentSkill'),
      recommendedSkill: record.get('recommendedSkill'),
      targetJob: record.get('targetJob')
    }));
    
    res.json(bridges);
  } catch (error) {
    console.error('Error fetching job bridge:', error);
    res.status(500).json({ error: 'Failed to fetch job bridge' });
  } finally {
    await session.close();
  }
});

app.post('/api/user/skills', async (req, res) => {
  const { skillIds } = req.body;
  const session = driver.session();
  try {
    await session.run(`MATCH (u:User {id: 'u1'})-[r:HAS_SKILL]->() DELETE r`);
    
    if (skillIds && skillIds.length > 0) {
      await session.run(`
        UNWIND $skillIds AS skillId
        MATCH (u:User {id: 'u1'})
        MATCH (s:Skill {id: skillId})
        CREATE (u)-[:HAS_SKILL]->(s)
      `, { skillIds });
    }
    res.json({ success: true });
  } catch (error) {
    console.error('Error updating user skills:', error);
    res.status(500).json({ error: 'Failed to update user skills' });
  } finally {
    await session.close();
  }
});

// 5. Get Graph Data (Including User)
app.get('/api/graph', async (req, res) => {
  const session = driver.session();
  try {
    const nodeResult = await session.run(`
      MATCH (n) 
      WHERE n:Job OR n:Skill OR n:User
      RETURN id(n) AS id, labels(n)[0] AS type, n.name AS name, n.title AS title
    `);
    
    const nodes = nodeResult.records.map((r: any) => {
      const type = r.get('type').toLowerCase();
      return {
        id: r.get('id').toString(),
        label: r.get('name') || r.get('title'),
        type: type === 'user' ? 'user' : type === 'job' ? 'job' : 'skill'
      };
    });

    const edgeResult = await session.run(`
      MATCH (n)-[r]->(m)
      RETURN id(n) AS source, id(m) AS target
    `);

    const edges = edgeResult.records.map((r: any) => ({
      source: r.get('source').toString(),
      target: r.get('target').toString()
    }));

    res.json({ nodes, edges });
  } catch (error) {
    console.error('Error fetching graph data:', error);
    res.status(500).json({ error: 'Failed to fetch graph data' });
  } finally {
    await session.close();
  }
});

export default app;
