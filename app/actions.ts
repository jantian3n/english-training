'use server'

import { prisma } from '@/lib/prisma'
import { requireAdmin, requireAuth } from '@/lib/auth-utils'
import { generateWordContent, generateQuizOptions } from '@/lib/deepseek'
import { calculateSM2, calculateQuality, getDueWords } from '@/lib/sm2-algorithm'
import { revalidatePath } from 'next/cache'
import bcrypt from 'bcryptjs'
import { Role } from '@prisma/client'

// ==================== Word Management ====================

export async function addWord(formData: FormData) {
  await requireAdmin()

  const word = formData.get('word') as string
  const definition = formData.get('definition') as string
  const difficulty = parseInt(formData.get('difficulty') as string) || 1

  try {
    // Generate AI content
    const aiContent = await generateWordContent(word, definition)

    // Create word
    const newWord = await prisma.word.create({
      data: {
        word: word.trim(),
        definition: definition.trim(),
        pronunciation: aiContent.pronunciation || '',
        definitionCn: aiContent.definitionCn || '',
        exampleSentence: aiContent.exampleSentence,
        exampleCn: aiContent.exampleCn,
        difficulty,
      },
    })

    // Generate quiz options
    const distractors = await generateQuizOptions(word, definition, 3)

    // Store quiz options
    await prisma.quizOption.createMany({
      data: distractors.map((distractor) => ({
        wordId: newWord.id,
        optionText: distractor,
        isCorrect: false,
      })),
    })

    revalidatePath('/admin/words')
    return { success: true, word: newWord }
  } catch (error) {
    console.error('Error adding word:', error)
    return { success: false, error: 'Failed to add word' }
  }
}

export async function deleteWord(wordId: string) {
  await requireAdmin()

  try {
    await prisma.word.delete({ where: { id: wordId } })
    revalidatePath('/admin/words')
    return { success: true }
  } catch (error) {
    console.error('Error deleting word:', error)
    return { success: false, error: 'Failed to delete word' }
  }
}

export async function getWords() {
  await requireAdmin()

  return prisma.word.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      _count: {
        select: { quizOptions: true },
      },
    },
  })
}

export async function updateWord(
  wordId: string,
  data: {
    word?: string
    definition?: string
    definitionCn?: string
    pronunciation?: string
    exampleSentence?: string
    exampleCn?: string
    difficulty?: number
    isActive?: boolean
  }
) {
  await requireAdmin()

  try {
    const updatedWord = await prisma.word.update({
      where: { id: wordId },
      data,
    })
    revalidatePath('/admin/words')
    return { success: true, word: updatedWord }
  } catch (error) {
    console.error('Error updating word:', error)
    return { success: false, error: 'Failed to update word' }
  }
}

// Bulk import words
export async function bulkAddWords(
  words: Array<{ word: string; definition: string }>,
  _onProgress?: (index: number, total: number, result: { word: string; success: boolean; error?: string }) => void
) {
  await requireAdmin()

  const results: Array<{ word: string; success: boolean; error?: string }> = []

  for (let i = 0; i < words.length; i++) {
    const { word, definition } = words[i]

    try {
      // Check if word already exists
      const existing = await prisma.word.findUnique({
        where: { word: word.trim().toLowerCase() },
      })

      if (existing) {
        results.push({
          word,
          success: false,
          error: '单词已存在',
        })
        continue
      }

      // Generate AI content (use word as definition if not provided)
      const actualDefinition = definition || `meaning of ${word}`
      const aiContent = await generateWordContent(word, actualDefinition)

      // Use AI-generated definition if none provided
      const finalDefinition = definition || aiContent.definitionCn || actualDefinition

      // Create word
      const newWord = await prisma.word.create({
        data: {
          word: word.trim(),
          definition: finalDefinition,
          pronunciation: aiContent.pronunciation || '',
          definitionCn: aiContent.definitionCn || '',
          exampleSentence: aiContent.exampleSentence,
          exampleCn: aiContent.exampleCn,
          difficulty: 2,
        },
      })

      // Generate quiz options
      try {
        const distractors = await generateQuizOptions(word, finalDefinition, 3)

        await prisma.quizOption.createMany({
          data: distractors.map((distractor) => ({
            wordId: newWord.id,
            optionText: distractor,
            isCorrect: false,
          })),
        })
      } catch (quizError) {
        console.warn(`Failed to generate quiz options for ${word}:`, quizError)
        // Continue even if quiz options fail
      }

      results.push({ word, success: true })
    } catch (error) {
      console.error(`Error adding word "${word}":`, error)
      const errorMessage = error instanceof Error ? error.message : '添加失败'
      results.push({ word, success: false, error: errorMessage })
    }

    // Small delay to avoid rate limiting
    if (i < words.length - 1) {
      await new Promise((resolve) => setTimeout(resolve, 500))
    }
  }

  revalidatePath('/admin/words')
  revalidatePath('/admin/import')

  return {
    success: true,
    results,
    summary: {
      total: words.length,
      success: results.filter((r) => r.success).length,
      failed: results.filter((r) => !r.success).length,
    },
  }
}

