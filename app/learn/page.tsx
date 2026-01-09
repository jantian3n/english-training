'use client'

import { useState, useEffect } from 'react'
import { Container, Box, Typography, CircularProgress } from '@mui/material'
import LearningCard from '@/components/LearningCard'
import { getDueWordsForUser, submitWordReview, getQuizOptions } from '@/app/actions'
import { Word } from '@prisma/client'

export default function LearnPage() {
  const [words, setWords] = useState<Word[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [options, setOptions] = useState<string[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadWords()
  }, [])

  const loadWords = async () => {
    setLoading(true)
    try {
      const dueWords = await getDueWordsForUser()
      setWords(dueWords)
      if (dueWords.length > 0) {
        await loadOptions(dueWords[0].id)
      }
    } catch (error) {
      console.error('Error loading words:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadOptions = async (wordId: string) => {
    try {
      const opts = await getQuizOptions(wordId)
      setOptions(opts)
    } catch (error) {
      console.error('Error loading options:', error)
      setOptions([])
    }
  }

  const handleComplete = async (
    isCorrectDefinition: boolean,
    isCorrectSpelling: boolean,
    timeTaken: number
  ) => {
    const currentWord = words[currentIndex]

    await submitWordReview(currentWord.id, isCorrectDefinition, isCorrectSpelling, timeTaken)

    // Move to next word
    const nextIndex = currentIndex + 1
    if (nextIndex < words.length) {
      setCurrentIndex(nextIndex)
      await loadOptions(words[nextIndex].id)
    } else {
      // Reload words when finished
      await loadWords()
      setCurrentIndex(0)
    }
  }

  if (loading) {
    return (
      <Container>
        <Box
          sx={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <CircularProgress />
        </Box>
      </Container>
    )
  }

  if (words.length === 0) {
    return (
      <Container>
        <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Typography variant="h5">今天没有需要复习的单词！明天再来吧。</Typography>
        </Box>
      </Container>
    )
  }

  return (
    <Container>
      <Box sx={{ py: 4 }}>
        <Typography variant="h4" gutterBottom textAlign="center" fontWeight={600}>
          每日复习
        </Typography>
        <Typography variant="body1" color="text.secondary" textAlign="center" mb={2}>
          {currentIndex + 1} / {words.length}
        </Typography>

        <LearningCard word={words[currentIndex]} options={options} onComplete={handleComplete} />
      </Box>
    </Container>
  )
}
