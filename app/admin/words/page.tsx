'use client'

import { useState } from 'react'
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
} from '@mui/material'
import { addWord } from '@/app/actions'

export default function WordsPage() {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const [formData, setFormData] = useState({
    word: '',
    definition: '',
    difficulty: 1,
  })

  const handleSubmit = async () => {
    setLoading(true)
    setError('')
    setSuccess('')

    const form = new FormData()
    form.append('word', formData.word)
    form.append('definition', formData.definition)
    form.append('difficulty', formData.difficulty.toString())

    const result = await addWord(form)

    if (result.success) {
      setSuccess('单词添加成功，AI已自动生成内容！')
      setFormData({ word: '', definition: '', difficulty: 1 })
      setTimeout(() => {
        setOpen(false)
        setSuccess('')
      }, 2000)
    } else {
      setError(result.error || '添加单词失败')
    }

    setLoading(false)
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4" fontWeight={600}>
          单词管理
        </Typography>
        <Button variant="contained" onClick={() => setOpen(true)}>
          添加单词
        </Button>
      </Box>

      <Alert severity="info">
        添加单词时，AI会自动生成：
        <ul>
          <li>例句及中文翻译</li>
          <li>音标（IPA格式）</li>
          <li>中文释义</li>
          <li>测验干扰项</li>
        </ul>
      </Alert>

      <Dialog open={open} onClose={() => !loading && setOpen(false)} maxWidth="sm" fullWidth>
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
            value={formData.word}
            onChange={(e) => setFormData({ ...formData, word: e.target.value })}
            margin="normal"
            disabled={loading}
          />
          <TextField
            fullWidth
            label="释义（英文）"
            value={formData.definition}
            onChange={(e) => setFormData({ ...formData, definition: e.target.value })}
            margin="normal"
            multiline
            rows={3}
            disabled={loading}
          />
          <TextField
            fullWidth
            select
            label="难度"
            value={formData.difficulty}
            onChange={(e) => setFormData({ ...formData, difficulty: parseInt(e.target.value) })}
            margin="normal"
            disabled={loading}
          >
            {[1, 2, 3, 4, 5].map((level) => (
              <MenuItem key={level} value={level}>
                难度 {level}
              </MenuItem>
            ))}
          </TextField>

          {loading && (
            <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
              <CircularProgress size={20} sx={{ mr: 2 }} />
              <Typography variant="body2" color="text.secondary">
                正在生成AI内容...
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)} disabled={loading}>
            取消
          </Button>
          <Button variant="contained" onClick={handleSubmit} disabled={loading}>
            {loading ? '处理中...' : '添加单词'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}