// ==================== User Management ====================

export async function getUsers() {
  await requireAdmin()
  return prisma.user.findMany({
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      createdAt: true,
    },
    orderBy: { createdAt: 'desc' },
  })
}

export async function createUser(formData: FormData) {
  await requireAdmin()

  const email = formData.get('email') as string
  const name = formData.get('name') as string
  const password = formData.get('password') as string
  const role = (formData.get('role') as Role) || Role.USER

  try {
    const hashedPassword = await bcrypt.hash(password, 10)

    const user = await prisma.user.create({
      data: {
        email,
        name,
        password: hashedPassword,
        role,
      },
    })

    revalidatePath('/admin/users')
    return { success: true, user }
  } catch (error) {
    console.error('Error creating user:', error)
    return { success: false, error: 'Failed to create user' }
  }
}

export async function deleteUser(userId: string) {
  await requireAdmin()

  try {
    await prisma.user.delete({ where: { id: userId } })
    revalidatePath('/admin/users')
    return { success: true }
  } catch (error) {
    console.error('Error deleting user:', error)
    return { success: false, error: 'Failed to delete user' }
  }
}

export async function resetPassword(userId: string, newPassword: string) {
  await requireAdmin()

  try {
    const hashedPassword = await bcrypt.hash(newPassword, 10)

    await prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword },
    })

    return { success: true }
  } catch (error) {
    console.error('Error resetting password:', error)
    return { success: false, error: 'Failed to reset password' }
  }
}

// ==================== Learning Functions ====================

export async function getDueWordsForUser() {
  const session = await requireAuth()
  const userId = session.user.id

  // Get all learning records for user
  const records = await prisma.learningRecord.findMany({
    where: { userId },
    include: { word: true },
  })

  // Get due words using SM-2 algorithm
  const dueRecords = getDueWords(records, 20)

  // If no due words, get new words
  if (dueRecords.length === 0) {
    const learnedWordIds = records.map((r) => r.wordId)
    const newWords = await prisma.word.findMany({
      where: {
        isActive: true,
        id: { notIn: learnedWordIds },
      },
      take: 10,
      orderBy: { difficulty: 'asc' },
    })

    return newWords
  }

  return dueRecords.map((r) => r.word)
}

export async function submitWordReview(
  wordId: string,
  isCorrectDefinition: boolean,
  isCorrectSpelling: boolean,
  timeTaken: number
) {
  const session = await requireAuth()
  const userId = session.user.id

  // Calculate quality rating
  const quality = calculateQuality(isCorrectDefinition, isCorrectSpelling, timeTaken)

  // Get or create learning record
  let record = await prisma.learningRecord.findUnique({
    where: {
      userId_wordId: { userId, wordId },
    },
  })

  if (!record) {
    // Create new record for first-time learning
    record = await prisma.learningRecord.create({
      data: {
        userId,
        wordId,
        easeFactor: 2.5,
        interval: 0,
        repetitions: 0,
        nextReviewDate: new Date(),
      },
    })
  }

  // Calculate new SM-2 values
  const sm2Result = calculateSM2(
    quality,
    record.easeFactor,
    record.interval,
    record.repetitions
  )

  // Update record
  await prisma.learningRecord.update({
    where: { id: record.id },
    data: {
      easeFactor: sm2Result.easeFactor,
      interval: sm2Result.interval,
      repetitions: sm2Result.repetitions,
      nextReviewDate: sm2Result.nextReviewDate,
      lastQuality: quality,
      totalReviews: { increment: 1 },
      correctCount: isCorrectDefinition && isCorrectSpelling ? { increment: 1 } : undefined,
      incorrectCount: !isCorrectDefinition || !isCorrectSpelling ? { increment: 1 } : undefined,
      lastReviewedAt: new Date(),
    },
  })

  return { success: true, quality, nextReview: sm2Result.nextReviewDate }
}

