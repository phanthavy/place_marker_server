const {PrismaClient} = require('@prisma/client')

const globalPrisma = globalThis as typeof globalThis & {prisma?: InstanceType<typeof PrismaClient>}

const prisma = globalPrisma.prisma ?? new PrismaClient()

if (process.env.NODE_ENV !== 'production') {
    globalPrisma.prisma = prisma
}

module.exports = prisma
