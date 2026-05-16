import { PrismaClient, Role, PostType } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Admin user
  const existingUser = await prisma.user.findUnique({
    where: { email: 'gvcs.gvsd@gmail.com' },
  })

  let admin
  if (existingUser) {
    console.log('✓ Admin user already exists')
    admin = existingUser
  } else {
    admin = await prisma.user.create({
      data: {
        email: 'gvcs.gvsd@gmail.com',
        name: 'Admin User',
        role: Role.ADMIN,
        googleId: null,
      },
    })
    console.log('✓ Created admin user')
  }

  // Club code
  const existingCode = await prisma.clubCode.findUnique({
    where: { code: 'GVCS2627' },
  })

  if (existingCode) {
    console.log('✓ Club code already exists')
  } else {
    await prisma.clubCode.create({
      data: {
        code: 'GVCS2627',
        year: '2026-2027',
        active: true,
      },
    })
    console.log('✓ Created club code GVCS2627')
  }

  // Posts
  const existingPosts = await prisma.post.findMany({
    where: { authorId: admin.id },
  })

  if (existingPosts.length > 0) {
    console.log('✓ Posts already exist')
  } else {
    await prisma.post.createMany({
      data: [
        {
          title: 'Welcome to GVCS Club — First Meeting Recap',
          content:
            "We kicked off the year with 45 students attending our first meeting! We covered the year's roadmap, introduced officer roles, and ran a quick Python challenge. See you next Thursday!",
          postType: PostType.MEETING,
          eventDate: null,
          authorId: admin.id,
        },
        {
          title: 'Fall Hackathon 2026 — Register Now',
          content:
            'Our annual hackathon is back! Teams of 2–4 students will have 2-3 hours to solve programming problems ranging from difficulties (beginner-difficult). Prizes, food, and fun guaranteed. Sign up at the link in bio.',
          postType: PostType.EVENT,
          eventDate: new Date('2026-10-15'),
          authorId: admin.id,
        },
      ],
    })
    console.log('✓ Created 2 posts')
  }

  // Site content
  const siteContentData = [
    { key: 'hero_title', value: 'Build the future with code' },
    { key: 'hero_subtitle', value: 'Join GVCS Club where students learn programming, build projects, and compete in hackathons together' },
    { key: 'hero_badge_text', value: 'Active club · 50+ members' },
    { key: 'hero_cta_primary', value: 'Join the club' },
    { key: 'hero_cta_secondary', value: 'View projects' },
    { key: 'about_title', value: 'About CS Club' },
    { key: 'about_text', value: "We're a community of students passionate about computer science and technology. Join us to learn, build, and compete!" },
    { key: 'meeting_time', value: 'Thursdays at 3:30 PM' },
    { key: 'meeting_location', value: 'Room 204' },
    { key: 'contact_email', value: 'csclub@gvhs.org' },
    { key: 'stat_members', value: '50+' },
    { key: 'stat_projects', value: '30+' },
    { key: 'stat_events', value: '15' },
  ]

  const existingContent = await prisma.siteContent.findMany()

  if (existingContent.length > 0) {
    console.log('✓ Site content already exists')
  } else {
    await prisma.siteContent.createMany({ data: siteContentData })
    console.log('✓ Created 13 site content keys')
  }
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