export async function getQuizOptions(wordId: string) {
  const options = await prisma.quizOption.findMany({
    where: { wordId },
    select: { optionText: true },
  })

  // If options exist, return them
  if (options.length >= 3) {
    return options.map((opt) => opt.optionText)
  }

  // Otherwise, generate options on-the-fly
  try {
    const word = await prisma.word.findUnique({
      where: { id: wordId },
    })

    if (!word) {
      return []
    }

    // Generate new quiz options
    const distractors = await generateQuizOptions(word.word, word.definition, 3)

    // Store them for future use
    if (distractors.length > 0) {
      // Check existing options to avoid duplicates (SQLite doesn't support skipDuplicates)
      const existingOptions = await prisma.quizOption.findMany({
        where: { wordId },
        select: { optionText: true },
      })
      const existingTexts = new Set(existingOptions.map((o) => o.optionText))
      const newDistractors = distractors.filter((d) => !existingTexts.has(d))

      if (newDistractors.length > 0) {
        await prisma.quizOption.createMany({
          data: newDistractors.map((distractor) => ({
            wordId,
            optionText: distractor,
            isCorrect: false,
          })),
        })
      }
    }

    return distractors
  } catch (error) {
    console.error('Error generating quiz options:', error)
    return []
  }
}

export async function getUserStats() {
  const session = await requireAuth()
  const userId = session.user.id

  const records = await prisma.learningRecord.findMany({
    where: { userId },
  })

  const totalWords = records.length
  const totalReviews = records.reduce((sum, r) => sum + r.totalReviews, 0)
  const correctCount = records.reduce((sum, r) => sum + r.correctCount, 0)
  const incorrectCount = records.reduce((sum, r) => sum + r.incorrectCount, 0)

  const dueToday = records.filter((r) => {
    const reviewDate = new Date(r.nextReviewDate)
    const today = new Date()
    reviewDate.setHours(0, 0, 0, 0)
    today.setHours(0, 0, 0, 0)
    return reviewDate <= today
  }).length

  const accuracy = totalReviews > 0 ? (correctCount / totalReviews) * 100 : 0

  return {
    totalWords,
    totalReviews,
    correctCount,
    incorrectCount,
    dueToday,
    accuracy: Math.round(accuracy * 10) / 10,
  }
}

// ==================== Leaderboard ====================

export async function getLeaderboard() {
  await requireAuth()

  // Get all users with their learning records aggregated
  const users = await prisma.user.findMany({
    where: { role: Role.USER },
    select: {
      id: true,
      name: true,
      email: true,
      learningRecords: {
        select: {
          totalReviews: true,
          correctCount: true,
        },
      },
    },
  })

  // Also get admin users
  const admins = await prisma.user.findMany({
    where: { role: Role.ADMIN },
    select: {
      id: true,
      name: true,
      email: true,
      learningRecords: {
        select: {
          totalReviews: true,
          correctCount: true,
        },
      },
    },
  })

  const allUsers = [...users, ...admins]

  // Calculate stats for each user
  const leaderboardData = allUsers.map((user) => {
    const totalReviews = user.learningRecords.reduce((sum, r) => sum + r.totalReviews, 0)
    const correctCount = user.learningRecords.reduce((sum, r) => sum + r.correctCount, 0)
    const accuracy = totalReviews > 0 ? (correctCount / totalReviews) * 100 : 0
    const wordsLearned = user.learningRecords.length

    return {
      id: user.id,
      name: user.name || user.email.split('@')[0],
      totalReviews,
      correctCount,
      accuracy: Math.round(accuracy * 10) / 10,
      wordsLearned,
    }
  })

  // Sort by total reviews (descending), then by accuracy
  return leaderboardData
    .sort((a, b) => {
      if (b.totalReviews !== a.totalReviews) {
        return b.totalReviews - a.totalReviews
      }
      return b.accuracy - a.accuracy
    })
    .slice(0, 10) // Top 10
}
