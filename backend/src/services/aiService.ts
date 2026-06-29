import axios from 'axios';

const provider = process.env.AI_PROVIDER || 'anthropic';
const apiKey = process.env.AI_API_KEY || '';

export async function getAiReply(message: string, systemPrompt?: string) {
  if (!apiKey) {
    return `AI key לא מוגדר. זוהי תשובת דמו אוטומטית על ההודעה: "${message}"`;
  }

  if (provider === 'anthropic') {
    const response = await axios.post('https://api.anthropic.com/v1/messages', {
      model: 'claude-sonnet-4-5',
      messages: [
        { role: 'system', content: systemPrompt || 'You are FitMind AI coach.' },
        { role: 'user', content: message },
      ],
      max_tokens_to_sample: 1000,
    }, {
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
      },
    });
    return response.data?.content?.[0]?.text || 'מצטער, לא הצלחתי לענות.';
  }

  if (provider === 'openai') {
    const response = await axios.post('https://api.openai.com/v1/chat/completions', {
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: systemPrompt || 'You are FitMind AI coach.' },
        { role: 'user', content: message },
      ],
      max_tokens: 1000,
    }, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
    });
    return response.data.choices?.[0]?.message?.content || 'מצטער, לא הצלחתי לענות.';
  }

  throw new Error(`Unsupported AI_PROVIDER: ${provider}`);
}
