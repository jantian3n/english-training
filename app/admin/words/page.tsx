'use client'

import { useState, useEffect } from 'react'
import {
  Box,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Alert,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Chip,
  Switch,
  FormControlLabel,
  Tooltip,
  LinearProgress,
  FormControl,
  InputLabel,
  Select,
} from '@mui/material'
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  Folder as FolderIcon,
  Refresh as RefreshIcon,
} from '@mui/icons-material'
import {
  addWord,
  getWords,
  updateWord,
  deleteWord,
  getWordSets,
  getWordQuizOptions,
  updateQuizOption,
  deleteQuizOption,
  addQuizOption,
  regenerateQuizOptions,
} from '@/app/actions'

interface WordSet {
  id: string
  name: string
  color: string
  _count: { words: number }
}

interface Word {
  id: string
  word: string
  definition: string
  definitionCn: string
  pronunciation: string
  exampleSentence: string
  exampleCn: string
  difficulty: number
  isActive: boolean
  wordSetId: string | null
  wordSet: WordSet | null
  createdAt: Date
  _count: {
    quizOptions: number
  }
}

interface QuizOption {
  id: string
  wordId: string
  optionText: string
  isCorrect: boolean
  createdAt: Date
}

export default function WordsPage() {
  const [words, setWords] = useState<Word[]>([])
  const [wordSets, setWordSets] = useState<WordSet[]>([])
  const [loading, setLoading] = useState(true)
  const [openAdd, setOpenAdd] = useState(false)
  const [openEdit, setOpenEdit] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [filterWordSetId, setFilterWordSetId] = useState<string>('')

  // 干扰项相关状态
  const [quizOptions, setQuizOptions] = useState<QuizOption[]>([])
  const [loadingOptions, setLoadingOptions] = useState(false)
  const [regeneratingOptions, setRegeneratingOptions] = useState(false)
  const [newOptionText, setNewOptionText] = useState('')

  const [addFormData, setAddFormData] = useState({
    word: '',
    definition: '',
    difficulty: 1,
    wordSetId: '',
  })

  const [editFormData, setEditFormData] = useState<{
    id: string
    word: string
    definition: string
    definitionCn: string
    pronunciation: string
    exampleSentence: string
    exampleCn: string
    difficulty: number
    isActive: boolean
    wordSetId: string | null
  } | null>(null)

  useEffect(() => {
    loadData()
  }, [])

  useEffect(() => {
    loadWords()
  }, [filterWordSetId])

  const loadData = async () => {
    try {
      const [wordsData, wordSetsData] = await Promise.all([
        getWords(),
        getWordSets(),
      ])
      setWords(wordsData as Word[])
      setWordSets(wordSetsData as WordSet[])
    } catch (error) {
      console.error('Error loading data:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadWords = async () => {
    try {
      const data = await getWords(filterWordSetId || undefined)
      setWords(data as Word[])
    } catch (error) {
      console.error('Error loading words:', error)
    }
  }

  const handleAddSubmit = async () => {
    setSubmitting(true)
    setError('')
    setSuccess('')

    const form = new FormData()
    form.append('word', addFormData.word)
    form.append('definition', addFormData.definition)
    form.append('difficulty', addFormData.difficulty.toString())
    if (addFormData.wordSetId) {
      form.append('wordSetId', addFormData.wordSetId)
    }

    const result = await addWord(form)

    if (result.success) {
      setSuccess('单词添加成功，AI已自动生成内容！')
      setAddFormData({ word: '', definition: '', difficulty: 1, wordSetId: addFormData.wordSetId })
      loadWords()
      setTimeout(() => {
        setOpenAdd(false)
        setSuccess('')
      }, 1500)
    } else {
      setError(result.error || '添加单词失败')
    }

    setSubmitting(false)
  }

  const handleEditOpen = async (word: Word) => {
    setEditFormData({
      id: word.id,
      word: word.word,
      definition: word.definition,
      definitionCn: word.definitionCn,
      pronunciation: word.pronunciation,
      exampleSentence: word.exampleSentence,
      exampleCn: word.exampleCn,
      difficulty: word.difficulty,
      isActive: word.isActive,
      wordSetId: word.wordSetId,
    })
    setOpenEdit(true)
    setError('')
    setSuccess('')
    setNewOptionText('')

    // 加载干扰项
    setLoadingOptions(true)
    try {
      const options = await getWordQuizOptions(word.id)
      setQuizOptions(options as QuizOption[])
    } catch (error) {
      console.error('Error loading quiz options:', error)
      setQuizOptions([])
    } finally {
      setLoadingOptions(false)
    }
  }

  const handleEditSubmit = async () => {
    if (!editFormData) return

    setSubmitting(true)
    setError('')

    const result = await updateWord(editFormData.id, {
      word: editFormData.word,
      definition: editFormData.definition,
      definitionCn: editFormData.definitionCn,
      pronunciation: editFormData.pronunciation,
      exampleSentence: editFormData.exampleSentence,
      exampleCn: editFormData.exampleCn,
      difficulty: editFormData.difficulty,
      isActive: editFormData.isActive,
      wordSetId: editFormData.wordSetId,
    })

    if (result.success) {
      setSuccess('更新成功！')
      loadWords()
      setTimeout(() => {
        setOpenEdit(false)
        setSuccess('')
      }, 1000)
    } else {
      setError(result.error || '更新失败')
    }

    setSubmitting(false)
  }

  const handleDelete = async (wordId: string, wordText: string) => {
    if (deletingId) return

    if (confirm(`确定要删除单词 "${wordText}" 吗？此操作不可撤销。`)) {
      setDeletingId(wordId)
      try {
        const result = await deleteWord(wordId)
        if (result.success) {
          loadWords()
        } else {
          alert(result.error || '删除失败')
        }
      } finally {
        setDeletingId(null)
      }
    }
  }

  // 干扰项处理函数
  const handleUpdateOption = async (optionId: string, newText: string) => {
    const result = await updateQuizOption(optionId, newText)
    if (result.success) {
      setQuizOptions(quizOptions.map(opt =>
        opt.id === optionId ? { ...opt, optionText: newText } : opt
      ))
    }
  }

  const handleDeleteOption = async (optionId: string) => {
    const result = await deleteQuizOption(optionId)
    if (result.success) {
      setQuizOptions(quizOptions.filter(opt => opt.id !== optionId))
    }
  }

  const handleAddOption = async () => {
    if (!editFormData || !newOptionText.trim()) return

    const result = await addQuizOption(editFormData.id, newOptionText.trim())
    if (result.success && result.option) {
      setQuizOptions([...quizOptions, result.option as QuizOption])
      setNewOptionText('')
    }
  }

  const handleRegenerateOptions = async () => {
    if (!editFormData) return

    setRegeneratingOptions(true)
    try {
      const result = await regenerateQuizOptions(editFormData.id)
      if (result.success && result.options) {
        setQuizOptions(result.options as QuizOption[])
        setSuccess('干扰项已重新生成！')
      } else {
        setError(result.error || '重新生成失败')
      }
    } catch (error) {
      setError('重新生成失败')
    } finally {
      setRegeneratingOptions(false)
    }
  }

  if (loading) {
    return (
      <Box>
        <Typography variant="h4" fontWeight={600} gutterBottom>
          单词管理
        </Typography>
        <LinearProgress />
      </Box>
    )
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4" fontWeight={600}>
          单词管理
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => {
            setOpenAdd(true)
            setError('')
            setSuccess('')
          }}
        >
          添加单词
        </Button>
      </Box>

      <Box sx={{ display: 'flex', gap: 2, mb: 3, alignItems: 'center' }}>
        <FormControl size="small" sx={{ minWidth: 200 }}>
          <InputLabel>筛选单词集</InputLabel>
          <Select
            value={filterWordSetId}
            label="筛选单词集"
            onChange={(e) => setFilterWordSetId(e.target.value)}
          >
            <MenuItem value="">全部单词</MenuItem>
            <MenuItem value="none">未分类</MenuItem>
            {wordSets.map((ws) => (
              <MenuItem key={ws.id} value={ws.id}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <FolderIcon sx={{ color: ws.color, fontSize: 18 }} />
                  {ws.name} ({ws._count.words})
                </Box>
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <Alert severity="info" sx={{ flex: 1 }}>
          共 {words.length} 个单词。添加单词时，AI会自动生成例句、音标、中文释义和测验选项。
        </Alert>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow sx={{ bgcolor: 'grey.50' }}>
              <TableCell>单词</TableCell>
              <TableCell>单词集</TableCell>
              <TableCell>释义</TableCell>
              <TableCell>中文</TableCell>
              <TableCell align="center">难度</TableCell>
              <TableCell align="center">状态</TableCell>
              <TableCell align="right">操作</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {words.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                  <Typography color="text.secondary">暂无单词，点击上方按钮添加</Typography>
                </TableCell>
              </TableRow>
            ) : (
              words.map((word) => (
                <TableRow key={word.id} hover>
                  <TableCell>
                    <Typography fontWeight={600}>{word.word}</Typography>
                    {word.pronunciation && (
                      <Typography variant="caption" color="text.secondary">
                        {word.pronunciation}
                      </Typography>
                    )}
                  </TableCell>
                  <TableCell>
                    {word.wordSet ? (
                      <Chip
                        icon={<FolderIcon sx={{ color: `${word.wordSet.color} !important` }} />}
                        label={word.wordSet.name}
                        size="small"
                        variant="outlined"
                      />
                    ) : (
                      <Typography variant="body2" color="text.secondary">-</Typography>
                    )}
                  </TableCell>
                  <TableCell sx={{ maxWidth: 180 }}>
                    <Tooltip title={word.definition}>
                      <Typography
                        variant="body2"
                        sx={{
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {word.definition}
                      </Typography>
                    </Tooltip>
                  </TableCell>
                  <TableCell sx={{ maxWidth: 120 }}>
                    <Tooltip title={word.definitionCn}>
                      <Typography
                        variant="body2"
                        sx={{
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {word.definitionCn}
                      </Typography>
                    </Tooltip>
                  </TableCell>
                  <TableCell align="center">
                    <Chip
                      label={word.difficulty}
                      size="small"
                      color={
                        word.difficulty <= 2
                          ? 'success'
                          : word.difficulty <= 4
                            ? 'warning'
                            : 'error'
                      }
                    />
                  </TableCell>
                  <TableCell align="center">
                    <Chip
                      label={word.isActive ? '启用' : '禁用'}
                      size="small"
                      color={word.isActive ? 'success' : 'default'}
                    />
                  </TableCell>
                  <TableCell align="right">
                    <IconButton size="small" onClick={() => handleEditOpen(word)} disabled={!!deletingId}>
                      <EditIcon fontSize="small" />
                    </IconButton>
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => handleDelete(word.id, word.word)}
                      disabled={!!deletingId}
                    >
                      {deletingId === word.id ? (
                        <CircularProgress size={18} />
                      ) : (
                        <DeleteIcon fontSize="small" />
                      )}
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Add Word Dialog */}
      <Dialog open={openAdd} onClose={() => !submitting && setOpenAdd(false)} maxWidth="sm" fullWidth>
        <DialogTitle>添加新单词</DialogTitle>
        <DialogContent>
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

          <TextField
            fullWidth
            label="单词"
            value={addFormData.word}
            onChange={(e) => setAddFormData({ ...addFormData, word: e.target.value })}
            margin="normal"
            disabled={submitting}
          />
          <TextField
            fullWidth
            label="释义（英文）"
            value={addFormData.definition}
            onChange={(e) => setAddFormData({ ...addFormData, definition: e.target.value })}
            margin="normal"
            multiline
            rows={3}
            disabled={submitting}
          />
          <TextField
            fullWidth
            select
            label="单词集"
            value={addFormData.wordSetId}
            onChange={(e) => setAddFormData({ ...addFormData, wordSetId: e.target.value })}
            margin="normal"
            disabled={submitting}
          >
            <MenuItem value="">不分类</MenuItem>
            {wordSets.map((ws) => (
              <MenuItem key={ws.id} value={ws.id}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <FolderIcon sx={{ color: ws.color, fontSize: 18 }} />
                  {ws.name}
                </Box>
              </MenuItem>
            ))}
          </TextField>
          <TextField
            fullWidth
            select
            label="难度"
            value={addFormData.difficulty}
            onChange={(e) => setAddFormData({ ...addFormData, difficulty: parseInt(e.target.value) })}
            margin="normal"
            disabled={submitting}
          >
            {[1, 2, 3, 4, 5].map((level) => (
              <MenuItem key={level} value={level}>
                难度 {level}
              </MenuItem>
            ))}
          </TextField>

          {submitting && (
            <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
              <CircularProgress size={20} sx={{ mr: 2 }} />
              <Typography variant="body2" color="text.secondary">
                正在生成AI内容...
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenAdd(false)} disabled={submitting}>
            取消
          </Button>
          <Button variant="contained" onClick={handleAddSubmit} disabled={submitting}>
            {submitting ? '处理中...' : '添加单词'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Word Dialog */}
      <Dialog open={openEdit} onClose={() => !submitting && setOpenEdit(false)} maxWidth="md" fullWidth>
        <DialogTitle>编辑单词</DialogTitle>
        <DialogContent>
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

          {editFormData && (
            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2, mt: 1 }}>
              <TextField
                fullWidth
                label="单词"
                value={editFormData.word}
                onChange={(e) => setEditFormData({ ...editFormData, word: e.target.value })}
                disabled={submitting}
              />
              <TextField
                fullWidth
                label="音标"
                value={editFormData.pronunciation}
                onChange={(e) => setEditFormData({ ...editFormData, pronunciation: e.target.value })}
                disabled={submitting}
              />
              <TextField
                fullWidth
                label="英文释义"
                value={editFormData.definition}
                onChange={(e) => setEditFormData({ ...editFormData, definition: e.target.value })}
                multiline
                rows={2}
                disabled={submitting}
              />
              <TextField
                fullWidth
                label="中文释义"
                value={editFormData.definitionCn}
                onChange={(e) => setEditFormData({ ...editFormData, definitionCn: e.target.value })}
                multiline
                rows={2}
                disabled={submitting}
              />
              <TextField
                fullWidth
                label="例句"
                value={editFormData.exampleSentence}
                onChange={(e) => setEditFormData({ ...editFormData, exampleSentence: e.target.value })}
                multiline
                rows={2}
                disabled={submitting}
                sx={{ gridColumn: 'span 2' }}
              />
              <TextField
                fullWidth
                label="例句翻译"
                value={editFormData.exampleCn}
                onChange={(e) => setEditFormData({ ...editFormData, exampleCn: e.target.value })}
                multiline
                rows={2}
                disabled={submitting}
                sx={{ gridColumn: 'span 2' }}
              />
              <TextField
                fullWidth
                select
                label="单词集"
                value={editFormData.wordSetId || ''}
                onChange={(e) => setEditFormData({ ...editFormData, wordSetId: e.target.value || null })}
                disabled={submitting}
              >
                <MenuItem value="">不分类</MenuItem>
                {wordSets.map((ws) => (
                  <MenuItem key={ws.id} value={ws.id}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <FolderIcon sx={{ color: ws.color, fontSize: 18 }} />
                      {ws.name}
                    </Box>
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                fullWidth
                select
                label="难度"
                value={editFormData.difficulty}
                onChange={(e) =>
                  setEditFormData({ ...editFormData, difficulty: parseInt(e.target.value) })
                }
                disabled={submitting}
              >
                {[1, 2, 3, 4, 5].map((level) => (
                  <MenuItem key={level} value={level}>
                    难度 {level}
                  </MenuItem>
                ))}
              </TextField>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={editFormData.isActive}
                      onChange={(e) =>
                        setEditFormData({ ...editFormData, isActive: e.target.checked })
                      }
                      disabled={submitting}
                    />
                  }
                  label="启用状态"
                />
              </Box>

              {/* 干扰项编辑区 */}
              <Box sx={{ gridColumn: 'span 2', mt: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="subtitle1" fontWeight={600}>
                    测验选项（干扰项）
                  </Typography>
                  <Button
                    size="small"
                    startIcon={<RefreshIcon />}
                    onClick={handleRegenerateOptions}
                    disabled={regeneratingOptions || submitting}
                  >
                    {regeneratingOptions ? 'AI生成中...' : 'AI重新生成'}
                  </Button>
                </Box>

                {loadingOptions ? (
                  <Box sx={{ display: 'flex', justifyContent: 'center', py: 2 }}>
                    <CircularProgress size={24} />
                  </Box>
                ) : (
                  <>
                    {quizOptions.map((option, index) => (
                      <Box
                        key={option.id}
                        sx={{
                          display: 'flex',
                          gap: 1,
                          mb: 1,
                          alignItems: 'center',
                        }}
                      >
                        <Typography
                          variant="body2"
                          sx={{ minWidth: 60, color: 'text.secondary' }}
                        >
                          选项 {index + 1}:
                        </Typography>
                        <TextField
                          size="small"
                          fullWidth
                          value={option.optionText}
                          onChange={(e) => {
                            setQuizOptions(quizOptions.map(opt =>
                              opt.id === option.id ? { ...opt, optionText: e.target.value } : opt
                            ))
                          }}
                          onBlur={(e) => handleUpdateOption(option.id, e.target.value)}
                          disabled={submitting || regeneratingOptions}
                        />
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => handleDeleteOption(option.id)}
                          disabled={submitting || regeneratingOptions || quizOptions.length <= 1}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Box>
                    ))}

                    {quizOptions.length < 3 && (
                      <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
                        <TextField
                          size="small"
                          fullWidth
                          placeholder="输入新的干扰项..."
                          value={newOptionText}
                          onChange={(e) => setNewOptionText(e.target.value)}
                          disabled={submitting || regeneratingOptions}
                        />
                        <Button
                          variant="outlined"
                          size="small"
                          onClick={handleAddOption}
                          disabled={!newOptionText.trim() || submitting || regeneratingOptions}
                        >
                          添加
                        </Button>
                      </Box>
                    )}

                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
                      学习时将显示：正确答案 + 以上{quizOptions.length}个干扰项（共{quizOptions.length + 1}个选项）
                    </Typography>
                  </>
                )}
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenEdit(false)} disabled={submitting}>
            取消
          </Button>
          <Button variant="contained" onClick={handleEditSubmit} disabled={submitting}>
            {submitting ? '保存中...' : '保存修改'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}
