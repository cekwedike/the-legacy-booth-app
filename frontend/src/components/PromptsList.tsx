import React, { useMemo, useState } from 'react';
import type { Prompt, View } from '../types/types';
import { RecordingType } from '../types/types';
import { useLegacyData } from '../hooks/useLegacyData';
import Card from './ui/Card';
import Header from './ui/Header';
import Button from './ui/Button';
import { GoogleGenAI } from "@google/genai";
import { BackIcon, PencilIcon } from './ui/icons';

interface PromptsListProps {
  navigate: (view: View, context?: any) => void;
}

const PromptsList: React.FC<PromptsListProps> = ({ navigate }) => {
  const { prompts, addPrompt } = useLegacyData();
  const [newPrompts, setNewPrompts] = useState<Prompt[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isAskingCustom, setIsAskingCustom] = useState(false);
  const [customQuestion, setCustomQuestion] = useState('');
  const [customCategory, setCustomCategory] = useState('');

  const allPrompts = useMemo(() => [...prompts, ...newPrompts], [prompts, newPrompts]);

  const groupedPrompts = useMemo(() => {
    return allPrompts.reduce((acc, prompt) => {
      (acc[prompt.category] = acc[prompt.category] || []).push(prompt);
      return acc;
    }, {} as Record<string, Prompt[]>);
  }, [allPrompts]);

  const categories = useMemo(() => Object.keys(groupedPrompts), [groupedPrompts]);

  const handleSelectPrompt = (prompt: Prompt) => {
    navigate('RECORDING', { recordingType: RecordingType.LifeStory, prompt: prompt });
  };
  
  const handleCustomPromptSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (customQuestion.trim().length < 5 || customCategory.trim().length === 0) return;

    const newPromptData = {
      question: customQuestion.trim(),
      category: customCategory.trim(),
    };
    
    addPrompt(newPromptData);
    
    const promptForRecording: Prompt = {
        ...newPromptData,
        promptId: `CUSTOM-${Date.now()}`,
    };
    
    navigate('RECORDING', { recordingType: RecordingType.LifeStory, prompt: promptForRecording });

    setCustomQuestion('');
    setCustomCategory('');
    setIsAskingCustom(false);
  };

  const generateNewPrompt = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const prompt = "You are a creative assistant for a life story project in an assisted living facility. Generate one, and only one, thought-provoking and gentle question to ask a senior resident about their life. The question should be suitable for a category like 'Childhood & Youth', 'Career & Life Lessons', or 'Family & Relationships'. Do not include the category name. Do not wrap the question in quotes.";
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-preview-04-17',
        contents: prompt,
      });

      const newQuestion = response.text;
      if(newQuestion) {
        const newPrompt: Prompt = {
          promptId: `AI-${Date.now()}`,
          category: 'Fresh Ideas',
          question: newQuestion,
        };
        setNewPrompts(prev => [...prev, newPrompt]);
        setSelectedCategory('Fresh Ideas');
      }
    } catch (error) {
      console.error("Error generating prompt:", error);
      setError("Could not generate a new prompt. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const renderCustomQuestionInput = () => (
    <div className="w-full max-w-2xl mx-auto">
        <Card>
            <h2 className="text-3xl font-bold text-brand-text-primary font-serif text-center mb-2">Your Question, Your Story</h2>
            <p className="text-lg text-brand-text-secondary mt-2 text-center mb-8">Type your question and give it a category. You can use an existing category or create a new one.</p>
            <form onSubmit={handleCustomPromptSubmit} className="space-y-6">
                <div>
                  <label htmlFor="custom-question" className="block text-sm font-semibold text-brand-text-secondary mb-2">Your Question or Topic</label>
                  <textarea
                      id="custom-question"
                      value={customQuestion}
                      onChange={(e) => setCustomQuestion(e.target.value)}
                      placeholder="For example: Tell me about the day I was born..."
                      className="w-full p-4 text-lg bg-brand-background border border-brand-secondary/40 rounded-xl focus:ring-2 focus:ring-brand-accent focus:border-brand-accent text-brand-text-primary placeholder:text-brand-text-secondary/60"
                      rows={4}
                      required
                  />
                </div>
                <div>
                   <label htmlFor="custom-category" className="block text-sm font-semibold text-brand-text-secondary mb-2">Category</label>
                   <input
                      id="custom-category"
                      type="text"
                      list="category-suggestions"
                      value={customCategory}
                      onChange={(e) => setCustomCategory(e.target.value)}
                      placeholder="For example: Family & Relationships"
                      className="w-full p-4 text-lg bg-brand-background border border-brand-secondary/40 rounded-xl focus:ring-2 focus:ring-brand-accent focus:border-brand-accent text-brand-text-primary placeholder:text-brand-text-secondary/60"
                      required
                   />
                   <datalist id="category-suggestions">
                      {categories.map(cat => <option key={cat} value={cat} />)}
                   </datalist>
                </div>
                <div className="pt-2">
                    <Button 
                        type="submit"
                        disabled={customQuestion.trim().length < 5 || customCategory.trim().length === 0}
                        variant="accent"
                    >
                        Save and Start Recording
                    </Button>
                </div>
            </form>
        </Card>
    </div>
  );

  const renderCategorySelection = () => (
    <div className="w-full max-w-4xl mx-auto">
        <div className="text-center mb-10">
            <h1 className="text-4xl font-bold text-brand-text-primary font-serif">Choose a Topic</h1>
            <p className="text-xl text-brand-text-secondary mt-2">What kind of story do you want to tell?</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <button onClick={() => setIsAskingCustom(true)} className="w-full text-left focus:outline-none group md:col-span-2">
                 <div className="bg-brand-accent/10 rounded-xl p-6 h-full text-center transition-all duration-300 ease-in-out group-hover:shadow-[0_0_15px_rgba(229,122,68,0.2)] group-hover:-translate-y-1 group-hover:ring-1 group-hover:ring-brand-accent/40 group-focus:ring-1 group-focus:ring-brand-accent">
                    <div className="flex items-center justify-center gap-4">
                        <PencilIcon className="h-7 w-7 text-brand-accent"/>
                        <h2 className="text-2xl font-bold font-serif text-brand-accent transition-colors">Ask Your Own Question</h2>
                    </div>
                 </div>
            </button>
            {categories.map(category => (
                <button key={category} onClick={() => setSelectedCategory(category)} className="w-full text-left focus:outline-none group">
                     <div className="bg-brand-surface rounded-xl p-6 h-full text-center transition-all duration-300 ease-in-out group-hover:shadow-[0_0_15px_rgba(229,122,68,0.1)] group-hover:-translate-y-1 group-hover:ring-1 group-hover:ring-brand-accent/20 group-focus:ring-1 group-focus:ring-brand-accent">
                        <h2 className="text-2xl font-bold font-serif text-brand-text-primary group-hover:text-brand-accent transition-colors">{category}</h2>
                     </div>
                </button>
            ))}
        </div>
         <div className="mt-12 border-t border-brand-surface/80 pt-10 text-center">
            <p className="text-lg text-brand-text-secondary mb-4">Feeling spontaneous?</p>
            <div className="max-w-sm mx-auto">
              <Button onClick={generateNewPrompt} disabled={isLoading} variant="secondary">
                {isLoading ? 'Thinking...' : 'Suggest a New Prompt'}
              </Button>
              {error && <p className="text-red-400 text-sm mt-3">{error}</p>}
            </div>
          </div>
    </div>
  );

  const renderPromptsList = () => {
      if (!selectedCategory) return null;
      const promptsForCategory = groupedPrompts[selectedCategory] || [];
      return (
           <div className="w-full max-w-3xl mx-auto">
             <div className="relative flex items-center justify-center mb-8">
                <button onClick={() => setSelectedCategory(null)} className="absolute left-0 top-1/2 -translate-y-1/2 flex items-center text-base font-semibold text-brand-text-secondary hover:text-brand-text-primary transition-colors">
                    <BackIcon className="h-5 w-5 mr-2"/>
                    <span className="hidden sm:inline">All Topics</span>
                </button>
                <h2 className="text-3xl font-bold font-serif text-brand-text-primary text-center">{selectedCategory}</h2>
             </div>
              <ul className="space-y-4">
                {promptsForCategory.map((prompt) => (
                  <li key={prompt.promptId}>
                    <button
                      onClick={() => handleSelectPrompt(prompt)}
                      className="w-full text-left focus:outline-none group"
                    >
                      <div className="bg-brand-surface p-5 rounded-xl group-hover:bg-brand-surface/50 group-hover:ring-1 group-hover:ring-brand-accent/50 transition-all duration-200 cursor-pointer group-focus:ring-1 group-focus:ring-brand-accent">
                        <p className="text-lg text-brand-text-primary">{prompt.question}</p>
                      </div>
                    </button>
                  </li>
                ))}
              </ul>
           </div>
      );
  }

  const handleBack = () => {
    if (isAskingCustom) {
      setIsAskingCustom(false);
      setCustomQuestion('');
    } else if (selectedCategory) {
      setSelectedCategory(null);
    } else {
      navigate('RESIDENT_HOME');
    }
  };

  const mainContent = () => {
    if (isAskingCustom) return renderCustomQuestionInput();
    if (selectedCategory) return renderPromptsList();
    return renderCategorySelection();
  }

  return (
    <div className="min-h-screen flex flex-col bg-brand-background">
      <Header title="Tell Your Story" onBack={handleBack} />
      <main className="flex-grow flex items-center justify-center w-full p-4 sm:p-8">
        {mainContent()}
      </main>
    </div>
  );
};

export default PromptsList;
