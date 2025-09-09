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
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Pagination } from "@/components/Pagination";
import { credit_requirement } from "@/generated/prisma";
import { RecordInfo } from "@/components/RecordInfo";
import { LLMResponse } from "@/components/LLMResponse";

export function RecordsTable({
  records,
  totalPages,
  currentPage,
  filterNotMatching,
}: {
  records: credit_requirement[];
  totalPages: number;
  currentPage: number;
  filterNotMatching: boolean;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handlePageChange = (nextPage: number) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", nextPage.toString());
    router.push(`?${params.toString()}`);
  };

  const handleFilterNotMatchingChange = (checked: boolean) => {
    const params = new URLSearchParams(searchParams);
    if (checked) {
      params.set("filterNotMatching", "true");
    } else {
      params.delete("filterNotMatching");
    }
    router.push(`?${params.toString()}`);
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-row items-center gap-2">
        <Checkbox
          id="filter-not-matching"
          defaultChecked={filterNotMatching}
          onCheckedChange={handleFilterNotMatchingChange}
        />
        <Label htmlFor="filter-not-matching">
          Показать только несоответствующие
        </Label>
      </div>

      <Table className="w-full max-w-full">
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Имя кредитора</TableHead>
            <TableHead>Оригинальная очередность</TableHead>
            <TableHead>Ответ LLM</TableHead>
            <TableHead />
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
                {record.llm_response ? (
                  <LLMResponse response={record.llm_response} short />
                ) : (
                  <span className="italic">Отсутствует</span>
                )}
              </TableCell>
              <TableCell className="w-10 text-center">
                <Button asChild>
                  <Link href={`/records/${record.id}`}>Просмотр</Link>
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
          <p>Перейти на страницу:</p>
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
