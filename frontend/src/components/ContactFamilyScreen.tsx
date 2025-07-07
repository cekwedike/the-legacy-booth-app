import React from 'react';
import type { View } from '../types';
import { useAuth } from '../hooks/useAuth';
import Header from './ui/Header';
import Card from './ui/Card';
import Avatar from './ui/Avatar';
import { PhoneIcon, EmailIcon } from './ui/icons';

interface ContactFamilyScreenProps {
  navigate: (view: View) => void;
}

const ContactFamilyScreen: React.FC<ContactFamilyScreenProps> = ({ navigate }) => {
  const { currentUser } = useAuth();

  if (!currentUser || currentUser.isStaff || !currentUser.familyContactName) {
    navigate('LOGIN');
    return null;
  }

  const { familyContactName, familyContactPhone, familyContactEmail } = currentUser;
  
  const buttonClasses = 'w-full inline-flex items-center justify-center text-center text-lg font-semibold py-4 px-5 rounded-xl transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-brand-background no-underline';
  const primaryButtonClasses = 'bg-brand-primary text-white hover:brightness-110 focus:ring-brand-primary';
  const secondaryButtonClasses = 'bg-transparent text-brand-text-secondary border border-brand-secondary hover:bg-brand-secondary/10 hover:text-brand-text-primary focus:ring-brand-secondary';


  return (
    <div className="min-h-screen flex flex-col bg-brand-background">
      <Header title="Contact Your Family" onBack={() => navigate('RESIDENT_HOME')} />
      <main className="flex-grow flex items-center justify-center w-full p-4 sm:p-8">
        <Card className="max-w-md w-full text-center">
          <div className="flex justify-center">
            <Avatar
              name={familyContactName}
              photoUrl={null} // Family contacts don't have stored photos
              className="w-32 h-32 ring-4 ring-brand-surface mx-auto mb-6"
            />
          </div>
          <h2 className="text-3xl font-bold text-brand-text-primary font-serif">{familyContactName}</h2>
          <p className="text-lg text-brand-text-secondary mt-2">Your designated family contact.</p>

          <div className="text-left mt-8 space-y-4">
             {familyContactPhone && (
                <div className="bg-brand-background/50 p-4 rounded-lg">
                    <p className="text-sm font-semibold text-brand-text-secondary">Phone Number</p>
                    <p className="text-xl text-brand-text-primary font-mono">{familyContactPhone}</p>
                </div>
             )}
              {familyContactEmail && (
                <div className="bg-brand-background/50 p-4 rounded-lg">
                    <p className="text-sm font-semibold text-brand-text-secondary">Email Address</p>
                    <p className="text-xl text-brand-text-primary break-all">{familyContactEmail}</p>
                </div>
              )}
          </div>
          
          <div className="mt-10 space-y-4">
             {familyContactPhone && (
                 <a href={`tel:${familyContactPhone}`} className={`${buttonClasses} ${primaryButtonClasses}`}>
                    <PhoneIcon className="h-6 w-6 mr-3" /> Call on Phone
                 </a>
             )}
              {familyContactEmail && (
                 <a href={`mailto:${familyContactEmail}`} className={`${buttonClasses} ${secondaryButtonClasses}`}>
                    <EmailIcon className="h-6 w-6 mr-3" /> Send an Email
                 </a>
              )}
          </div>
        </Card>
      </main>
    </div>
  );
};

export default ContactFamilyScreen;