import { redirect } from 'next/navigation'
import { auth } from '@/auth'
import { Role } from '@prisma/client'
import { Container, Box, Tabs, Tab, Paper } from '@mui/material'
import Link from 'next/link'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth()

  if (!session) {
    redirect('/login')
  }

  if (session.user.role !== Role.ADMIN) {
    redirect('/dashboard')
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Paper sx={{ mb: 3 }}>
        <Tabs value={false} variant="fullWidth">
          <Tab label="用户管理" component={Link} href="/admin/users" />
          <Tab label="单词管理" component={Link} href="/admin/words" />
          <Tab label="批量导入" component={Link} href="/admin/import" />
        </Tabs>
      </Paper>
      <Box>{children}</Box>
    </Container>
  )
}
