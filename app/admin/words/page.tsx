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
      setSuccess('Word added successfully with AI-generated content!')
      setFormData({ word: '', definition: '', difficulty: 1 })
      setTimeout(() => {
        setOpen(false)
        setSuccess('')
      }, 2000)
    } else {
      setError(result.error || 'Failed to add word')
    }

    setLoading(false)
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4" fontWeight={600}>
          Word Management
        </Typography>
        <Button variant="contained" onClick={() => setOpen(true)}>
          Add Word
        </Button>
      </Box>

      <Alert severity="info">
        When you add a word, AI will automatically generate:
        <ul>
          <li>Example sentence with Chinese translation</li>
          <li>Pronunciation (IPA notation)</li>
          <li>Chinese definition</li>
          <li>Quiz distractor options</li>
        </ul>
      </Alert>

      <Dialog open={open} onClose={() => !loading && setOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Add New Word</DialogTitle>
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
            label="Word"
            value={formData.word}
            onChange={(e) => setFormData({ ...formData, word: e.target.value })}
            margin="normal"
            disabled={loading}
          />
          <TextField
            fullWidth
            label="Definition (English)"
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
            label="Difficulty"
            value={formData.difficulty}
            onChange={(e) => setFormData({ ...formData, difficulty: parseInt(e.target.value) })}
            margin="normal"
            disabled={loading}
          >
            {[1, 2, 3, 4, 5].map((level) => (
              <MenuItem key={level} value={level}>
                Level {level}
              </MenuItem>
            ))}
          </TextField>

          {loading && (
            <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
              <CircularProgress size={20} sx={{ mr: 2 }} />
              <Typography variant="body2" color="text.secondary">
                Generating AI content...
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)} disabled={loading}>
            Cancel
          </Button>
          <Button variant="contained" onClick={handleSubmit} disabled={loading}>
            {loading ? 'Processing...' : 'Add Word'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}
