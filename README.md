This is a proof of concept app for a client satisfaction survey tool that uses gpt-4o to transform the customer's answers into a polished, long form testimonial about their experience, and to iterate on edits with the LLM until satisfied and ready to share.

## Getting Started

1. Configure the survey form to meet your needs: edit public/questions.json
2. Create a .env file and add: NEXT_PUBLIC_OPENAI_API_KEY=your_openai_key (get an openai API key at platform.openai.com)
3. npm install && npm run dev

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.
