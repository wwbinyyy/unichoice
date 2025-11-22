import OpenAI from "openai";

export interface ChatRequest {
  message: string;
  history: Array<{ role: "user" | "assistant"; content: string }>;
}

// the newest OpenAI model is "gpt-5" which was released August 7, 2025. do not change this unless explicitly requested by the user
function getOpenAIClient(): OpenAI {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error("OPENAI_API_KEY environment variable is not set. Please configure your API key to use the AI Advisor feature.");
  }
  return new OpenAI({ 
    apiKey: process.env.OPENAI_API_KEY 
  });
}

export async function generateAIResponse(request: ChatRequest): Promise<string> {
  try {
    const openai = getOpenAIClient();
    const systemPrompt = `You are an expert university advisor AI. You help students find the perfect university based on their needs and preferences.

You have access to information about 1000+ universities worldwide with details about:
- QS Rankings
- Tuition fees (in USD)
- Countries and cities
- Strong majors and programs
- Degree levels (Bachelor, Master, PhD)
- Admission requirements (GPA, test scores, English proficiency)
- Scholarship availability
- International student percentages

When answering questions:
- Be helpful, concise, and friendly
- Provide specific recommendations when asked
- Compare universities objectively using rankings, tuition, programs, and fit
- Suggest considerations like budget, location, program strength, and admission requirements
- If asked about specific universities, provide detailed comparisons
- Keep responses focused and actionable (2-4 paragraphs max)

Examples of what you can help with:
- "Which universities are best for Computer Science under $50k?"
- "Compare MIT and Stanford for engineering"
- "Show me affordable universities in Europe"
- "What are my chances at Harvard with a 3.8 GPA?"`;

    const messages: OpenAI.Chat.ChatCompletionMessageParam[] = [
      { role: "system", content: systemPrompt },
      ...request.history.map(msg => ({
        role: msg.role,
        content: msg.content
      } as OpenAI.Chat.ChatCompletionMessageParam)),
      { role: "user", content: request.message }
    ];

    const response = await openai.chat.completions.create({
      model: "gpt-5",
      messages,
      max_completion_tokens: 500,
    });

    return response.choices[0]?.message?.content || "I apologize, but I couldn't generate a response. Please try again.";
  } catch (error: any) {
    console.error("OpenAI API error:", error);
    throw new Error(`AI service error: ${error.message}`);
  }
}
