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

  return options.map((opt) => opt.optionText)
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
