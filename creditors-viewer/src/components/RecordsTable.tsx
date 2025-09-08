"use client";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Pagination } from "@/components/Pagination";
import { credit_requirement } from "@/generated/prisma";
import { RecordInfo } from "@/components/RecordInfo";

export function RecordsTable({
  records,
  totalPages,
  currentPage,
}: {
  records: credit_requirement[];
  totalPages: number;
  currentPage: number;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const handlePageChange = (nextPage: number) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", nextPage.toString());
    router.push(`?${params.toString()}`);
  };

  return (
    <div className="flex flex-col gap-2">
      <Table className="w-full max-w-full">
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Ocherednost</TableHead>
            <TableHead>LLM Response</TableHead>
            <TableHead className="w-10 text-center">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {records.map((record) => (
            <TableRow key={record.id}>
              <TableCell>{record.id}</TableCell>
              <TableCell className="whitespace-normal">
                {record.name_creditor}
              </TableCell>
              <TableCell>
                <RecordInfo record={record} short />
              </TableCell>
              <TableCell className="whitespace-normal">
                {record.llm_response}
              </TableCell>
              <TableCell className="w-10 text-center">
                <Button asChild>
                  <Link href={`/records/${record.id}`}>View</Link>
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div className="flex flex-row justify-between items-center">
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />

        <div className="flex flex-row items-center gap-2">
          <p>Go to page:</p>
          <input
            type="number"
            className="w-32 border border-gray-300 rounded-md p-1"
            defaultValue={currentPage}
            min={1}
            max={totalPages}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                const nextPage = parseInt(e.currentTarget.value);
                if (nextPage >= 1 && nextPage <= totalPages) {
                  handlePageChange(nextPage);
                }
              }
            }}
          />
        </div>
      </div>
    </div>
  );
}
