'use client';

import { useState, useEffect } from 'react';
import StoryForm from '@/components/intake-form';
import StoryReview from '@/components/story-review';

export default function Home() {
  const [currentStep, setCurrentStep] = useState('form');
  const [formData, setFormData] = useState(null);

  const handleFormSubmit = async (data) => {
    setFormData(data);
    setCurrentStep('review');
  };

  const handleBack = () => {
    setCurrentStep('form');
  };

  return (
    <main className="min-h-screen  text-blue-100 p-4 bg-card">
      {currentStep === 'form' ? (
        <StoryForm           apiKey="hamster"
        apiUrl="/questions.json"
        onSubmit={handleFormSubmit} />
      ) : (
        <StoryReview
          formData={formData}
          onBack={handleBack}
          onApprove={() => alert('TODO')}
        />
      )}
    </main>
  );
}
