import React, { useMemo, useState } from 'react';
import type { Prompt, View } from '../types';
import { useLegacyData } from '../hooks/useLegacyData';
import Card from './ui/Card';
import Header from './ui/Header';
import Button from './ui/Button';
import { PlusIcon } from './ui/icons';

interface StaffManagePromptsProps {
  navigate: (view: View) => void;
}

const StaffManagePrompts: React.FC<StaffManagePromptsProps> = ({ navigate }) => {
  const { prompts, addPrompt } = useLegacyData();
  const [newQuestion, setNewQuestion] = useState('');
  const [newCategory, setNewCategory] = useState('');
  
  const groupedPrompts = useMemo(() => {
    return prompts.reduce((acc, prompt) => {
      (acc[prompt.category] = acc[prompt.category] || []).push(prompt);
      return acc;
    }, {} as Record<string, Prompt[]>);
  }, [prompts]);

  const handleAddPrompt = (e: React.FormEvent) => {
    e.preventDefault();
    if (newQuestion.trim() && newCategory.trim()) {
      addPrompt({
        question: newQuestion.trim(),
        category: newCategory.trim(),
      });
      setNewQuestion('');
      setNewCategory('');
    }
  };
  
  const inputBaseClasses = "w-full p-3 text-base bg-brand-background border border-brand-secondary/40 rounded-xl focus:ring-2 focus:ring-brand-accent focus:border-brand-accent text-brand-text-primary placeholder:text-brand-text-secondary/60";

  return (
    <div className="min-h-screen flex flex-col bg-brand-background">
      <Header title="Manage Prompts" onBack={() => navigate('STAFF_HOME')} />
      <main className="flex-grow w-full max-w-4xl mx-auto p-4 sm:p-8 space-y-8">
        <Card>
            <h2 className="text-3xl font-bold text-brand-text-primary font-serif mb-4">Add New Prompt</h2>
            <form onSubmit={handleAddPrompt} className="space-y-4">
                <div>
                    <label htmlFor="new-question" className="block text-sm font-semibold text-brand-text-secondary mb-2">Question</label>
                    <textarea 
                        id="new-question"
                        value={newQuestion}
                        onChange={(e) => setNewQuestion(e.target.value)}
                        placeholder="e.g., What's a piece of advice you'd give your younger self?"
                        className={inputBaseClasses}
                        rows={3}
                        required
                    />
                </div>
                <div>
                     <label htmlFor="new-category" className="block text-sm font-semibold text-brand-text-secondary mb-2">Category</label>
                     <input
                        type="text"
                        id="new-category"
                        value={newCategory}
                        onChange={(e) => setNewCategory(e.target.value)}
                        placeholder="e.g., Career & Life Lessons"
                        className={inputBaseClasses}
                        required
                     />
                </div>
                <div className="flex justify-end pt-2">
                    <Button type="submit" variant="accent" className="w-auto px-8" icon={<PlusIcon className="h-5 w-5" />}>
                        Add Prompt
                    </Button>
                </div>
            </form>
        </Card>

        <Card>
            <h2 className="text-3xl font-bold text-brand-text-primary font-serif mb-6">Existing Prompts</h2>
             <div className="space-y-2">
            {Object.entries(groupedPrompts).sort(([catA], [catB]) => catA.localeCompare(catB)).map(([category, promptList]) => (
              <details key={category} className="group" open>
                <summary className="p-4 list-none flex justify-between items-center cursor-pointer bg-brand-surface/50 hover:bg-brand-surface rounded-lg font-semibold text-brand-text-primary text-xl">
                  {category}
                  <div className="transition-transform duration-300 group-open:rotate-90">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
                  </div>
                </summary>
                <ul className="space-y-2 list-disc list-inside p-4 pl-10 bg-brand-surface/20 rounded-b-lg">
                  {promptList.map((prompt) => (
                    <li key={prompt.promptId} className="text-base text-brand-text-secondary">
                        {prompt.question}
                    </li>
                  ))}
                </ul>
              </details>
            ))}
          </div>
        </Card>
      </main>
    </div>
  );
};

export default StaffManagePrompts;