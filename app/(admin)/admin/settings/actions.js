'use server'

import { requireAdmin } from '@/lib/cms/auth-helpers'
import prisma from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import { changePasswordSchema } from '@/lib/cms/schemas'

export async function changePasswordAction(prevState, formData) {
  const session = await requireAdmin()

  const raw = {
    currentPassword: formData.get('currentPassword'),
    newPassword:     formData.get('newPassword'),
    confirmPassword: formData.get('confirmPassword'),
  }

  const parsed = changePasswordSchema.safeParse(raw)
  if (!parsed.success) {
    return { error: parsed.error.errors[0].message }
  }

  const user = await prisma.user.findUnique({ where: { id: session.user.id } })
  if (!user) return { error: 'User not found.' }

  const valid = await bcrypt.compare(parsed.data.currentPassword, user.passwordHash)
  if (!valid) return { error: 'Current password is incorrect.' }

  const hash = await bcrypt.hash(parsed.data.newPassword, 12)
  await prisma.user.update({ where: { id: user.id }, data: { passwordHash: hash } })

  await prisma.auditLog.create({
    data: { userId: user.id, action: 'CHANGE_PASSWORD', entityType: 'User', entityId: user.id },
  })

  return { success: true }
}
