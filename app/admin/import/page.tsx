'use client'

import { useState, useEffect } from 'react'
import {
  Box,
  Typography,
  TextField,
  Button,
  Alert,
  Paper,
  LinearProgress,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material'
import {
  CheckCircle as SuccessIcon,
  Error as ErrorIcon,
  HourglassEmpty as PendingIcon,
  Folder as FolderIcon,
} from '@mui/icons-material'
import { bulkAddWords, getWordSets } from '@/app/actions'

interface ImportResult {
  word: string
  status: 'success' | 'error' | 'pending'
  message?: string
}

interface WordSet {
  id: string
  name: string
  color: string
  _count: { words: number }
}

export default function ImportPage() {
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState<ImportResult[]>([])
  const [progress, setProgress] = useState(0)
  const [wordSets, setWordSets] = useState<WordSet[]>([])
  const [selectedWordSetId, setSelectedWordSetId] = useState<string>('')

  useEffect(() => {
    loadWordSets()
  }, [])

  const loadWordSets = async () => {
    try {
      const data = await getWordSets()
      setWordSets(data as WordSet[])
    } catch (error) {
      console.error('Error loading word sets:', error)
    }
  }

  const parseInput = (text: string): Array<{ word: string; definition: string }> => {
    const lines = text.trim().split('\n').filter((line) => line.trim())
    const words: Array<{ word: string; definition: string }> = []

    for (const line of lines) {
      // Support formats:
      // 1. word - definition
      // 2. word: definition
      // 3. word | definition
      // 4. word    definition (tab separated)
      const separators = [' - ', ': ', ' | ', '\t']
      let parsed = false

      for (const sep of separators) {
        if (line.includes(sep)) {
          const [word, ...defParts] = line.split(sep)
          const definition = defParts.join(sep).trim()
          if (word.trim() && definition) {
            words.push({ word: word.trim(), definition })
            parsed = true
            break
          }
        }
      }

      // If no separator found, treat the whole line as a word (AI will generate definition)
      if (!parsed && line.trim()) {
        words.push({ word: line.trim(), definition: '' })
      }
    }

    return words
  }

  const handleImport = async () => {
    const words = parseInput(input)
    if (words.length === 0) {
      return
    }

    setLoading(true)
    setResults(words.map((w) => ({ word: w.word, status: 'pending' as const })))
    setProgress(0)

    try {
      // Simulate progress while waiting
      const progressInterval = setInterval(() => {
        setProgress((prev) => Math.min(prev + 5, 90))
      }, 1000)

      const result = await bulkAddWords(words, selectedWordSetId || undefined)

      clearInterval(progressInterval)
      setProgress(100)

      // Update final results
      setResults(
        result.results.map((r) => ({
          word: r.word,
          status: r.success ? 'success' : 'error',
          message: r.error,
        }))
      )

      // Clear input on success
      if (result.summary.success > 0) {
        setInput('')
      }
    } catch (error) {
      console.error('Import error:', error)
      setResults(
        parseInput(input).map((w) => ({
          word: w.word,
          status: 'error' as const,
          message: '导入过程发生错误',
        }))
      )
    } finally {
      setLoading(false)
    }
  }

  const successCount = results.filter((r) => r.status === 'success').length
  const errorCount = results.filter((r) => r.status === 'error').length
  const selectedWordSet = wordSets.find(ws => ws.id === selectedWordSetId)

  return (
    <Box>
      <Typography variant="h4" fontWeight={600} gutterBottom>
        批量导入单词
      </Typography>

      <Alert severity="info" sx={{ mb: 3 }}>
        <Typography variant="body2" gutterBottom>
          <strong>支持的格式：</strong>
        </Typography>
        <Typography variant="body2" component="div">
          • 每行一个单词，格式：<code>单词 - 释义</code> 或 <code>单词: 释义</code> 或{' '}
          <code>单词 | 释义</code>
          <br />
          • 如果只输入单词不输入释义，AI会自动生成释义
          <br />• AI会自动为每个单词生成：音标、中文释义、例句、测验选项
        </Typography>
      </Alert>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Box sx={{ mb: 2 }}>
          <FormControl fullWidth>
            <InputLabel>导入到单词集</InputLabel>
            <Select
              value={selectedWordSetId}
              label="导入到单词集"
              onChange={(e) => setSelectedWordSetId(e.target.value)}
              disabled={loading}
            >
              <MenuItem value="">不分类</MenuItem>
              {wordSets.map((ws) => (
                <MenuItem key={ws.id} value={ws.id}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <FolderIcon sx={{ color: ws.color, fontSize: 18 }} />
                    {ws.name} ({ws._count.words} 个单词)
                  </Box>
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          {selectedWordSet && (
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              单词将导入到「{selectedWordSet.name}」单词集
            </Typography>
          )}
        </Box>

        <TextField
          fullWidth
          multiline
          rows={10}
          placeholder={`ephemeral - lasting for a very short time
serendipity - the occurrence of events by chance
ubiquitous
ameliorate - to make something better`}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={loading}
          sx={{ mb: 2 }}
        />

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Button
            variant="contained"
            size="large"
            onClick={handleImport}
            disabled={loading || !input.trim()}
          >
            {loading ? '导入中...' : '开始导入'}
          </Button>
          <Typography variant="body2" color="text.secondary">
            共 {parseInput(input).length} 个单词待导入
          </Typography>
        </Box>

        {loading && (
          <Box sx={{ mt: 2 }}>
            <LinearProgress variant="determinate" value={progress} sx={{ mb: 1 }} />
            <Typography variant="body2" color="text.secondary">
              正在处理... {progress}%
            </Typography>
          </Box>
        )}
      </Paper>

      {results.length > 0 && (
        <Paper sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
            <Typography variant="h6">导入结果</Typography>
            {!loading && (
              <>
                <Chip
                  label={`成功 ${successCount}`}
                  color="success"
                  size="small"
                  icon={<SuccessIcon />}
                />
                {errorCount > 0 && (
                  <Chip
                    label={`失败 ${errorCount}`}
                    color="error"
                    size="small"
                    icon={<ErrorIcon />}
                  />
                )}
              </>
            )}
          </Box>

          <List dense sx={{ maxHeight: 400, overflow: 'auto' }}>
            {results.map((result, index) => (
              <ListItem key={index}>
                <ListItemIcon sx={{ minWidth: 36 }}>
                  {result.status === 'success' && <SuccessIcon color="success" />}
                  {result.status === 'error' && <ErrorIcon color="error" />}
                  {result.status === 'pending' && <PendingIcon color="disabled" />}
                </ListItemIcon>
                <ListItemText
                  primary={result.word}
                  secondary={result.message}
                  secondaryTypographyProps={{
                    color: result.status === 'error' ? 'error' : 'text.secondary',
                  }}
                />
              </ListItem>
            ))}
          </List>
        </Paper>
      )}
    </Box>
  )
}
