import type { Prisma, PrismaClient } from '@prisma/client';
import prisma from '../prisma';

const tagCreate = async (
  tags: string[],
  client: PrismaClient | Prisma.TransactionClient = prisma,
) => {
  const normalizedTags = [
    ...new Set(tags.map((tag) => tag.trim().toLowerCase())),
  ]; // unique & normalized

  // Find existing tags by title
  const existingTags = await client.tag.findMany({
    where: { title: { in: normalizedTags } },
  });

  const existingTagTitles = new Set(existingTags.map((tag) => tag.title));

  // Filter missing tags
  const missingTagTitles = normalizedTags.filter(
    (title) => !existingTagTitles.has(title),
  );

  // Bulk create missing tags (skip if none)
  if (missingTagTitles.length > 0) {
    await client.tag.createMany({
      data: missingTagTitles.map((title) => ({ title })),
    });
  }

  // Fetch all tags again including the newly created ones
  const allTags = await client.tag.findMany({
    where: { title: { in: normalizedTags } },
  });

  return allTags.map((tag) => tag.id);
};

export default tagCreate;
