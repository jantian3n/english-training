import { PrismaClient, Role } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // Create admin user
  const hashedPassword = await bcrypt.hash(
    process.env.ADMIN_PASSWORD || 'admin123',
    10
  )

  const admin = await prisma.user.upsert({
    where: { email: process.env.ADMIN_EMAIL || 'admin@example.com' },
    update: {},
    create: {
      email: process.env.ADMIN_EMAIL || 'admin@example.com',
      name: 'Admin User',
      password: hashedPassword,
      role: Role.ADMIN,
    },
  })

  console.log('✅ Created admin user:', admin.email)

  // Create sample user
  const userPassword = await bcrypt.hash('user123', 10)
  const user = await prisma.user.upsert({
    where: { email: 'user@example.com' },
    update: {},
    create: {
      email: 'user@example.com',
      name: 'Test User',
      password: userPassword,
      role: Role.USER,
    },
  })

  console.log('✅ Created test user:', user.email)

  // Create sample words
  const sampleWords = [
    {
      word: 'ephemeral',
      pronunciation: '/ɪˈfɛm(ə)rəl/',
      definition: 'lasting for a very short time',
      definitionCn: '短暂的；瞬息的',
      exampleSentence: 'The beauty of cherry blossoms is ephemeral, lasting only a few weeks each spring.',
      exampleCn: '樱花的美丽是短暂的，每年春天只持续几周。',
      difficulty: 3,
    },
    {
      word: 'serendipity',
      pronunciation: '/ˌsɛrənˈdɪpɪti/',
      definition: 'the occurrence of events by chance in a happy or beneficial way',
      definitionCn: '意外发现珍奇事物的本领；有意外收获',
      exampleSentence: 'Finding that rare book in a small bookstore was pure serendipity.',
      exampleCn: '在一家小书店发现那本稀有书籍纯属意外之喜。',
      difficulty: 4,
    },
    {
      word: 'ubiquitous',
      pronunciation: '/juːˈbɪkwɪtəs/',
      definition: 'present, appearing, or found everywhere',
      definitionCn: '无处不在的；普遍存在的',
      exampleSentence: 'Smartphones have become ubiquitous in modern society.',
      exampleCn: '智能手机在现代社会已经无处不在。',
      difficulty: 3,
    },
  ]

  for (const wordData of sampleWords) {
    const word = await prisma.word.upsert({
      where: { word: wordData.word },
      update: {},
      create: wordData,
    })
    console.log('✅ Created word:', word.word)
  }

  console.log('🎉 Seeding completed!')
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
