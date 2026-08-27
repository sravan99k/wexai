import type { Skill, Job } from './types';

// When deployed to Vercel, the frontend and API are on the same domain
const API_URL = import.meta.env.PROD ? '/api' : 'http://localhost:3001/api';

export const fetchSkills = async (): Promise<Skill[]> => {
  const res = await fetch(`${API_URL}/skills`);
  return res.json();
};

export const fetchUserSkills = async (): Promise<string[]> => {
  const res = await fetch(`${API_URL}/user/skills`);
  return res.json();
};

export const fetchJobs = async (): Promise<Job[]> => {
  const res = await fetch(`${API_URL}/jobs`);
  return res.json();
};

export const updateUserSkills = async (skillIds: string[]): Promise<void> => {
  await fetch(`${API_URL}/user/skills`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ skillIds }),
  });
};

export const addCustomSkill = async (skill: { id: string, name: string, category?: string }): Promise<void> => {
  await fetch(`${API_URL}/skills`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(skill),
  });
};

export const fetchGraphData = async (): Promise<{ nodes: any[], edges: any[] }> => {
  const res = await fetch(`${API_URL}/graph`);
  return res.json();
};
