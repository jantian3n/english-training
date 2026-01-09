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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
} from '@mui/material'
import {
  Folder as FolderIcon,
  PlayArrow as PlayIcon,
  Refresh as RefreshIcon,
  FitnessCenter as PracticeIcon,
} from '@mui/icons-material'
import LearningCard from '@/components/LearningCard'
import {
  getDueWordsForUser,
  submitWordReview,
  getQuizOptions,
  getActiveWordSets,
  getAllWordsForPractice,
  resetWordSetProgress,
  submitPracticeReview,
} from '@/app/actions'
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
  const [isPracticeMode, setIsPracticeMode] = useState(false)
  const [resetDialogOpen, setResetDialogOpen] = useState(false)
  const [resetting, setResetting] = useState(false)

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
    setIsPracticeMode(false)
    await loadWords()
  }

  // 开始练习模式（加载所有单词）
  const handleStartPractice = async () => {
    setLoading(true)
    setIsPracticeMode(true)
    try {
      const allWords = await getAllWordsForPractice(selectedWordSetId || undefined)
      setWords(allWords)
      if (allWords.length > 0) {
        await loadOptions(allWords[0].id)
      }
    } catch (error) {
      console.error('Error loading practice words:', error)
    } finally {
      setLoading(false)
    }
  }

  // 重置学习进度
  const handleResetProgress = async () => {
    if (!selectedWordSetId) return

    setResetting(true)
    try {
      await resetWordSetProgress(selectedWordSetId)
      setResetDialogOpen(false)
      // 重置后重新加载单词
      await loadWords()
    } catch (error) {
      console.error('Error resetting progress:', error)
    } finally {
      setResetting(false)
    }
  }

  const handleComplete = async (
    isCorrectDefinition: boolean,
    isCorrectSpelling: boolean,
    timeTaken: number
  ) => {
    const currentWord = words[currentIndex]

    // 根据模式选择不同的提交函数
    if (isPracticeMode) {
      await submitPracticeReview(currentWord.id, isCorrectDefinition, isCorrectSpelling, timeTaken)
    } else {
      await submitWordReview(currentWord.id, isCorrectDefinition, isCorrectSpelling, timeTaken)
    }

    // Move to next word
    const nextIndex = currentIndex + 1
    if (nextIndex < words.length) {
      setCurrentIndex(nextIndex)
      await loadOptions(words[nextIndex].id)
    } else {
      // 练习模式结束后返回选择界面
      if (isPracticeMode) {
        setStarted(false)
        setIsPracticeMode(false)
        setWords([])
        setCurrentIndex(0)
      } else {
        // 正常模式重新加载
        await loadWords()
        setCurrentIndex(0)
      }
    }
  }

  const handleBackToSelect = () => {
    setStarted(false)
    setIsPracticeMode(false)
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

          {/* 练习和重置按钮 */}
          {selectedWordSetId && (
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', mb: 3 }}>
              <Button
                variant="contained"
                startIcon={<PracticeIcon />}
                onClick={handleStartPractice}
              >
                练习全部单词
              </Button>
              <Button
                variant="outlined"
                color="warning"
                startIcon={<RefreshIcon />}
                onClick={() => setResetDialogOpen(true)}
              >
                重置学习进度
              </Button>
            </Box>
          )}

          <Button variant="outlined" onClick={handleBackToSelect}>
            返回选择
          </Button>
        </Box>

        {/* 重置确认弹窗 */}
        <Dialog open={resetDialogOpen} onClose={() => !resetting && setResetDialogOpen(false)}>
          <DialogTitle>确认重置学习进度</DialogTitle>
          <DialogContent>
            <Alert severity="warning" sx={{ mt: 1 }}>
              此操作将重置「{selectedWordSet?.name}」单词集的所有学习进度，包括：
              <ul style={{ margin: '8px 0', paddingLeft: '20px' }}>
                <li>复习间隔将重置为0</li>
                <li>重复次数将重置为0</li>
                <li>难易系数将重置为初始值</li>
              </ul>
              统计数据（练习次数、正确率）将保留。
            </Alert>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setResetDialogOpen(false)} disabled={resetting}>
              取消
            </Button>
            <Button
              variant="contained"
              color="warning"
              onClick={handleResetProgress}
              disabled={resetting}
            >
              {resetting ? '重置中...' : '确认重置'}
            </Button>
          </DialogActions>
        </Dialog>
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
          {isPracticeMode ? '练习模式' : '每日复习'}
        </Typography>
        {isPracticeMode && (
          <Alert severity="info" sx={{ mb: 2, maxWidth: 400, mx: 'auto' }}>
            练习模式：只记录统计数据，不影响复习计划
          </Alert>
        )}
        <Typography variant="body1" color="text.secondary" textAlign="center" mb={2}>
          {currentIndex + 1} / {words.length}
        </Typography>

        <LearningCard key={words[currentIndex].id} word={words[currentIndex]} options={options} onComplete={handleComplete} />
      </Box>
    </Container>
  )
}
