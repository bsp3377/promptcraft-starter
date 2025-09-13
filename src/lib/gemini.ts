const GEMINI_URL =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent";

export async function callGemini({
  systemPrompt,
  userText,
  temperature = 0.6,
  maxOutputTokens = 1024,
}: {
  systemPrompt: string;
  userText: string;
  temperature?: number;
  maxOutputTokens?: number;
}): Promise<string> {
  const key = import.meta.env.VITE_GEMINI_API_KEY;
  if (!key) {
    throw new Error("Missing VITE_GEMINI_API_KEY environment variable");
  }

  const res = await fetch(`${GEMINI_URL}?key=${key}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [
        { role: "user", parts: [{ text: `${systemPrompt}\n\n${userText}` }] },
      ],
      generationConfig: { temperature, maxOutputTokens },
    }),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    console.error('Gemini API error:', errorData);
    throw new Error(`Gemini API error: ${res.status} ${res.statusText} - ${errorData.error?.message || 'Unknown error'}`);
  }

  const data = await res.json();
  
  if (!data.candidates || data.candidates.length === 0) {
    console.error('No candidates in response:', data);
    throw new Error('No response generated from Gemini API');
  }
  
  const text = data.candidates[0]?.content?.parts?.[0]?.text ?? "";
  return text.trim();
}

export async function enhanceField(fieldLabel: string, value: string): Promise<string> {
  const systemPrompt = `You are a prompt engineer. Improve ONLY the provided field's clarity, tone, and specificity.
Return only the improved text, with no extra commentary.
Field: ${fieldLabel}`;
  return callGemini({ systemPrompt, userText: value });
}

export async function polishFinalPrompt(draft: string): Promise<string> {
  const systemPrompt = `You are a prompt engineer. Clean, normalize, and return the final optimized prompt text only. Preserve structure and headings if present.`;
  return callGemini({ systemPrompt, userText: draft, temperature: 0.4 });
}
