import React, { useState, useRef } from 'react';
import type { View } from '../types';
import Header from './ui/Header';
import Card from './ui/Card';
import Button from './ui/Button';
import { CameraIcon, UploadIcon } from './ui/icons';

interface SendGreetingScreenProps {
  navigate: (view: View) => void;
}

type ScreenStep = 'INITIAL' | 'PREVIEW' | 'SENDING' | 'CONFIRMATION';

const SendGreetingScreen: React.FC<SendGreetingScreenProps> = ({ navigate }) => {
  const [step, setStep] = useState<ScreenStep>('INITIAL');
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [message, setMessage] = useState('');
  const takePhotoRef = useRef<HTMLInputElement>(null);
  const chooseGalleryRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      setPhotoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
        setStep('PREVIEW');
      };
      reader.readAsDataURL(file);
    }
     // Reset the input value to allow re-selection of the same file
    if(event.target) {
        event.target.value = '';
    }
  };
  
  const handleSend = () => {
    if (!photoFile) return;
    setStep('SENDING');
    setTimeout(() => {
        console.log("Sending photo and message:", { photo: photoFile.name, message });
        setStep('CONFIRMATION');
    }, 1500);
  };
  
  const handleReset = () => {
    setPhotoFile(null);
    setPhotoPreview(null);
    setMessage('');
    setStep('INITIAL');
  };
  
  const onBack = () => {
    if (step === 'PREVIEW') {
        handleReset();
    } else {
        navigate('RESIDENT_HOME');
    }
  }

  const renderContent = () => {
    switch (step) {
      case 'INITIAL':
        return (
          <div className="text-center">
             <div className="flex justify-center mb-6">
                <div className="p-5 bg-brand-accent/10 rounded-full ring-8 ring-brand-accent/5">
                    <CameraIcon className="h-12 w-12 text-brand-accent" />
                </div>
            </div>
            <h2 className="text-3xl font-bold text-brand-text-primary font-serif">Send a Greeting</h2>
            <p className="text-lg text-brand-text-secondary mt-4">
              Share a smile by taking a new photo or choosing one from your device's gallery.
            </p>
             <div className="mt-12 max-w-sm mx-auto space-y-4">
                <Button onClick={() => takePhotoRef.current?.click()} icon={<CameraIcon className="h-6 w-6" />}>
                  Take a New Photo
                </Button>
                <input ref={takePhotoRef} type="file" accept="image/*" capture="user" onChange={handleFileChange} className="hidden" />

                <Button onClick={() => chooseGalleryRef.current?.click()} variant="secondary" icon={<UploadIcon className="h-6 w-6" />}>
                  Choose from Gallery
                </Button>
                <input ref={chooseGalleryRef} type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
             </div>
          </div>
        );
      case 'PREVIEW':
        return (
            <div>
                 <h2 className="text-3xl font-bold text-brand-text-primary font-serif text-center mb-6">Your Greeting</h2>
                {photoPreview && <img src={photoPreview} alt="Preview" className="w-full h-auto max-h-96 object-contain rounded-xl mb-6 bg-brand-background" />}
                 <div>
                  <label htmlFor="message" className="block text-sm font-semibold text-brand-text-secondary mb-2">Add a short message</label>
                  <textarea
                    id="message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    rows={3}
                    placeholder="e.g., Thinking of you!"
                    className="w-full p-3 text-base bg-brand-background border border-brand-secondary/40 rounded-xl focus:ring-2 focus:ring-brand-accent focus:border-brand-accent text-brand-text-primary placeholder:text-brand-text-secondary/60"
                  />
                </div>
                <div className="flex flex-col sm:flex-row gap-4 mt-8">
                    <Button onClick={handleReset} variant="secondary">Choose a different photo</Button>
                    <Button onClick={handleSend} variant="accent">Send Greeting</Button>
                </div>
            </div>
        );
       case 'SENDING':
        return (
             <div className="text-center p-12">
                <h2 className="text-3xl font-bold text-brand-text-primary font-serif">Sending...</h2>
                <p className="text-lg text-brand-text-secondary mt-4">Your greeting is on its way!</p>
             </div>
        )
      case 'CONFIRMATION':
        return (
            <div className="text-center p-8">
                <h2 className="text-4xl font-bold text-brand-text-primary font-serif">Sent!</h2>
                <p className="text-xl text-brand-text-secondary mt-4">Your photo greeting has been sent to your family.</p>
                <div className="mt-12 w-full max-w-xs mx-auto">
                    <Button onClick={() => navigate('RESIDENT_HOME')} variant="accent">Back to Home</Button>
                </div>
            </div>
        )
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-brand-background">
      <Header title="Send a Greeting" onBack={onBack} />
      <main className="flex-grow flex items-center justify-center w-full p-4 sm:p-8">
        <Card className="w-full max-w-lg">
          {renderContent()}
        </Card>
      </main>
    </div>
  );
};

export default SendGreetingScreen;