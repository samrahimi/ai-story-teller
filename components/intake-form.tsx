import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { config } from 'process';

// Type definitions for our configuration
interface Question {
  id: string;
  text: string;
  type: string;
  placeholder: string;
}

interface StoryConfig {
  title: string,
  subtitle: string,
  questions: Question[];
}

const StoryForm = ({ 
  apiKey, 
  apiUrl = '/api/story-config', 
  onSubmit 
}: { 
  apiKey: string; 
  apiUrl?: string;
  onSubmit: (formData: any) => Promise<void>; 
}) => {
  // State for questions and form data
  const [questions, setQuestions] = useState<Question[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [banner_url, setBannerUrl] = useState("");

  const [error, setError] = useState<string | null>(null);

  // Initialize form state dynamically based on questions
  const [formData, setFormData] = useState<{
    name: string;
    email: string;
    phone: string;
    answers: Record<string, string>;
  }>({
    name: '',
    email: '',
    phone: '',
    answers: {},
  });

  // Fetch story configuration from API
  useEffect(() => {
    const fetchStoryConfig = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(apiUrl, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch story configuration');
        }

        const config: StoryConfig = await response.json();
        setQuestions(config.questions);
        setTitle(config.title)
        setSubtitle(config.subtitle)
        setBannerUrl(config.banner_url)
        // Initialize answers based on fetched questions
        const initialAnswers = config.questions.reduce((acc, q) => ({
          ...acc,
          [q.id]: ''
        }), {});

        setFormData(prev => ({
          ...prev,
          answers: initialAnswers
        }));

        setIsLoading(false);
      } catch (err) {
        console.error('Error fetching story config:', err);
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
        setIsLoading(false);
      }
    };

    fetchStoryConfig();
  }, [apiKey, apiUrl]);

  // Load saved form data from localStorage on component mount
  useEffect(() => {
    const savedData = localStorage.getItem('storyFormData');
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        setFormData(parsed);
      } catch (error) {
        console.error('Error parsing saved form data:', error);
      }
    }
  }, []);

  // Save form data to localStorage whenever it changes
  useEffect(() => {
    //localStorage.setItem('storyFormData', JSON.stringify(formData));
  }, [formData]);

  const handleInputChange = (field: string, value: string) => {
    if (field.startsWith('answers.')) {
      const questionId = field.split('.')[1];
      setFormData((prev) => ({
        ...prev,
        answers: {
          ...prev.answers,
          [questionId]: value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [field]: value,
      }));
    }


    localStorage.setItem('storyFormData', JSON.stringify(formData));

  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Format the data for submission
      const formattedData = {
        ...formData,
        questionsAndAnswers: questions.map((q) => ({
          question: q.text,
          answer: formData.answers[q.id],
        })),
      };

      await onSubmit(formattedData);
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  // Render loading state
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p>Loading story configuration...</p>
      </div>
    );
  }

  // Render error state
  if (error) {
    return (
      <div className="flex justify-center items-center h-screen text-red-500">
        <p>Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="p-4 mt-4 flex justify-center items-center h-screen">
      <Card>
        <CardContent className="mx-auto">
          <img src={banner_url} />

          <h1 className="">{title}</h1>
          <p className="mb-5 font-semibold">{subtitle}</p>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Personal Information Section */}
            <div className="space-y-4">
              <h2 className="text-2xl font-bold">ABOUT YOU...</h2>
              <div className="grid gap-4">
                <div>
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    placeholder="Your Name"
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    required
                    className="rounded"
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    placeholder="your.email@example.com"
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    required
                    className="w-full rounded"
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    placeholder="555-123-4567"
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    required
                    className="w-full rounded"
                  />
                </div>
              </div>
            </div>

            {/* Questions Section */}
            <div className="space-y-6">
              <h2 className="text-2xl font-bold">ABOUT YOUR JOURNEY</h2>
              {questions.map((question) => (
                <div key={question.id} className="space-y-2">
                  <Label htmlFor={question.id}>{question.text}</Label>
                  {question.type === 'long' ? (
                    <Textarea
                      id={question.id}
                      value={formData.answers[question.id]}
                      placeholder={question.placeholder}
                      onChange={(e) =>
                        handleInputChange(
                          `answers.${question.id}`,
                          e.target.value
                        )
                      }
                      required
                      className="min-h-64 rounded"
                    />
                  ) : (
                    <Input
                      id={question.id}
                      value={formData.answers[question.id]}
                      placeholder={question.placeholder}
                      onChange={(e) =>
                        handleInputChange(
                          `answers.${question.id}`,
                          e.target.value
                        )
                      }
                      required
                      className="rounded"
                    />
                  )}
                </div>
              ))}
            </div>

            <Button type="submit" className="w-full">
              Create With MindBot...
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default StoryForm;