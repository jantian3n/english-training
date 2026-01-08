import OpenAI from 'openai'

const openai = new OpenAI({
  baseURL: 'https://api.deepseek.com',
  apiKey: process.env.DEEPSEEK_API_KEY,
})

export interface GeneratedWordContent {
  exampleSentence: string
  exampleCn: string
  pronunciation?: string
  definitionCn?: string
}

/**
 * Generate AI content for a word using DeepSeek API
 */
export async function generateWordContent(
  word: string,
  definition: string
): Promise<GeneratedWordContent> {
  try {
    const prompt = `You are a professional English teacher. For the English word "${word}" with definition "${definition}", please provide:

1. An example sentence using this word in context (natural, everyday usage)
2. Chinese translation of the example sentence
3. IPA pronunciation notation (if applicable)
4. Chinese translation of the definition

Return the response in JSON format:
{
  "exampleSentence": "...",
  "exampleCn": "...",
  "pronunciation": "...",
  "definitionCn": "..."
}`

    const completion = await openai.chat.completions.create({
      model: 'deepseek-chat',
      messages: [
        {
          role: 'system',
          content:
            'You are a professional English teacher specialized in creating educational content. Always respond in valid JSON format.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 500,
      response_format: { type: 'json_object' },
    })

    const content = completion.choices[0]?.message?.content
    if (!content) {
      throw new Error('No content received from AI')
    }

    const parsed = JSON.parse(content) as GeneratedWordContent

    return {
      exampleSentence: parsed.exampleSentence || '',
      exampleCn: parsed.exampleCn || '',
      pronunciation: parsed.pronunciation || '',
      definitionCn: parsed.definitionCn || '',
    }
  } catch (error) {
    console.error('DeepSeek API Error:', error)
    throw new Error('Failed to generate AI content')
  }
}

/**
 * Generate multiple distractor options for quiz
 */
export async function generateQuizOptions(
  word: string,
  correctDefinition: string,
  count: number = 3
): Promise<string[]> {
  try {
    const prompt = `For the English word "${word}" with correct definition "${correctDefinition}", generate ${count} plausible but incorrect definitions (distractors) for a multiple-choice quiz.

The distractors should:
- Be believable and similar difficulty
- NOT be the correct definition
- Be concise (similar length to the correct definition)

Return only a JSON array of strings: ["distractor1", "distractor2", "distractor3"]`

    const completion = await openai.chat.completions.create({
      model: 'deepseek-chat',
      messages: [
        {
          role: 'system',
          content:
            'You are an expert at creating educational quiz content. Always respond in valid JSON format.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.8,
      max_tokens: 300,
      response_format: { type: 'json_object' },
    })

    const content = completion.choices[0]?.message?.content
    if (!content) {
      throw new Error('No content received from AI')
    }

    const parsed = JSON.parse(content)
    const distractors = parsed.distractors || parsed.options || []

    if (!Array.isArray(distractors) || distractors.length < count) {
      throw new Error('Invalid distractors format')
    }

    return distractors.slice(0, count)
  } catch (error) {
    console.error('DeepSeek API Error:', error)
    throw new Error('Failed to generate quiz options')
  }
}
