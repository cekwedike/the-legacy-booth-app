import React from 'react';
import type { Recording, View } from '../types/types';
import { useAuth } from '../hooks/useAuth';
import { useLegacyData } from '../hooks/useLegacyData';
import Button from './ui/Button';
import Card from './ui/Card';
import Header from './ui/Header';
import { LogoutIcon, ManageIcon } from './ui/icons';

interface StaffHomeProps {
  navigate: (view: View, context?: any) => void;
}

const StatusBadge: React.FC<{ status: string }> = ({ status }) => {
    const colorClasses = {
        'Pending': 'bg-amber-900/50 text-amber-200 border-amber-500/50',
        'In Progress': 'bg-blue-900/50 text-blue-200 border-blue-500/50',
        'Complete': 'bg-green-900/50 text-green-200 border-green-500/50',
    };
    return (
        <span className={`px-3 py-1 text-sm font-medium rounded-full border ${colorClasses[status] || 'bg-gray-700 text-gray-200'}`}>
            {status}
        </span>
    );
}

const StaffHome: React.FC<StaffHomeProps> = ({ navigate }) => {
  const { logout } = useAuth();
  const { recordings, getResidentById } = useLegacyData();

  const handleSelectRecording = (recording: Recording) => {
    navigate('STAFF_RECORDING_DETAIL', { recordingId: recording.recordingId });
  };
  
  return (
    <div className="min-h-screen flex flex-col bg-brand-background">
      <Header title="Staff Dashboard">
        <button onClick={logout} className="flex items-center font-semibold text-base text-brand-text-secondary hover:text-brand-text-primary transition-colors" aria-label="Logout">
          <LogoutIcon className="h-6 w-6 mr-2" />
           <span className="hidden sm:inline">Logout</span>
        </button>
      </Header>
      <main className="flex-grow w-full max-w-7xl mx-auto p-4 sm:p-8 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <button onClick={() => navigate('STAFF_MANAGE_PROMPTS')} className="w-full text-left focus:outline-none group">
                <Card className="h-full text-center transition-all duration-300 ease-in-out group-hover:shadow-[0_0_20px_rgba(229,122,68,0.15)] group-hover:-translate-y-1 group-hover:ring-1 group-hover:ring-brand-accent/30 group-focus:ring-1 group-focus:ring-brand-accent">
                     <div className="flex-shrink-0 text-brand-accent mb-4 inline-flex">
                        <ManageIcon className="h-10 w-10" />
                    </div>
                    <h2 className="text-2xl font-bold font-serif text-brand-text-primary">Manage Prompts</h2>
                    <p className="text-base text-brand-text-secondary mt-1">Add, edit, and categorize story prompts.</p>
                </Card>
            </button>
             <div className="md:col-span-2">
                <Card className="h-full">
                  <h3 className="text-2xl font-bold font-serif text-brand-text-primary">At a Glance</h3>
                   <div className="mt-4 grid grid-cols-3 gap-4 text-center">
                      <div>
                        <p className="text-5xl font-bold text-brand-accent">{recordings.length}</p>
                        <p className="text-base text-brand-text-secondary mt-1">Total Recordings</p>
                      </div>
                       <div>
                        <p className="text-5xl font-bold text-brand-accent">{recordings.filter(r => r.transcriptionStatus === 'Pending').length}</p>
                        <p className="text-base text-brand-text-secondary mt-1">Pending Review</p>
                      </div>
                      <div>
                        <p className="text-5xl font-bold text-brand-accent">{recordings.filter(r => r.transcriptionStatus === 'Complete').length}</p>
                        <p className="text-base text-brand-text-secondary mt-1">Completed</p>
                      </div>
                   </div>
                </Card>
            </div>
        </div>

        <Card>
          <h2 className="text-3xl font-bold text-brand-text-primary font-serif mb-6">Submitted Recordings</h2>
          <div className="overflow-x-auto -mx-8 sm:-mx-8 px-8 sm:px-8">
            <table className="w-full text-left table-auto">
              <thead className="border-b border-brand-surface/50">
                <tr>
                  <th className="p-4 text-sm font-semibold text-brand-text-secondary uppercase tracking-wider">Resident</th>
                  <th className="p-4 text-sm font-semibold text-brand-text-secondary uppercase tracking-wider">Type</th>
                  <th className="p-4 text-sm font-semibold text-brand-text-secondary uppercase tracking-wider">Date</th>
                  <th className="p-4 text-sm font-semibold text-brand-text-secondary uppercase tracking-wider text-center">Status</th>
                  <th className="p-4"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-surface/50">
                {recordings.length > 0 ? recordings.map((rec) => {
                  const resident = getResidentById(rec.residentId);
                  return (
                    <tr key={rec.recordingId} className="hover:bg-brand-surface/60 transition-colors">
                      <td className="p-4 text-base font-medium text-brand-text-primary whitespace-nowrap">{resident?.name}</td>
                      <td className="p-4 text-base text-brand-text-secondary">{rec.recordingType}</td>
                      <td className="p-4 text-base text-brand-text-secondary whitespace-nowrap">{rec.timestamp.toLocaleDateString()}</td>
                      <td className="p-4 text-center"><StatusBadge status={rec.transcriptionStatus} /></td>
                      <td className="p-4 text-right">
                          <Button variant="secondary" onClick={() => handleSelectRecording(rec)} className="py-2 px-4 text-sm w-auto">
                              View Details
                          </Button>
                      </td>
                    </tr>
                  );
                }) : (
                    <tr>
                        <td colSpan={5} className="p-8 text-center text-xl text-brand-text-secondary">No recordings found.</td>
                    </tr>
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </main>
    </div>
  );
};

export default StaffHome;