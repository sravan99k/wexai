import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Card, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { SearchInput } from '../components/ui/SearchInput';
import { SkillBadge } from '../components/shared/SkillBadge';
import { useData } from '../context/DataContext';

export const SkillAssessment: React.FC = () => {
  const navigate = useNavigate();
  const { skills, userSkills, toggleUserSkill, addCustomUserSkill, loading } = useData();
  const [searchQuery, setSearchQuery] = useState('');
  const [localUserSkills, setLocalUserSkills] = useState<string[]>([]);

  useEffect(() => {
    if (!loading) setLocalUserSkills(userSkills);
  }, [loading, userSkills]);

  const [customSkills, setCustomSkills] = useState<{id: string, name: string}[]>([]);

  const allSkills = [...skills, ...customSkills];

  const filteredSkills = allSkills.filter(skill => 
    skill.name.toLowerCase().includes(searchQuery.toLowerCase()) && 
    !localUserSkills.includes(skill.id)
  );

  const selectedSkills = allSkills.filter(skill => localUserSkills.includes(skill.id));

  const toggleSkill = async (id: string) => {
    setLocalUserSkills(prev => prev.includes(id) ? prev.filter(sId => sId !== id) : [...prev, id]);
    await toggleUserSkill(id);
  };

  const handleAddCustomSkill = async () => {
    if (!searchQuery.trim()) return;
    const formatted = searchQuery.trim().split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ');
    const newId = `custom_${Date.now()}`;
    setCustomSkills(prev => [...prev, { id: newId, name: formatted }]);
    setLocalUserSkills(prev => [...prev, newId]);
    await addCustomUserSkill(searchQuery.trim());
    setSearchQuery('');
  };

  const handleContinue = () => {
    // Navigate to Jobs as the new flow suggests
    navigate('/jobs');
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in duration-500 pt-4">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-neutral-darkest">What skills do you have?</h1>
        <p className="text-neutral mt-3 text-lg">Add the technologies, tools, and concepts you're comfortable working with.</p>
      </div>

      <Card>
        <CardContent className="p-6 md:p-8 space-y-8">
          <div>
            <SearchInput
              value={searchQuery}
              onChange={setSearchQuery}
              onClear={() => setSearchQuery('')}
              placeholder="Search or add a skill..."
              className="max-w-md mx-auto"
            />
          </div>

          <div>
            <h3 className="text-sm font-semibold text-neutral uppercase tracking-wider mb-4">Popular Skills</h3>
            <div className="flex flex-wrap gap-2">
              {searchQuery && filteredSkills.length === 0 && !allSkills.some(s => s.name.toLowerCase() === searchQuery.trim().toLowerCase()) && (
                <div className="flex flex-col items-center justify-center w-full py-4 space-y-3">
                  <div className="text-neutral text-sm">No skills found matching "{searchQuery}"</div>
                  <Button variant="outline" size="sm" onClick={handleAddCustomSkill}>
                    + Add "{searchQuery}" as a new skill
                  </Button>
                </div>
              )}
              {filteredSkills.slice(0, 15).map(skill => (
                <button
                  key={skill.id}
                  onClick={() => toggleSkill(skill.id)}
                  className="px-3 py-1.5 rounded-full border border-neutral-light hover:border-primary hover:text-primary transition-colors text-sm font-medium text-neutral-dark bg-white"
                >
                  + {skill.name}
                </button>
              ))}
            </div>
          </div>

          <div className="pt-6 border-t border-neutral-light">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-neutral uppercase tracking-wider">Your Skills</h3>
              <span className="text-sm text-neutral font-medium">{selectedSkills.length} selected</span>
            </div>
            
            {selectedSkills.length === 0 ? (
              <div className="text-center py-8 text-neutral bg-neutral-lightest rounded-lg border border-dashed border-neutral-light">
                No skills selected yet. Select from above.
              </div>
            ) : (
              <div className="flex flex-wrap gap-2">
                {selectedSkills.map(skill => (
                  <SkillBadge
                    key={skill.id}
                    name={skill.name}
                    onRemove={() => toggleSkill(skill.id)}
                  />
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end pt-4">
        <Button size="lg" onClick={handleContinue} className="gap-2">
          Continue <ArrowRight size={18} />
        </Button>
      </div>
    </div>
  );
};
