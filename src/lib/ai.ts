import { getProfileSummary } from './profile';

const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions';

// Server-side only: dynamic import cheerio to avoid client bundle inclusion
async function fetchAndParseHtml(url: string): Promise<string> {
  const response = await fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      'Accept-Language': 'en-US,en;q=0.5',
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch URL: ${response.status} ${response.statusText}`);
  }

  const html = await response.text();

  // Dynamically import cheerio (server-side only)
  const { load } = await import('cheerio');
  const $ = load(html);

  // Remove script, style, nav, footer, header, aside elements
  $('script, style, nav, footer, header, aside, noscript, iframe, svg').remove();

  // Get text content from main content areas
  const selectors = [
    'main',
    '[role="main"]',
    '.job-description',
    '.job-details',
    '.description',
    '.content',
    '#job-description',
    '#job-details',
    '.posting-content',
    '.job-posting',
    'article',
    '.main-content',
  ];

  let text = '';
  for (const selector of selectors) {
    const element = $(selector).first();
    if (element.length && element.text().trim().length > 200) {
      text = element.text().trim();
      break;
    }
  }

  // Fallback: get body text
  if (!text) {
    text = $('body').text().trim();
  }

  // Clean up whitespace
  return text
    .replace(/\s+/g, ' ')
    .replace(/\n+/g, '\n')
    .trim()
    .slice(0, 15000); // Limit to prevent token overflow
}

async function callAI(systemPrompt: string, userPrompt: string): Promise<string> {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    throw new Error('OPENROUTER_API_KEY is not set. Get a free key from https://openrouter.ai');
  }

  const response = await fetch(OPENROUTER_API_URL, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': 'http://localhost:3000',
      'X-Title': 'Job Application Tracker',
    },
    body: JSON.stringify({
      model: process.env.AI_MODEL || 'deepseek/deepseek-r1-0528:free',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      temperature: 0.7,
      max_tokens: 4000,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`OpenRouter API error: ${response.status} - ${error}`);
  }

  const data = await response.json();
  return data.choices?.[0]?.message?.content || 'No response generated.';
}

export async function generateFormAnswers(
  questions: string,
  jobDescription: string,
  companyName: string,
  companyBackground: string,
  jobTitle: string,
  requiredTechnologies: string
): Promise<Array<{ question: string; answer: string }>> {
  const profileSummary = getProfileSummary();

  const systemPrompt = `You are Thaveesha Sonnadara, a fresh Software Engineering graduate from Sri Lanka. You are writing answers for a job application form. You must write as if YOU are Thaveesha — first person, natural voice.

CRITICAL RULES FOR WRITING STYLE:
- Write like a real person, NOT like AI. Use contractions (I've, I'm, didn't, wasn't)
- Vary your sentence length. Mix short punchy sentences with longer descriptive ones
- Include specific details from your ACTUAL experience (MarketPushApps, Room ODD, ViprWatch, etc.)
- Be conversational but professional. Imagine you're speaking to a friendly interviewer
- Occasionally start sentences with "So", "Honestly", "To be honest", "What really excites me"
- Keep answers concise — 2-4 sentences for short questions, 4-8 sentences for longer ones
- NEVER use bullet points or lists in your answers. Write in natural paragraphs
- Don't be overly formal or use phrases like "I am writing to express my interest" 
- Don't use words like "leverage", "synergy", "spearhead", "utilize" — these scream AI
- Mention you're ready to start immediately with no notice period when relevant
- Tie your answers to the SPECIFIC company and role, not generic statements
- Reference your Upper Second Class Honours degree when discussing academics
- Be enthusiastic but genuine — you're a fresh grad excited about your first full-time role

YOUR COMPLETE PROFILE:
${profileSummary}

COMPANY: ${companyName}
COMPANY BACKGROUND: ${companyBackground || 'Not provided'}
JOB TITLE: ${jobTitle}
JOB DESCRIPTION: ${jobDescription || 'Not provided'}
REQUIRED TECHNOLOGIES: ${requiredTechnologies || 'Not specified'}`;

  const userPrompt = `Here are the application form questions I need to answer. For each question, write a natural, human-sounding answer as me (Thaveesha). 

IMPORTANT: Return your response in this EXACT JSON format — an array of objects with "question" and "answer" fields:
[
  {"question": "the original question", "answer": "your natural answer"},
  {"question": "next question", "answer": "your natural answer"}
]

Only return the JSON array, nothing else. No markdown code blocks, no explanations.

QUESTIONS:
${questions}`;

  const response = await callAI(systemPrompt, userPrompt);

  try {
    // Try to extract JSON from the response (handle markdown code blocks)
    let jsonStr = response;
    const jsonMatch = response.match(/\[[\s\S]*\]/);
    if (jsonMatch) {
      jsonStr = jsonMatch[0];
    }
    const parsed = JSON.parse(jsonStr);
    if (Array.isArray(parsed)) {
      return parsed.map((item: { question?: string; answer?: string }) => ({
        question: item.question || 'Unknown question',
        answer: item.answer || 'Could not generate answer',
      }));
    }
  } catch {
    // If JSON parsing fails, try to split by questions
    const lines = response.split('\n').filter(l => l.trim());
    return [{ question: questions, answer: response }];
  }

  return [{ question: questions, answer: response }];
}

export async function generateInterviewPrep(
  jobDescription: string,
  companyName: string,
  companyBackground: string,
  jobTitle: string,
  requiredTechnologies: string
): Promise<Array<{ question: string; suggestedAnswer: string; category: string; difficulty: string }>> {
  const profileSummary = getProfileSummary();

  const systemPrompt = `You are an expert technical interview coach helping Thaveesha Sonnadara prepare for a job interview. Generate realistic interview questions that the company would likely ask.

THAVEESHA'S PROFILE:
${profileSummary}

COMPANY: ${companyName}
COMPANY BACKGROUND: ${companyBackground || 'Not provided'}
JOB TITLE: ${jobTitle}
JOB DESCRIPTION: ${jobDescription || 'Not provided'}
REQUIRED TECHNOLOGIES: ${requiredTechnologies || 'Not specified'}`;

  const userPrompt = `Generate 15-20 interview questions for this role. Include a mix of:
- TECHNICAL questions about the required technologies (specific coding/architecture questions)
- BEHAVIORAL questions (teamwork, problem-solving, time management scenarios)
- COMPANY_SPECIFIC questions (about the company's products, culture, why this company)

For each question, provide a suggested answer that Thaveesha should give, based on his actual experience.

Return ONLY a JSON array in this exact format:
[
  {
    "question": "the interview question",
    "suggestedAnswer": "Thaveesha's suggested talking points as first-person answer",
    "category": "TECHNICAL" or "BEHAVIORAL" or "COMPANY_SPECIFIC",
    "difficulty": "EASY" or "MEDIUM" or "HARD"
  }
]

Only return the JSON array, nothing else. No markdown code blocks.`;

  const response = await callAI(systemPrompt, userPrompt);

  try {
    let jsonStr = response;
    const jsonMatch = response.match(/\[[\s\S]*\]/);
    if (jsonMatch) {
      jsonStr = jsonMatch[0];
    }
    const parsed = JSON.parse(jsonStr);
    if (Array.isArray(parsed)) {
      return parsed.map((item: { question?: string; suggestedAnswer?: string; category?: string; difficulty?: string }) => ({
        question: item.question || 'Unknown question',
        suggestedAnswer: item.suggestedAnswer || '',
        category: ['TECHNICAL', 'BEHAVIORAL', 'COMPANY_SPECIFIC'].includes(item.category || '') 
          ? item.category! : 'TECHNICAL',
        difficulty: ['EASY', 'MEDIUM', 'HARD'].includes(item.difficulty || '') 
          ? item.difficulty! : 'MEDIUM',
      }));
    }
  } catch {
    return [{
      question: 'Tell me about yourself',
      suggestedAnswer: response,
      category: 'BEHAVIORAL',
      difficulty: 'EASY',
    }];
  }

  return [];
}

export interface ExtractedJobData {
  companyName: string;
  jobTitle: string;
  jobDescription: string;
  companyBackground: string;
  requiredTechnologies: string;
  salary: string;
  location: string;
  workMode: 'ONSITE' | 'REMOTE' | 'HYBRID';
  applicationSource: 'LINKEDIN' | 'TOPJOBS' | 'DIRECT_EMAIL' | 'COMPANY_WEBSITE' | 'ROOSTER_JOBS' | 'OTHER';
  contactPerson: string;
  contactEmail: string;
  contactPhone: string;
}

export async function extractJobFromUrl(url: string): Promise<ExtractedJobData> {
  // Fetch and parse HTML
  const htmlText = await fetchAndParseHtml(url);

  // Determine likely source from URL
  let inferredSource: ExtractedJobData['applicationSource'] = 'OTHER';
  if (url.includes('linkedin.com')) inferredSource = 'LINKEDIN';
  else if (url.includes('topjobs.lk')) inferredSource = 'TOPJOBS';
  else if (url.includes('rooster.jobs') || url.includes('roosterjobs')) inferredSource = 'ROOSTER_JOBS';

  const systemPrompt = `You are an expert job posting parser. Extract structured data from job posting text. Return ONLY valid JSON matching the exact schema below.

Rules:
- Extract information ONLY from the provided text
- If information is not present, use empty string "" (except workMode which defaults to "ONSITE")
- Be precise - don't hallucinate details
- For technologies: list comma-separated (e.g., "React, Node.js, PostgreSQL, TypeScript")
- For workMode: ONLY "ONSITE", "REMOTE", or "HYBRID"
- For applicationSource: Use the inferred source provided`;

  const userPrompt = `Extract job details from this job posting text.

INFERRED SOURCE: ${inferredSource}
JOB POSTING URL: ${url}

EXTRACT THESE FIELDS (return ONLY this JSON structure):
{
  "companyName": "company name",
  "jobTitle": "job title/position",
  "jobDescription": "full job description text",
  "companyBackground": "what the company does, mission, products",
  "requiredTechnologies": "comma-separated tech stack",
  "salary": "salary range or compensation info",
  "location": "job location",
  "workMode": "ONSITE|REMOTE|HYBRID",
  "applicationSource": "${inferredSource}",
  "contactPerson": "hiring manager/recruiter name",
  "contactEmail": "contact email",
  "contactPhone": "contact phone"
}

JOB POSTING TEXT:
${htmlText}`;

  const response = await callAI(systemPrompt, userPrompt);

  try {
    // Extract JSON from response
    let jsonStr = response;
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      jsonStr = jsonMatch[0];
    }
    const parsed = JSON.parse(jsonStr);

    // Validate and provide defaults
    return {
      companyName: parsed.companyName || '',
      jobTitle: parsed.jobTitle || '',
      jobDescription: parsed.jobDescription || '',
      companyBackground: parsed.companyBackground || '',
      requiredTechnologies: parsed.requiredTechnologies || '',
      salary: parsed.salary || '',
      location: parsed.location || '',
      workMode: ['ONSITE', 'REMOTE', 'HYBRID'].includes(parsed.workMode) ? parsed.workMode : 'ONSITE',
      applicationSource: ['LINKEDIN', 'TOPJOBS', 'DIRECT_EMAIL', 'COMPANY_WEBSITE', 'ROOSTER_JOBS', 'OTHER'].includes(parsed.applicationSource)
        ? parsed.applicationSource : inferredSource,
      contactPerson: parsed.contactPerson || '',
      contactEmail: parsed.contactEmail || '',
      contactPhone: parsed.contactPhone || '',
    };
  } catch (error) {
    console.error('Failed to parse AI extraction response:', error);
    throw new Error('Failed to extract job details from the URL. Please fill in the details manually.');
  }
}
