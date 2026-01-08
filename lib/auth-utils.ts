import { auth } from '@/auth'
import { Role } from '@prisma/client'

export async function requireAuth() {
  const session = await auth()
  if (!session?.user) {
    throw new Error('Unauthorized')
  }
  return session
}

export async function requireAdmin() {
  const session = await requireAuth()
  if (session.user.role !== Role.ADMIN) {
    throw new Error('Forbidden: Admin access required')
  }
  return session
}
