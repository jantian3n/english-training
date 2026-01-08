/**
 * SuperMemo-2 (SM-2) Spaced Repetition Algorithm Implementation
 *
 * Quality ratings (0-5):
 * 0 - Complete blackout
 * 1 - Incorrect response; correct answer seemed familiar
 * 2 - Incorrect response; correct answer seemed easy to recall
 * 3 - Correct response recalled with serious difficulty
 * 4 - Correct response after hesitation
 * 5 - Perfect response
 */

export interface SM2Result {
  easeFactor: number
  interval: number
  repetitions: number
  nextReviewDate: Date
}

/**
 * Calculate next review using SM-2 algorithm
 *
 * @param quality - User's performance rating (0-5)
 * @param currentEF - Current ease factor (default: 2.5)
 * @param currentInterval - Current interval in days (default: 0)
 * @param currentReps - Current repetition count (default: 0)
 * @returns SM2Result with updated values
 */
export function calculateSM2(
  quality: number,
  currentEF: number = 2.5,
  currentInterval: number = 0,
  currentReps: number = 0
): SM2Result {
  // Validate quality rating
  if (quality < 0 || quality > 5) {
    throw new Error('Quality must be between 0 and 5')
  }

  let easeFactor = currentEF
  let interval = currentInterval
  let repetitions = currentReps

  // If quality < 3, reset repetitions and interval
  if (quality < 3) {
    repetitions = 0
    interval = 1 // Review tomorrow
  } else {
    // Calculate new interval based on repetitions
    if (repetitions === 0) {
      interval = 1 // First correct answer: review in 1 day
    } else if (repetitions === 1) {
      interval = 6 // Second correct answer: review in 6 days
    } else {
      // Subsequent reviews: multiply previous interval by EF
      interval = Math.round(interval * easeFactor)
    }

    repetitions += 1
  }

  // Update ease factor using SM-2 formula
  // EF' = EF + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02))
  easeFactor = easeFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02))

  // Ensure EF doesn't go below 1.3
  if (easeFactor < 1.3) {
    easeFactor = 1.3
  }

  // Calculate next review date
  const nextReviewDate = new Date()
  nextReviewDate.setDate(nextReviewDate.getDate() + interval)
  nextReviewDate.setHours(0, 0, 0, 0) // Reset to midnight

  return {
    easeFactor: Math.round(easeFactor * 100) / 100, // Round to 2 decimal places
    interval,
    repetitions,
    nextReviewDate,
  }
}

/**
 * Convert user answer performance to SM-2 quality rating
 *
 * @param isCorrectDefinition - Did user select correct definition?
 * @param isCorrectSpelling - Did user spell the word correctly?
 * @param hesitationTime - Time taken to answer (in seconds)
 * @returns Quality rating (0-5)
 */
export function calculateQuality(
  isCorrectDefinition: boolean,
  isCorrectSpelling: boolean,
  hesitationTime?: number
): number {
  // If both incorrect, complete failure
  if (!isCorrectDefinition && !isCorrectSpelling) {
    return 0
  }

  // If definition wrong but spelling right (unlikely scenario)
  if (!isCorrectDefinition) {
    return 1
  }

  // If definition right but spelling wrong
  if (!isCorrectSpelling) {
    return 2
  }

  // Both correct - determine quality based on hesitation
  if (!hesitationTime) {
    return 4 // Default: good response
  }

  if (hesitationTime < 3) {
    return 5 // Perfect: answered within 3 seconds
  } else if (hesitationTime < 8) {
    return 4 // Good: answered within 8 seconds
  } else {
    return 3 // Acceptable: took more than 8 seconds
  }
}

/**
 * Get words due for review
 *
 * @param records - Learning records
 * @param maxWords - Maximum words to return
 * @returns Filtered records due for review, sorted by priority
 */
export function getDueWords<T extends { nextReviewDate: Date; easeFactor: number }>(
  records: T[],
  maxWords: number = 20
): T[] {
  const now = new Date()
  now.setHours(0, 0, 0, 0)

  return records
    .filter((record) => {
      const reviewDate = new Date(record.nextReviewDate)
      reviewDate.setHours(0, 0, 0, 0)
      return reviewDate <= now
    })
    .sort((a, b) => {
      // Sort by review date (earlier first), then by ease factor (harder first)
      const dateA = new Date(a.nextReviewDate).getTime()
      const dateB = new Date(b.nextReviewDate).getTime()
      if (dateA !== dateB) {
        return dateA - dateB
      }
      return a.easeFactor - b.easeFactor
    })
    .slice(0, maxWords)
}

/**
 * Calculate statistics for learning progress
 */
export function calculateProgress(
  totalReviews: number,
  correctCount: number,
  incorrectCount: number
): {
  accuracy: number
  totalReviews: number
  correctCount: number
  incorrectCount: number
} {
  const accuracy = totalReviews > 0 ? (correctCount / totalReviews) * 100 : 0

  return {
    accuracy: Math.round(accuracy * 10) / 10,
    totalReviews,
    correctCount,
    incorrectCount,
  }
}
