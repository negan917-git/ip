import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export interface AnalysisResult {
  emotion: string;
  isComplaint: boolean;
  category: string;
  priority: string;
  summary: string;
}

export async function analyzeMessage(text: string): Promise<AnalysisResult> {
  const prompt = `Проанализируй обращение пользователя.

Определи:
1. Эмоцию (радость, гнев, грусть, нейтральное, разочарование)
2. Является ли сообщение жалобой
3. Категорию жалобы (техническая проблема, качество обслуживания, оплата, доставка, другое)
4. Уровень срочности (низкий, средний, высокий, критичный)
5. Краткое резюме

Текст обращения: "${text}"

Верни ответ строго в JSON формате:
{
  "emotion": "",
  "isComplaint": true,
  "category": "",
  "priority": "",
  "summary": ""
}`;

  const response = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo',
    messages: [{ role: 'user', content: prompt }],
    temperature: 0.3,
    max_tokens: 300,
  });

  const content = response.choices[0]?.message?.content || '';

  try {
    const cleaned = content.replace(/```json\s*/g, '').replace(/```\s*/g, '').trim();
    const result: AnalysisResult = JSON.parse(cleaned);
    return result;
  } catch {
    return {
      emotion: 'нейтральное',
      isComplaint: false,
      category: 'другое',
      priority: 'низкий',
      summary: content.substring(0, 200),
    };
  }
}
