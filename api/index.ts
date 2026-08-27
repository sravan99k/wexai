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
    const skills = result.records.map(record => ({
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
    const skillIds = result.records.map(record => record.get('id'));
    res.json(skillIds);
  } catch (error) {
    console.error('Error fetching user skills:', error);
    res.status(500).json({ error: 'Failed to fetch user skills' });
  } finally {
    await session.close();
  }
});

// 4. Get Jobs and calculate Match Score (Multi-Hop Query)
app.get('/api/jobs', async (req, res) => {
  const session = driver.session();
  try {
    const result = await session.run(`
      MATCH (j:Job)-[r:REQUIRES]->(s:Skill)
      OPTIONAL MATCH (u:User {id: 'u1'})-[:HAS_SKILL]->(s)
      WITH j, count(r) AS totalRequired, count(u) AS matchedSkills
      RETURN j, totalRequired, matchedSkills, toInteger((toFloat(matchedSkills) / totalRequired) * 100) AS matchPercentage
      ORDER BY matchPercentage DESC
    `);
    
    const jobs = [];
    for (const record of result.records) {
      const jobNode = record.get('j').properties;
      const matchPercentage = record.get('matchPercentage').toNumber();
      
      const reqResult = await session.run(`
        MATCH (j:Job {id: $jobId})-[r:REQUIRES]->(s:Skill)
        RETURN s.id AS skillId, r.importance AS importance, r.difficulty AS difficulty, r.explanation AS explanation
      `, { jobId: jobNode.id });
      
      const requirements = reqResult.records.map(r => ({
        skillId: r.get('skillId'),
        importance: r.get('importance'),
        difficulty: r.get('difficulty'),
        explanation: r.get('explanation')
      }));

      jobs.push({
        ...jobNode,
        matchPercentage,
        requirements
      });
    }
    
    res.json(jobs);
  } catch (error) {
    console.error('Error fetching jobs:', error);
    res.status(500).json({ error: 'Failed to fetch jobs' });
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

// 5. Get Graph Data
app.get('/api/graph', async (req, res) => {
  const session = driver.session();
  try {
    const nodeResult = await session.run(`
      MATCH (n) 
      WHERE n:Job OR n:Skill
      RETURN id(n) AS id, labels(n)[0] AS type, n.name AS name, n.title AS title
    `);
    
    const nodes = nodeResult.records.map(r => ({
      id: r.get('id').toString(),
      label: r.get('name') || r.get('title'),
      type: r.get('type') === 'Job' ? 'job' : 'skill'
    }));

    const edgeResult = await session.run(`
      MATCH (n)-[r]->(m)
      WHERE type(r) <> 'HAS_SKILL'
      RETURN id(n) AS source, id(m) AS target
    `);

    const edges = edgeResult.records.map(r => ({
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
