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
  Alert,
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
  LinearProgress,
  CircularProgress,
} from '@mui/material'
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  Folder as FolderIcon,
} from '@mui/icons-material'
import { getWordSets, createWordSet, updateWordSet, deleteWordSet } from '@/app/actions'

interface WordSet {
  id: string
  name: string
  description: string | null
  color: string
  isActive: boolean
  createdAt: Date
  _count: {
    words: number
  }
}

const PRESET_COLORS = [
  '#1976d2', // blue
  '#388e3c', // green
  '#f57c00', // orange
  '#d32f2f', // red
  '#7b1fa2', // purple
  '#0097a7', // cyan
  '#455a64', // blue-grey
  '#5d4037', // brown
]

export default function WordSetsPage() {
  const [wordSets, setWordSets] = useState<WordSet[]>([])
  const [loading, setLoading] = useState(true)
  const [openAdd, setOpenAdd] = useState(false)
  const [openEdit, setOpenEdit] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const [addFormData, setAddFormData] = useState({
    name: '',
    description: '',
    color: '#1976d2',
  })

  const [editFormData, setEditFormData] = useState<{
    id: string
    name: string
    description: string
    color: string
    isActive: boolean
  } | null>(null)

  useEffect(() => {
    loadWordSets()
  }, [])

  const loadWordSets = async () => {
    try {
      const data = await getWordSets()
      setWordSets(data as WordSet[])
    } catch (error) {
      console.error('Error loading word sets:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddSubmit = async () => {
    if (!addFormData.name.trim()) {
      setError('请输入单词集名称')
      return
    }

    setSubmitting(true)
    setError('')
    setSuccess('')

    const form = new FormData()
    form.append('name', addFormData.name)
    form.append('description', addFormData.description)
    form.append('color', addFormData.color)

    const result = await createWordSet(form)

    if (result.success) {
      setSuccess('单词集创建成功！')
      setAddFormData({ name: '', description: '', color: '#1976d2' })
      loadWordSets()
      setTimeout(() => {
        setOpenAdd(false)
        setSuccess('')
      }, 1000)
    } else {
      setError(result.error || '创建失败')
    }

    setSubmitting(false)
  }

  const handleEditOpen = (wordSet: WordSet) => {
    setEditFormData({
      id: wordSet.id,
      name: wordSet.name,
      description: wordSet.description || '',
      color: wordSet.color,
      isActive: wordSet.isActive,
    })
    setOpenEdit(true)
    setError('')
    setSuccess('')
  }

  const handleEditSubmit = async () => {
    if (!editFormData) return

    setSubmitting(true)
    setError('')

    const result = await updateWordSet(editFormData.id, {
      name: editFormData.name,
      description: editFormData.description || undefined,
      color: editFormData.color,
      isActive: editFormData.isActive,
    })

    if (result.success) {
      setSuccess('更新成功！')
      loadWordSets()
      setTimeout(() => {
        setOpenEdit(false)
        setSuccess('')
      }, 1000)
    } else {
      setError(result.error || '更新失败')
    }

    setSubmitting(false)
  }

  const handleDelete = async (wordSetId: string, name: string) => {
    if (deletingId) return

    if (confirm(`确定要删除单词集 "${name}" 吗？单词集内的单词不会被删除，但会变成未分类状态。`)) {
      setDeletingId(wordSetId)
      try {
        const result = await deleteWordSet(wordSetId)
        if (result.success) {
          loadWordSets()
        } else {
          alert(result.error || '删除失败')
        }
      } finally {
        setDeletingId(null)
      }
    }
  }

  if (loading) {
    return (
      <Box>
        <Typography variant="h4" fontWeight={600} gutterBottom>
          单词集管理
        </Typography>
        <LinearProgress />
      </Box>
    )
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4" fontWeight={600}>
          单词集管理
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
          新建单词集
        </Button>
      </Box>

      <Alert severity="info" sx={{ mb: 3 }}>
        单词集可以帮助你分类管理单词，例如按主题、难度、来源等分类。用户学习时可以选择特定的单词集进行学习。
      </Alert>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow sx={{ bgcolor: 'grey.50' }}>
              <TableCell>单词集</TableCell>
              <TableCell>描述</TableCell>
              <TableCell align="center">单词数</TableCell>
              <TableCell align="center">状态</TableCell>
              <TableCell align="right">操作</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {wordSets.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} align="center" sx={{ py: 4 }}>
                  <Typography color="text.secondary">暂无单词集，点击上方按钮创建</Typography>
                </TableCell>
              </TableRow>
            ) : (
              wordSets.map((wordSet) => (
                <TableRow key={wordSet.id} hover>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <FolderIcon sx={{ color: wordSet.color }} />
                      <Typography fontWeight={600}>{wordSet.name}</Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" color="text.secondary">
                      {wordSet.description || '-'}
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Chip label={wordSet._count.words} size="small" />
                  </TableCell>
                  <TableCell align="center">
                    <Chip
                      label={wordSet.isActive ? '启用' : '禁用'}
                      size="small"
                      color={wordSet.isActive ? 'success' : 'default'}
                    />
                  </TableCell>
                  <TableCell align="right">
                    <IconButton size="small" onClick={() => handleEditOpen(wordSet)} disabled={!!deletingId}>
                      <EditIcon fontSize="small" />
                    </IconButton>
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => handleDelete(wordSet.id, wordSet.name)}
                      disabled={!!deletingId}
                    >
                      {deletingId === wordSet.id ? (
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

      {/* Add Dialog */}
      <Dialog open={openAdd} onClose={() => !submitting && setOpenAdd(false)} maxWidth="sm" fullWidth>
        <DialogTitle>新建单词集</DialogTitle>
        <DialogContent>
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

          <TextField
            fullWidth
            label="名称"
            value={addFormData.name}
            onChange={(e) => setAddFormData({ ...addFormData, name: e.target.value })}
            margin="normal"
            disabled={submitting}
            placeholder="例如：GRE核心词汇、商务英语"
          />
          <TextField
            fullWidth
            label="描述（可选）"
            value={addFormData.description}
            onChange={(e) => setAddFormData({ ...addFormData, description: e.target.value })}
            margin="normal"
            multiline
            rows={2}
            disabled={submitting}
          />
          <Box sx={{ mt: 2 }}>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              选择颜色
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              {PRESET_COLORS.map((color) => (
                <Box
                  key={color}
                  onClick={() => !submitting && setAddFormData({ ...addFormData, color })}
                  sx={{
                    width: 32,
                    height: 32,
                    borderRadius: 1,
                    bgcolor: color,
                    cursor: submitting ? 'default' : 'pointer',
                    border: addFormData.color === color ? '3px solid #000' : '3px solid transparent',
                    '&:hover': submitting ? {} : { opacity: 0.8 },
                  }}
                />
              ))}
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenAdd(false)} disabled={submitting}>
            取消
          </Button>
          <Button variant="contained" onClick={handleAddSubmit} disabled={submitting}>
            {submitting ? '创建中...' : '创建'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={openEdit} onClose={() => !submitting && setOpenEdit(false)} maxWidth="sm" fullWidth>
        <DialogTitle>编辑单词集</DialogTitle>
        <DialogContent>
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

          {editFormData && (
            <>
              <TextField
                fullWidth
                label="名称"
                value={editFormData.name}
                onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                margin="normal"
                disabled={submitting}
              />
              <TextField
                fullWidth
                label="描述（可选）"
                value={editFormData.description}
                onChange={(e) => setEditFormData({ ...editFormData, description: e.target.value })}
                margin="normal"
                multiline
                rows={2}
                disabled={submitting}
              />
              <Box sx={{ mt: 2 }}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  选择颜色
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                  {PRESET_COLORS.map((color) => (
                    <Box
                      key={color}
                      onClick={() => !submitting && setEditFormData({ ...editFormData, color })}
                      sx={{
                        width: 32,
                        height: 32,
                        borderRadius: 1,
                        bgcolor: color,
                        cursor: submitting ? 'default' : 'pointer',
                        border: editFormData.color === color ? '3px solid #000' : '3px solid transparent',
                        '&:hover': submitting ? {} : { opacity: 0.8 },
                      }}
                    />
                  ))}
                </Box>
              </Box>
              <FormControlLabel
                control={
                  <Switch
                    checked={editFormData.isActive}
                    onChange={(e) => setEditFormData({ ...editFormData, isActive: e.target.checked })}
                    disabled={submitting}
                  />
                }
                label="启用状态"
                sx={{ mt: 2 }}
              />
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenEdit(false)} disabled={submitting}>
            取消
          </Button>
          <Button variant="contained" onClick={handleEditSubmit} disabled={submitting}>
            {submitting ? '保存中...' : '保存'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}
