"use server";

import { prisma } from "@/lib/prisma";

export async function getRecord(recordId: number) {
  const record = await prisma.credit_requirement.findUnique({
    where: { id: recordId },
  });
  return record;
}
