'use client'

import { useState, useEffect } from 'react'
import {
  Box,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  IconButton,
  Chip,
} from '@mui/material'
import { Delete as DeleteIcon, VpnKey as KeyIcon } from '@mui/icons-material'
import { getUsers, createUser, deleteUser, resetPassword } from '@/app/actions'
import { Role } from '@prisma/client'

interface User {
  id: string
  email: string
  name: string | null
  role: Role
  createdAt: Date
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [openCreate, setOpenCreate] = useState(false)
  const [openResetPwd, setOpenResetPwd] = useState(false)
  const [selectedUserId, setSelectedUserId] = useState<string>('')

  const [formData, setFormData] = useState<{
    email: string
    name: string
    password: string
    role: Role
  }>({
    email: '',
    name: '',
    password: '',
    role: Role.USER,
  })

  const [newPassword, setNewPassword] = useState('')

  useEffect(() => {
    loadUsers()
  }, [])

  const loadUsers = async () => {
    const data = await getUsers()
    setUsers(data)
  }

  const handleCreateUser = async () => {
    const form = new FormData()
    form.append('email', formData.email)
    form.append('name', formData.name)
    form.append('password', formData.password)
    form.append('role', formData.role)

    await createUser(form)
    setOpenCreate(false)
    setFormData({ email: '', name: '', password: '', role: Role.USER })
    loadUsers()
  }

  const handleDeleteUser = async (userId: string) => {
    if (confirm('确定要删除这个用户吗？')) {
      await deleteUser(userId)
      loadUsers()
    }
  }

  const handleResetPassword = async () => {
    await resetPassword(selectedUserId, newPassword)
    setOpenResetPwd(false)
    setNewPassword('')
    setSelectedUserId('')
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4" fontWeight={600}>
          用户管理
        </Typography>
        <Button variant="contained" onClick={() => setOpenCreate(true)}>
          添加用户
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>邮箱</TableCell>
              <TableCell>姓名</TableCell>
              <TableCell>角色</TableCell>
              <TableCell>创建时间</TableCell>
              <TableCell align="right">操作</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.name}</TableCell>
                <TableCell>
                  <Chip
                    label={user.role === Role.ADMIN ? '管理员' : '用户'}
                    color={user.role === Role.ADMIN ? 'primary' : 'default'}
                    size="small"
                  />
                </TableCell>
                <TableCell>{new Date(user.createdAt).toLocaleDateString()}</TableCell>
                <TableCell align="right">
                  <IconButton
                    size="small"
                    onClick={() => {
                      setSelectedUserId(user.id)
                      setOpenResetPwd(true)
                    }}
                  >
                    <KeyIcon />
                  </IconButton>
                  <IconButton size="small" color="error" onClick={() => handleDeleteUser(user.id)}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Create User Dialog */}
      <Dialog open={openCreate} onClose={() => setOpenCreate(false)} maxWidth="sm" fullWidth>
        <DialogTitle>创建新用户</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="邮箱"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            margin="normal"
          />
          <TextField
            fullWidth
            label="姓名"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            margin="normal"
          />
          <TextField
            fullWidth
            label="密码"
            type="password"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            margin="normal"
          />
          <TextField
            fullWidth
            select
            label="角色"
            value={formData.role}
            onChange={(e) => setFormData({ ...formData, role: e.target.value as Role })}
            margin="normal"
          >
            <MenuItem value={Role.USER}>用户</MenuItem>
            <MenuItem value={Role.ADMIN}>管理员</MenuItem>
          </TextField>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenCreate(false)}>取消</Button>
          <Button variant="contained" onClick={handleCreateUser}>
            创建
          </Button>
        </DialogActions>
      </Dialog>

      {/* Reset Password Dialog */}
      <Dialog open={openResetPwd} onClose={() => setOpenResetPwd(false)} maxWidth="sm" fullWidth>
        <DialogTitle>重置密码</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="新密码"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            margin="normal"
            autoFocus
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenResetPwd(false)}>取消</Button>
          <Button variant="contained" onClick={handleResetPassword}>
            重置
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}
