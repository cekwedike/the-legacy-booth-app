import React from 'react';
import type { Resident, View } from '../types/types';
import { useAuth } from '../hooks/useAuth';
import { useLegacyData } from '../hooks/useLegacyData';
import Avatar from './ui/Avatar';
import Button from './ui/Button';

interface LoginScreenProps {
  navigate: (view: View) => void;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ navigate }) => {
  const { login } = useAuth();
  const { residents } = useLegacyData();

  const handleSelectUser = (user: Resident) => {
    login(user);
  };

  const userList = residents.filter(r => !r.isStaff);
  const staffList = residents.filter(r => r.isStaff);

  const UserGrid: React.FC<{users: Resident[]}> = ({ users }) => (
     <div className="grid grid-cols-2 md:grid-cols-3 gap-6 sm:gap-10">
        {users.map((resident) => (
          <button
            key={resident.residentId}
            onClick={() => handleSelectUser(resident)}
            className="text-center group focus:outline-none"
          >
            <div className="bg-brand-surface p-4 sm:p-6 rounded-3xl group-hover:shadow-[0_0_25px_rgba(229,122,68,0.2)] group-focus:shadow-[0_0_25px_rgba(229,122,68,0.2)] group-hover:-translate-y-2 transform transition-all duration-300 ease-in-out">
                <div className="flex flex-col items-center">
                <Avatar
                    name={resident.name}
                    photoUrl={resident.photoUrl}
                    className="w-32 h-32 sm:w-40 sm:h-40 ring-4 ring-brand-surface group-hover:ring-brand-accent transition-all duration-300"
                />
                <p className="mt-4 text-xl sm:text-2xl font-semibold text-brand-text-primary">{resident.name}</p>
                </div>
            </div>
          </button>
        ))}
      </div>
  );


  return (
    <div className="min-h-screen bg-brand-background flex flex-col items-center justify-center p-4 sm:p-8">
      <div className="text-center mb-10 sm:mb-12">
        <h1 className="text-5xl sm:text-7xl font-bold text-brand-text-primary font-serif">Sign In</h1>
        <p className="text-xl sm:text-2xl text-brand-text-secondary mt-4">Please select your profile to begin.</p>
      </div>
      
      {userList.length > 0 && <UserGrid users={userList} />}

      {staffList.length > 0 && (
          <div className="mt-12 w-full max-w-5xl">
              <div className="relative my-4">
                <div className="absolute inset-0 flex items-center" aria-hidden="true">
                    <div className="w-full border-t border-brand-surface/80" />
                </div>
                <div className="relative flex justify-center">
                    <span className="bg-brand-background px-4 text-lg font-medium text-brand-text-secondary">Staff</span>
                </div>
            </div>
            <div className="flex justify-center">
                <UserGrid users={staffList} />
            </div>
          </div>
      )}

      <div className="mt-16 text-center">
         <p className="text-lg text-brand-text-secondary">
            Don't see your profile?{' '}
            <button onClick={() => navigate('SIGN_UP')} className="font-semibold text-brand-accent hover:underline focus:outline-none">
                Create an account
            </button>
        </p>
         <div className="mt-6 w-full max-w-xs mx-auto">
             <Button onClick={() => navigate('WELCOME')} variant='secondary'>Back to Welcome</Button>
         </div>
      </div>
    </div>
  );
};

export default LoginScreen;