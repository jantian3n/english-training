'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import {
  Container,
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  LinearProgress,
  Stack,
  Chip,
} from '@mui/material'
import {
  School as SchoolIcon,
  Timer as TimerIcon,
  CheckCircle as CheckIcon,
  Cancel as CancelIcon,
} from '@mui/icons-material'
import { getUserStats } from '@/app/actions'
import { signOut } from 'next-auth/react'

interface Stats {
  totalWords: number
  totalReviews: number
  correctCount: number
  incorrectCount: number
  dueToday: number
  accuracy: number
}

export default function DashboardPage() {
  const router = useRouter()
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadStats()
  }, [])

  const loadStats = async () => {
    try {
      const data = await getUserStats()
      setStats(data)
    } catch (error) {
      console.error('Error loading stats:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    await signOut({ callbackUrl: '/login' })
  }

  if (loading) {
    return (
      <Container>
        <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center' }}>
          <LinearProgress sx={{ width: '100%' }} />
        </Box>
      </Container>
    )
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 4 }}>
        {/* Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Typography variant="h3" fontWeight={600}>
            Dashboard
          </Typography>
          <Button variant="outlined" onClick={handleLogout}>
            Logout
          </Button>
        </Box>

        {/* Stats Cards */}
        <Grid container spacing={3} mb={4}>
          <Grid item xs={12} md={3}>
            <Card>
              <CardContent>
                <Stack spacing={1}>
                  <Box sx={{ display: 'flex', alignItems: 'center', color: 'primary.main' }}>
                    <SchoolIcon sx={{ mr: 1 }} />
                    <Typography variant="h4" fontWeight={600}>
                      {stats?.totalWords || 0}
                    </Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary">
                    Total Words Learning
                  </Typography>
                </Stack>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={3}>
            <Card>
              <CardContent>
                <Stack spacing={1}>
                  <Box sx={{ display: 'flex', alignItems: 'center', color: 'warning.main' }}>
                    <TimerIcon sx={{ mr: 1 }} />
                    <Typography variant="h4" fontWeight={600}>
                      {stats?.dueToday || 0}
                    </Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary">
                    Due Today
                  </Typography>
                </Stack>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={3}>
            <Card>
              <CardContent>
                <Stack spacing={1}>
                  <Box sx={{ display: 'flex', alignItems: 'center', color: 'success.main' }}>
                    <CheckIcon sx={{ mr: 1 }} />
                    <Typography variant="h4" fontWeight={600}>
                      {stats?.correctCount || 0}
                    </Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary">
                    Correct Answers
                  </Typography>
                </Stack>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={3}>
            <Card>
              <CardContent>
                <Stack spacing={1}>
                  <Box sx={{ display: 'flex', alignItems: 'center', color: 'error.main' }}>
                    <CancelIcon sx={{ mr: 1 }} />
                    <Typography variant="h4" fontWeight={600}>
                      {stats?.incorrectCount || 0}
                    </Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary">
                    Incorrect Answers
                  </Typography>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Accuracy Card */}
        <Card sx={{ mb: 4 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Overall Accuracy
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <Box sx={{ flex: 1, mr: 2 }}>
                <LinearProgress
                  variant="determinate"
                  value={stats?.accuracy || 0}
                  sx={{ height: 10, borderRadius: 5 }}
                />
              </Box>
              <Typography variant="h6" fontWeight={600}>
                {stats?.accuracy.toFixed(1)}%
              </Typography>
            </Box>
            <Typography variant="body2" color="text.secondary">
              {stats?.totalReviews || 0} total reviews completed
            </Typography>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <Card sx={{ bgcolor: 'primary.main', color: 'white' }}>
              <CardContent>
                <Typography variant="h5" gutterBottom fontWeight={600}>
                  Start Learning
                </Typography>
                <Typography variant="body2" sx={{ mb: 2, opacity: 0.9 }}>
                  {stats?.dueToday || 0} words are waiting for review
                </Typography>
                <Button
                  variant="contained"
                  size="large"
                  fullWidth
                  onClick={() => router.push('/learn')}
                  sx={{
                    bgcolor: 'white',
                    color: 'primary.main',
                    '&:hover': { bgcolor: 'grey.100' },
                  }}
                >
                  Begin Review
                </Button>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h5" gutterBottom fontWeight={600}>
                  Learning Streak
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Keep up the great work!
                </Typography>
                <Stack direction="row" spacing={1}>
                  <Chip label="🔥 Active Learner" color="warning" />
                  <Chip
                    label={`${stats?.totalWords || 0} Words`}
                    color="primary"
                    variant="outlined"
                  />
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </Container>
  )
}
