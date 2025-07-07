import React, { useState, useRef } from 'react';
import type { View, Resident } from '../types/types';
import { useAuth } from '../hooks/useAuth';
import { useLegacyData } from '../hooks/useLegacyData';
import Header from './ui/Header';
import Card from './ui/Card';
import Button from './ui/Button';
import Avatar from './ui/Avatar';

interface SignUpScreenProps {
  navigate: (view: View) => void;
}

const SignUpScreen: React.FC<SignUpScreenProps> = ({ navigate }) => {
  const { login } = useAuth();
  const { addResident } = useLegacyData();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    familyContactName: '',
    familyContactEmail: '',
    familyContactPhone: '',
  });
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newResidentData: Omit<Resident, 'residentId' | 'isStaff'> = {
      ...formData,
      photoUrl: photoPreview,
    };
    const newResident = addResident(newResidentData);
    login(newResident); // Automatically log in the new user
  };

  const inputClasses = "w-full p-3 text-base bg-brand-background border border-brand-secondary/40 rounded-xl focus:ring-2 focus:ring-brand-accent focus:border-brand-accent text-brand-text-primary placeholder:text-brand-text-secondary/60";

  return (
    <div className="min-h-screen flex flex-col bg-brand-background">
      <Header title="Create Your Account" onBack={() => navigate('WELCOME')} />
      <main className="flex-grow w-full max-w-2xl mx-auto p-4 sm:p-8">
        <Card>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex flex-col items-center space-y-4">
              <Avatar name={formData.name || '?'} photoUrl={photoPreview} className="w-32 h-32" />
              <Button type="button" variant="secondary" className="w-auto px-6 py-2" onClick={() => fileInputRef.current?.click()}>
                {photoPreview ? 'Change Photo' : 'Upload Photo'}
              </Button>
              <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
            </div>

            <fieldset className="border-t border-brand-surface pt-6 space-y-4">
              <legend className="text-xl font-serif font-bold text-brand-text-primary mb-2">Your Details</legend>
              <div>
                <label htmlFor="name" className="block text-sm font-semibold text-brand-text-secondary mb-2">Full Name</label>
                <input type="text" name="name" id="name" value={formData.name} onChange={handleInputChange} className={inputClasses} required />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-brand-text-secondary mb-2">Email Address</label>
                <input type="email" name="email" id="email" value={formData.email} onChange={handleInputChange} className={inputClasses} required />
              </div>
            </fieldset>

            <fieldset className="border-t border-brand-surface pt-6 space-y-4">
              <legend className="text-xl font-serif font-bold text-brand-text-primary mb-2">Primary Family Contact</legend>
              <div>
                <label htmlFor="familyContactName" className="block text-sm font-semibold text-brand-text-secondary mb-2">Contact's Full Name</label>
                <input type="text" name="familyContactName" id="familyContactName" value={formData.familyContactName} onChange={handleInputChange} className={inputClasses} required />
              </div>
              <div>
                <label htmlFor="familyContactEmail" className="block text-sm font-semibold text-brand-text-secondary mb-2">Contact's Email</label>
                <input type="email" name="familyContactEmail" id="familyContactEmail" value={formData.familyContactEmail} onChange={handleInputChange} className={inputClasses} required />
              </div>
              <div>
                <label htmlFor="familyContactPhone" className="block text-sm font-semibold text-brand-text-secondary mb-2">Contact's Phone</label>
                <input type="tel" name="familyContactPhone" id="familyContactPhone" value={formData.familyContactPhone} onChange={handleInputChange} className={inputClasses} required />
              </div>
            </fieldset>
            
            <div className="pt-4">
              <Button type="submit" variant="accent" className="w-full py-4 text-lg">
                Create Account & Sign In
              </Button>
            </div>
          </form>
        </Card>
      </main>
    </div>
  );
};

export default SignUpScreen;