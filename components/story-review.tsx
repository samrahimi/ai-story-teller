import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import ReactMarkdown from 'react-markdown';
import {
  AlertCircle,
  CheckCircle2,
  Share2,
  Copy,
  ArrowLeft,
  MessageSquarePlus,
} from 'lucide-react';

const OPENAI_API_ENDPOINT = 'https://api.openai.com/v1/chat/completions';

const StoryReview = ({ formData, onBack, onApprove }) => {
  const [story, setStory] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isRevisionModalOpen, setIsRevisionModalOpen] = useState(false);
  const [revisionRequest, setRevisionRequest] = useState('');
  const [messages, setMessages] = useState([]);
  const [shareModalOpen, setShareModalOpen] = useState(false);

  // Initialize conversation with the AI
  const createInitialPrompt = (data) => {
    const prompt = `
    ## TASK

    Please write an inspirational and relatable story based on the user's responses regarding a challenge they faced in life and that they have since overcome. 
    
    Your tone should be honest and open yet not TOO raw because we want the user to be happy to share the story with others in their life, in order to give them the same hope and inspiration that they themselves found during their transformational journey. Pay it forward, if you will... 
    
    ## CONTEXT

    All of the users are graduates of the "Mindscape" program, an affordable, life changing set of workshops and seminars offered by Will Goodey. They are very excited to tell others about this opportunity for transformation - this app has been created by Mindscape staff and is offered as a tool for the user to help inspire others in their life who may be skeptical about the program and its benefits. 
    
    Therefore: while being subtle and not at all spammy or pushy, please capitalize on anything they may have said in their questionnaire about the program and how it changed their life - and always, as a postscript to the main story, add a call to action that tells the reader "You can overcome the challenges in YOUR life too - Go to https://Mindscape.edu/free-seminar to book a free introductory workshop". But adjust that text so it speaks to people facing the same challenges and of similar social / cultural persuasion as the one telling the story... That final paragraph should be in italics so its clear that the user did not write it - it was added by the story telling tool. 
    
    ## Formatting and Narrative Structure - Writing Style Guidelines
    Format the story in simple markdown, with an appropriate title as the main header and then perhaps a few subheaders along the way (but not too many) if you think it will keep things organized. The story should NOT  read like an interview transcript, but like an inspirational first person story of triumph over adversity - think John Krakauer meets Bill Wilson! The story should be told in a highly flowing, authentic style that is structured as a compelling narrative, not structured like the questionnaire - the only purpose of the questions is to help the user provide the key points of their story, not to structure the end result
    
    Always leave a blank line between paragraphs, and but keep the formatting minimal and clean.

    ## Edits
    The user may respond with requests for edits and revisions after you tell their story... please follow those instructions precisely - the user's choices should always have priority over the rest of your prompt EXCEPT when it comes to formatting - do not ever create messy formatted documents, HTML, or anything else other than clean and simple markdown / plaintext similar to how this prompt is written.
`;

    const userStoryDetails = `
Based on the following answers, craft a compelling story in the first person following the guidelines of your task. 

Please only include first name, last initial in your response unless the user has instructed you otherwise. 

Name: ${data.name}
${data.questionsAndAnswers
  .map(
    (qa) => `
Q: ${qa.question}
A: ${qa.answer}

`
  )
  .join('\n\n')}`;

    return [
      {
        role: 'system',
        content: prompt,
      },
      {
        role: 'user',
        content: userStoryDetails,
      },
    ];
  };

  // Generate the story using OpenAI's API
  const generateStory = async (messageArray) => {
    try {
      const response = await fetch(OPENAI_API_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + process.env.NEXT_PUBLIC_OPENAI_API_KEY,
        },
        body: JSON.stringify({
          model: 'gpt-4o',
          messages: messageArray,
          temperature: 0.9,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate story');
      }

      const data = await response.json();
      return data.choices[0].message.content;
    } catch (err) {
      throw new Error('Error generating story: ' + err.message);
    }
  };

  // Initial story generation
  useEffect(() => {
    const initialMessages = createInitialPrompt(formData);
    setMessages(initialMessages);

    generateStory(initialMessages)
      .then((generatedStory) => {
        setStory(generatedStory);
        setIsLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setIsLoading(false);
      });
  }, [formData]);

  // Handle revision request
  const handleRevisionRequest = async () => {
    setIsLoading(true);
    setIsRevisionModalOpen(false);

    const updatedMessages = [
      ...messages,
      { role: 'user', content: revisionRequest },
    ];

    try {
      const revisedStory = await generateStory(updatedMessages);
      setStory(revisedStory);
      setMessages(updatedMessages);
    } catch (err) {
      setError(err.message);
    }

    setIsLoading(false);
    setRevisionRequest('');
  };

  // Share functions
  const generateShareableLink = () => {
    const encodedStory = encodeURIComponent(story);
    return `https://www.facebook.com/sharer/sharer.php?u=https://landmarkforum.com&quote=Hamster`;
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(story);
    alert('Copied To Clipboard');
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <h3 className="text-lg text-foreground text-blue-100">
        ✍️ Crafting your story...
        </h3>

        <div className="text-foreground text-gray-100">⏱ Estimated wait time: 45 seconds</div>
      </div>
    );
  }

  
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <AlertCircle className="text-red-500 w-12 h-12" />
        <div className="text-lg text-red-500">{error}</div>
        <Button onClick={onBack}>Try Again</Button>
      </div>
    );
  }

  return (
    <div className="p-4 flex justify-center items-center min-h-screen bg-card">
      <Card>
        <CardContent className="mx-auto p-6 border-blue-100 h-screen">
          <div className="prose markdown-body">
            <ReactMarkdown>{story}</ReactMarkdown>
          </div>

          <div className="mt-8 space-y-4">
              <Button
                onClick={() => setShareModalOpen(true)}
                className="w-full"
              >
                <CheckCircle2 className="w-4 h-4" />
                &nbsp;Save & Publish
              </Button>

              <Button
                variant="outline"
                onClick={() => setIsRevisionModalOpen(true)}
                className="w-full"
              >
                <MessageSquarePlus className="w-4 h-4" />
                &nbsp;Edit Story
              </Button>

              <Button
                variant="outline"
                onClick={onBack}
                className="w-full"
              >
                <ArrowLeft className="w-4 h-4" />
                &nbsp;Start Over
              </Button>
          </div>
        </CardContent>
      </Card>

      {/* Revision Request Modal */}
      <Dialog open={isRevisionModalOpen} onOpenChange={setIsRevisionModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Request Changes</DialogTitle>
            <DialogDescription>
              Describe what you'd like to change about the story
            </DialogDescription>
          </DialogHeader>
          <Textarea
            value={revisionRequest}
            onChange={(e) => setRevisionRequest(e.target.value)}
            placeholder="Example: Could you make it more concise and emphasize the transformation more?"
            className="min-h-32"
          />
          <div className="flex justify-end gap-4">
            <Button
              variant="outline"
              onClick={() => setIsRevisionModalOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleRevisionRequest}>Submit Changes</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Share Modal */}
      <Dialog open={shareModalOpen} onOpenChange={setShareModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Publish Your Story</DialogTitle>
            <DialogDescription>
              Choose how you'd like to share your transformational journey
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <Button
              variant="outline"
              className="w-full"
              onClick={() => alert("Coming Soon...")}
            >
              <Share2 className="mr-2 h-4 w-4" />
              Share on Facebook
            </Button>
            <Button
              variant="outline"
              className="w-full"
              onClick={() => alert("Coming Soon...")}

                          >
              Share on WhatsApp
            </Button>
            <Button
              variant="outline"
              className="w-full text-white"
              onClick={() =>
                window.open(
                  `mailto:?body=${encodeURIComponent(story)}`,
                  '_blank'
                )
              }
            >
              Share via Email
            </Button>
            <Button
              variant="outline"
              className="w-full text-white"
              onClick={copyToClipboard}
            >
              <Copy className="mr-2 h-4 w-4" />
              Copy to Clipboard
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default StoryReview;
