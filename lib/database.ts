import type { Blob, Branch, Mark, User } from '@prisma/client'
import { Prisma, PrismaClient } from '@prisma/client'

declare global {
    // eslint-disable-next-line no-var
    var prisma: PrismaClient | undefined
}

export type PrismaUser = User
export type PrismaBlobLite = Blob
export type PrismaBranch = Branch
export type PrismBranchWithChildren = PrismaBranch & { children: Branch[] }
export type PrismaMark = Mark
export type PrismaBlob = PrismaBlobLite & { initiator: PrismaUser; branch: PrismaBranch; marks: PrismaMark[] }

export const PrismaClientKnownRequestError = Prisma.PrismaClientKnownRequestError

export const Database: PrismaClient = global.prisma ? global.prisma : (global.prisma = new PrismaClient())
