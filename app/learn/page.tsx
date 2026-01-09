'use client'

import { useState, useEffect } from 'react'
import {
  Container,
  Box,
  Typography,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Paper,
  Button,
} from '@mui/material'
import { Folder as FolderIcon, PlayArrow as PlayIcon } from '@mui/icons-material'
import LearningCard from '@/components/LearningCard'
import { getDueWordsForUser, submitWordReview, getQuizOptions, getActiveWordSets } from '@/app/actions'
import { Word } from '@prisma/client'

interface WordSet {
  id: string
  name: string
  color: string
  _count: { words: number }
}

export default function LearnPage() {
  const [words, setWords] = useState<Word[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [options, setOptions] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [wordSets, setWordSets] = useState<WordSet[]>([])
  const [selectedWordSetId, setSelectedWordSetId] = useState<string>('')
  const [started, setStarted] = useState(false)

  useEffect(() => {
    loadWordSets()
  }, [])

  const loadWordSets = async () => {
    try {
      const data = await getActiveWordSets()
      setWordSets(data as WordSet[])
    } catch (error) {
      console.error('Error loading word sets:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadWords = async () => {
    setLoading(true)
    try {
      const dueWords = await getDueWordsForUser(selectedWordSetId || undefined)
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

  const handleStart = async () => {
    setStarted(true)
    await loadWords()
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

  const handleBackToSelect = () => {
    setStarted(false)
    setWords([])
    setCurrentIndex(0)
  }

  const selectedWordSet = wordSets.find(ws => ws.id === selectedWordSetId)

  // 选择单词集界面
  if (!started) {
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

    return (
      <Container maxWidth="sm">
        <Box sx={{ py: 8 }}>
          <Typography variant="h4" gutterBottom textAlign="center" fontWeight={600}>
            开始学习
          </Typography>
          <Typography variant="body1" color="text.secondary" textAlign="center" mb={4}>
            选择要学习的单词集，或学习全部单词
          </Typography>

          <Paper sx={{ p: 4 }}>
            <FormControl fullWidth sx={{ mb: 3 }}>
              <InputLabel>选择单词集</InputLabel>
              <Select
                value={selectedWordSetId}
                label="选择单词集"
                onChange={(e) => setSelectedWordSetId(e.target.value)}
              >
                <MenuItem value="">
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <FolderIcon sx={{ color: 'grey.500', fontSize: 20 }} />
                    全部单词
                  </Box>
                </MenuItem>
                {wordSets.map((ws) => (
                  <MenuItem key={ws.id} value={ws.id}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <FolderIcon sx={{ color: ws.color, fontSize: 20 }} />
                      {ws.name} ({ws._count.words} 个单词)
                    </Box>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {selectedWordSet && (
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                将学习「{selectedWordSet.name}」单词集中的单词
              </Typography>
            )}

            <Button
              variant="contained"
              size="large"
              fullWidth
              startIcon={<PlayIcon />}
              onClick={handleStart}
            >
              开始学习
            </Button>
          </Paper>
        </Box>
      </Container>
    )
  }

  // 加载中
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

  // 没有单词
  if (words.length === 0) {
    return (
      <Container maxWidth="sm">
        <Box sx={{ py: 8, textAlign: 'center' }}>
          <Typography variant="h5" gutterBottom>
            {selectedWordSetId ? '该单词集暂无需要复习的单词！' : '今天没有需要复习的单词！'}
          </Typography>
          <Typography variant="body1" color="text.secondary" mb={4}>
            {selectedWordSetId ? '可以尝试其他单词集，或者等待新单词到期。' : '明天再来吧，或者选择其他单词集。'}
          </Typography>
          <Button variant="outlined" onClick={handleBackToSelect}>
            返回选择
          </Button>
        </Box>
      </Container>
    )
  }

  return (
    <Container>
      <Box sx={{ py: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Button size="small" onClick={handleBackToSelect}>
            返回选择
          </Button>
          {selectedWordSet && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <FolderIcon sx={{ color: selectedWordSet.color, fontSize: 18 }} />
              <Typography variant="body2" color="text.secondary">
                {selectedWordSet.name}
              </Typography>
            </Box>
          )}
        </Box>

        <Typography variant="h4" gutterBottom textAlign="center" fontWeight={600}>
          每日复习
        </Typography>
        <Typography variant="body1" color="text.secondary" textAlign="center" mb={2}>
          {currentIndex + 1} / {words.length}
        </Typography>

        <LearningCard key={words[currentIndex].id} word={words[currentIndex]} options={options} onComplete={handleComplete} />
      </Box>
    </Container>
  )
}
