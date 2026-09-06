import prisma from '@/lib/prisma'
import { requireAdmin } from '@/lib/cms/auth-helpers'

export async function listFormDefinitions() {
  return prisma.formDefinition.findMany({ orderBy: { createdAt: 'asc' } })
}

export async function getFormDefinition(slug) {
  return prisma.formDefinition.findUnique({ where: { slug: slug.toLowerCase() } })
}

export async function createFormDefinition(data) {
  const session = await requireAdmin()
  const doc = await prisma.formDefinition.create({
    data: {
      slug: data.slug.toLowerCase().trim(),
      title: data.title.trim(),
      fields: data.fields ?? [],
      successMessage: data.successMessage ?? '',
      buttonText: data.buttonText ?? 'Submit',
      isActive: data.isActive !== false,
      createdById: session.user.id,
      updatedById: session.user.id,
    },
  })
  return doc
}

export async function updateFormDefinition(slug, data) {
  const session = await requireAdmin()
  const existing = await prisma.formDefinition.findUnique({ where: { slug: slug.toLowerCase() } })
  if (!existing) throw new Error('FormDefinition not found')
  const doc = await prisma.formDefinition.update({
    where: { id: existing.id },
    data: {
      ...(data.title !== undefined ? { title: data.title.trim() } : {}),
      ...(data.fields !== undefined ? { fields: data.fields } : {}),
      ...(data.successMessage !== undefined ? { successMessage: data.successMessage } : {}),
      ...(data.buttonText !== undefined ? { buttonText: data.buttonText.trim() } : {}),
      ...(data.isActive !== undefined ? { isActive: Boolean(data.isActive) } : {}),
      updatedById: session.user.id,
    },
  })
  return doc
}

export async function deleteFormDefinition(slug) {
  await requireAdmin()
  const existing = await prisma.formDefinition.findUnique({ where: { slug: slug.toLowerCase() } })
  if (!existing) throw new Error('FormDefinition not found')
  // Prevent deleting forms that have submissions without explicit force
  const count = await prisma.formSubmission.count({ where: { formDefinitionId: existing.id } })
  if (count > 0) throw new Error(`Cannot delete — ${count} submission(s) exist. Deactivate instead.`)
  await prisma.formDefinition.delete({ where: { id: existing.id } })
  return { success: true }
}
