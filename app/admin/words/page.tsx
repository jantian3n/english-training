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
} from '@mui/material'
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
} from '@mui/icons-material'
import { addWord, getWords, updateWord, deleteWord } from '@/app/actions'

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
  createdAt: Date
  _count: {
    quizOptions: number
  }
}

export default function WordsPage() {
  const [words, setWords] = useState<Word[]>([])
  const [loading, setLoading] = useState(true)
  const [openAdd, setOpenAdd] = useState(false)
  const [openEdit, setOpenEdit] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const [addFormData, setAddFormData] = useState({
    word: '',
    definition: '',
    difficulty: 1,
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
  } | null>(null)

  useEffect(() => {
    loadWords()
  }, [])

  const loadWords = async () => {
    try {
      const data = await getWords()
      setWords(data as Word[])
    } catch (error) {
      console.error('Error loading words:', error)
    } finally {
      setLoading(false)
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

    const result = await addWord(form)

    if (result.success) {
      setSuccess('单词添加成功，AI已自动生成内容！')
      setAddFormData({ word: '', definition: '', difficulty: 1 })
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

  const handleEditOpen = (word: Word) => {
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
    })
    setOpenEdit(true)
    setError('')
    setSuccess('')
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
    if (confirm(`确定要删除单词 "${wordText}" 吗？此操作不可撤销。`)) {
      const result = await deleteWord(wordId)
      if (result.success) {
        loadWords()
      } else {
        alert(result.error || '删除失败')
      }
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

      <Alert severity="info" sx={{ mb: 3 }}>
        共 {words.length} 个单词。添加单词时，AI会自动生成例句、音标、中文释义和测验选项。
      </Alert>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow sx={{ bgcolor: 'grey.50' }}>
              <TableCell>单词</TableCell>
              <TableCell>释义</TableCell>
              <TableCell>中文</TableCell>
              <TableCell align="center">难度</TableCell>
              <TableCell align="center">选项数</TableCell>
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
                  <TableCell sx={{ maxWidth: 200 }}>
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
                  <TableCell sx={{ maxWidth: 150 }}>
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
                  <TableCell align="center">{word._count.quizOptions}</TableCell>
                  <TableCell align="center">
                    <Chip
                      label={word.isActive ? '启用' : '禁用'}
                      size="small"
                      color={word.isActive ? 'success' : 'default'}
                    />
                  </TableCell>
                  <TableCell align="right">
                    <IconButton size="small" onClick={() => handleEditOpen(word)}>
                      <EditIcon fontSize="small" />
                    </IconButton>
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => handleDelete(word.id, word.word)}
                    >
                      <DeleteIcon fontSize="small" />
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
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          {success && (
            <Alert severity="success" sx={{ mb: 2 }}>
              {success}
            </Alert>
          )}

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
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          {success && (
            <Alert severity="success" sx={{ mb: 2 }}>
              {success}
            </Alert>
          )}

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
