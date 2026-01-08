import { redirect } from 'next/navigation'
import { auth } from '@/auth'
import { Role } from '@prisma/client'
import { Container, Typography, Box, AppBar, Toolbar, Button } from '@mui/material'
import Link from 'next/link'
import { signOut } from '@/auth'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth()

  if (!session) {
    redirect('/login')
  }

  if (session.user.role !== Role.ADMIN) {
    redirect('/learn')
  }

  return (
    <Box>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Admin Panel
          </Typography>
          <Button color="inherit" component={Link} href="/admin/users">
            Users
          </Button>
          <Button color="inherit" component={Link} href="/admin/words">
            Words
          </Button>
          <Button color="inherit" component={Link} href="/learn">
            Learn
          </Button>
          <form
            action={async () => {
              'use server'
              await signOut()
            }}
          >
            <Button type="submit" color="inherit">
              Logout
            </Button>
          </form>
        </Toolbar>
      </AppBar>
      <Container sx={{ py: 4 }}>{children}</Container>
    </Box>
  )
}
