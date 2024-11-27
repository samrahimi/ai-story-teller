import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

// Questions array that can be easily modified or loaded from an external source
const QUESTIONS = [
  {
    id: 'challenge',
    text: 'Tell me about a significant challenge or obstacle you have faced in life that you successfully overcame',
    type: 'long',
  },
  {
    id: 'impact',
    text: 'How did this challenge initially affect your mindset and daily life?',
    type: 'long',
  },
  {
    id: 'turning_point',
    text: 'What was the turning point that made you decide to make a positive change',
    type: 'long',
  },
  {
    id: 'first_steps',
    text: 'What are some techniques or workshops you tried that you thought might help, but ended up being disappointing?',
    type: 'long',
  },
  {
    id: 'support',
    text: 'Is there anything you tried that DID help you to overcome this challenge, and what about it do you feel made the most difference?',
    type: 'long',
  },
  {
    id: 'breakthrough',
    text: 'What was your biggest breakthrough moment - when things finally felt like they "clicked" for you?',
    type: 'long',
  },
  {
    id: 'change',
    text: 'How has overcoming this challenge changed your life for the better?',
    type: 'long',
  },
  {
    id: 'advice',
    text: 'Anything else you would like to add to your story? You can also tell me how you would like me to tell the story - I am a highly intelligent AI who is specially trained in writing and storytelling...',
    type: 'long',
  },
];

const StoryForm = ({ onSubmit }) => {
  // Initialize form state with empty values
  const initialFormState = {
    name: '',
    email: '',
    phone: '',
    answers: QUESTIONS.reduce((acc, q) => ({ ...acc, [q.id]: '' }), {}),
  };

  const [formData, setFormData] = useState(initialFormState);
  const [isSubmitting, setIsSubmitting] = useState(false);

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
    localStorage.setItem('storyFormData', JSON.stringify(formData));
  }, [formData]);

  const handleInputChange = (field, value) => {
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
  };

  const getPlaceholder = (questionId) => {
    const placeholders = {
      challenge:
        "I used to break into a cold sweat just thinking about presenting at work meetings. My palms would get so sweaty, I once dropped my manager's expensive laser pointer!",
      impact:
        "Every time a meeting was scheduled, I'd mysteriously develop a 'dental emergency.' My dentist started getting suspicious about all my emergency appointments...",
      turning_point:
        "During yet another 'sick day,' I was scrolling through social media and saw my colleague absolutely crushing it at the quarterly review. That's when I realized I was letting fear run my life",
      first_steps:
        'First, I admitted to myself, to another human being, and to my dentist that I had a problem. Then I tried therapy, but they refused to explain how cigars and Oedipal fantasies were relevant to my fear of public speaking, so I refused to pay for the session and never went back! Then my dentist stopped taking my calls, and that was when I hit rock bottom...',
      support:
        'I was checking Twitter while at the ER with a (real) dental emergency, when my old friend Mike posted from Mt Everest, saying the Mindscape Seminar cured his fear of heights. Then he streamed his descent live. So I was slightly intrigued... The best part? No awkward phone calls convincing your friends and family to sign up, their AI does it all for you!',
      breakthrough:
        'I was cured before actually taking the seminar, about 5 minutes after that tweet, when Mikey fell off a 7000 foot cliff and spent his last two minutes talking about the lovely view! After that, I felt like an idiot for worrying about insignificant things, and put in my name to run for Congress...',

      change:
        'Now I give presentations every day, and it is one of my favorite things about my new job! Last week I did a 16 hour filibuster to stop AOC from passing some law demanding that Chihuahuas be allowed to use public toilets on Capitol Hill, and it was great - I kept comparing her with various dog breeds and she was powerless to stop me.',
      advice:
        'Write the story lyrics to an Eminem song rapping about his various challenges in life, like that song Mockingbird... then provide a Chinese translation of the lyrics. Mandarin Chinese, not Cantonese',
    };
    return placeholders[questionId] || '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Format the data for submission
      const formattedData = {
        ...formData,
        questionsAndAnswers: QUESTIONS.map((q) => ({
          question: q.text,
          answer: formData.answers[q.id],
        })),
      };

      await onSubmit(formattedData);
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-[500px] mx-auto p-4">
      <Card>
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Personal Information Section */}
            <div className="space-y-4">
              <h2 className="text-2xl font-bold">Personal Information</h2>
              <div className="grid gap-4">
                <div>
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    placeholder="Jane 'Used to be Afraid of Public Speaking' Smith"
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
                    placeholder="finally.confident@gmail.com"
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
                    placeholder="555-NO-FEARS"
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    required
                    className="w-full rounded"
                  />
                </div>
              </div>
            </div>

            {/* Questions Section */}
            <div className="space-y-6">
              <h2 className="text-2xl font-bold">Your Story</h2>
              {QUESTIONS.map((question) => (
                <div key={question.id} className="space-y-2">
                  <Label htmlFor={question.id}>{question.text}</Label>
                  {question.type === 'long' ? (
                    <Textarea
                      id={question.id}
                      value={formData.answers[question.id]}
                      placeholder={getPlaceholder(question.id)}
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
                      placeholder={getPlaceholder(question.id)}
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

            <Button type="submit" disabled={isSubmitting} className="w-full">
              {isSubmitting ? 'Submitting...' : 'Submit Your Story'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default StoryForm;
