# AI ENGINEERS 16
Arabic RTL multi-agent project builder.

## Run
1. Install Node.js 18+
2. `npm install`
3. Copy `.env.example` to `.env`, then add your OpenAI API key.
4. `npm start` and visit http://localhost:3000

The AI generation uses a single model call instructed to coordinate 16 expert roles; this is not 16 independent models. API usage may cost money. Automatic public deployment is not enabled in this starter; generated output needs secure review and deployment configuration. Never expose API keys in browser code.
