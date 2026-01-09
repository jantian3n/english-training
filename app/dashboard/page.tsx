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
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Avatar,
} from '@mui/material'
import {
  School as SchoolIcon,
  Timer as TimerIcon,
  CheckCircle as CheckIcon,
  Cancel as CancelIcon,
  EmojiEvents as TrophyIcon,
} from '@mui/icons-material'
import { getUserStats, getLeaderboard } from '@/app/actions'

interface Stats {
  totalWords: number
  totalReviews: number
  correctCount: number
  incorrectCount: number
  dueToday: number
  accuracy: number
}

interface LeaderboardEntry {
  id: string
  name: string
  totalReviews: number
  correctCount: number
  accuracy: number
  wordsLearned: number
}

export default function DashboardPage() {
  const router = useRouter()
  const [stats, setStats] = useState<Stats | null>(null)
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadStats()
    loadLeaderboard()
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

  const loadLeaderboard = async () => {
    try {
      const data = await getLeaderboard()
      setLeaderboard(data)
    } catch (error) {
      console.error('Error loading leaderboard:', error)
    }
  }

  if (loading) {
    return (
      <Container>
        <Box sx={{ minHeight: '80vh', display: 'flex', alignItems: 'center' }}>
          <LinearProgress sx={{ width: '100%' }} />
        </Box>
      </Container>
    )
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 4 }}>
        {/* Page Title */}
        <Typography variant="h4" fontWeight={600} mb={4}>
          学习中心
        </Typography>

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
                    学习中的单词
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
                    今日待复习
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
                    回答正确
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
                    回答错误
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
              总体正确率
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
              已完成 {stats?.totalReviews || 0} 次复习
            </Typography>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <Card sx={{ bgcolor: 'primary.main', color: 'white' }}>
              <CardContent>
                <Typography variant="h5" gutterBottom fontWeight={600}>
                  开始学习
                </Typography>
                <Typography variant="body2" sx={{ mb: 2, opacity: 0.9 }}>
                  有 {stats?.dueToday || 0} 个单词等待复习
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
                  开始复习
                </Button>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h5" gutterBottom fontWeight={600}>
                  学习进度
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  继续保持！
                </Typography>
                <Stack direction="row" spacing={1}>
                  <Chip label="🔥 活跃学习者" color="warning" />
                  <Chip
                    label={`${stats?.totalWords || 0} 个单词`}
                    color="primary"
                    variant="outlined"
                  />
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Leaderboard */}
        <Card sx={{ mt: 4 }}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <TrophyIcon sx={{ color: 'warning.main', mr: 1, fontSize: 28 }} />
              <Typography variant="h5" fontWeight={600}>
                学习排行榜
              </Typography>
            </Box>
            <TableContainer component={Paper} variant="outlined">
              <Table>
                <TableHead>
                  <TableRow sx={{ bgcolor: 'grey.50' }}>
                    <TableCell width={60}>排名</TableCell>
                    <TableCell>用户</TableCell>
                    <TableCell align="center">学习单词</TableCell>
                    <TableCell align="center">复习次数</TableCell>
                    <TableCell align="center">正确率</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {leaderboard.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} align="center" sx={{ py: 4 }}>
                        <Typography color="text.secondary">
                          暂无排名数据，快来成为第一名！
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ) : (
                    leaderboard.map((entry, index) => (
                      <TableRow key={entry.id} hover>
                        <TableCell>
                          {index < 3 ? (
                            <Avatar
                              sx={{
                                width: 28,
                                height: 28,
                                bgcolor:
                                  index === 0
                                    ? 'warning.main'
                                    : index === 1
                                      ? 'grey.400'
                                      : 'warning.dark',
                                fontSize: 14,
                              }}
                            >
                              {index + 1}
                            </Avatar>
                          ) : (
                            <Typography variant="body2" color="text.secondary" sx={{ pl: 1 }}>
                              {index + 1}
                            </Typography>
                          )}
                        </TableCell>
                        <TableCell>
                          <Typography fontWeight={index < 3 ? 600 : 400}>
                            {entry.name}
                          </Typography>
                        </TableCell>
                        <TableCell align="center">{entry.wordsLearned}</TableCell>
                        <TableCell align="center">{entry.totalReviews}</TableCell>
                        <TableCell align="center">
                          <Chip
                            label={`${entry.accuracy}%`}
                            size="small"
                            color={
                              entry.accuracy >= 80
                                ? 'success'
                                : entry.accuracy >= 60
                                  ? 'warning'
                                  : 'default'
                            }
                          />
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      </Box>
    </Container>
  )
}
