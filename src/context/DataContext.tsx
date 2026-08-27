import React, { createContext, useContext, useState, useEffect } from 'react';
import type { Skill, Job } from '../types';
import { fetchSkills, fetchUserSkills, fetchJobs, updateUserSkills, addCustomSkill } from '../api';

interface DataContextType {
  skills: Skill[];
  userSkills: string[];
  jobs: Job[];
  loading: boolean;
  toggleUserSkill: (skillId: string) => Promise<void>;
  addCustomUserSkill: (name: string) => Promise<void>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [userSkills, setUserSkills] = useState<string[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    try {
      const [fetchedSkills, fetchedUserSkills, fetchedJobs] = await Promise.all([
        fetchSkills(),
        fetchUserSkills(),
        fetchJobs(),
      ]);
      setSkills(fetchedSkills);
      setUserSkills(fetchedUserSkills);
      setJobs(fetchedJobs);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const toggleUserSkill = async (skillId: string) => {
    const updatedSkills = userSkills.includes(skillId)
      ? userSkills.filter(id => id !== skillId)
      : [...userSkills, skillId];
    
    setUserSkills(updatedSkills); // optimistic update
    await updateUserSkills(updatedSkills);
    // Reload jobs to recalculate match percentages via DB
    const fetchedJobs = await fetchJobs();
    setJobs(fetchedJobs);
  };

  const addCustomUserSkill = async (name: string) => {
    // Title Case the name
    const formattedName = name
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
      
    const newId = `custom_${Date.now()}`;
    await addCustomSkill({ id: newId, name: formattedName, category: 'tool' });
    
    // Add to local user skills and post
    const updatedSkills = [...userSkills, newId];
    setUserSkills(updatedSkills);
    await updateUserSkills(updatedSkills);
    
    // Refresh skills and jobs
    const [fetchedSkills, fetchedJobs] = await Promise.all([fetchSkills(), fetchJobs()]);
    setSkills(fetchedSkills);
    setJobs(fetchedJobs);
  };

  return (
    <DataContext.Provider value={{ skills, userSkills, jobs, loading, toggleUserSkill, addCustomUserSkill }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
