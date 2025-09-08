"use server";

import { Prisma } from "@/generated/prisma";
import { prisma } from "@/lib/prisma";

const DEFAULT_PER_PAGE = 10;

export async function getRecords(params: { page?: number; perPage?: number }) {
  const page = params.page || 1;
  const perPage = params.perPage ?? DEFAULT_PER_PAGE;

  const whereClause: Prisma.credit_requirementWhereInput = {
    is_processed: 1,
    AND: [
      { ocherednost: { not: null } },
      { ocherednost: { not: "" } },
      { razmer: { not: null } },
      { razmer: { not: "" } },
      // { llm_response: { not: null } },
      // { llm_response: { not: "" } },
    ],
  };

  const [records, totalCount] = await Promise.all([
    prisma.credit_requirement.findMany({
      skip: (page - 1) * perPage,
      take: perPage,
      where: whereClause,
    }),

    prisma.credit_requirement.count({
      where: whereClause,
    }),
  ]);

  return {
    records,
    totalCount,
    currentPage: page,
    perPage,
    totalPages: Math.ceil(totalCount / perPage),
  };
}
