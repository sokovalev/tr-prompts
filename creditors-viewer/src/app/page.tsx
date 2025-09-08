import { getRecords } from "./actions";
import { RecordsTable } from "@/components/RecordsTable";

export default async function RecordsPage({
  searchParams,
}: {
  searchParams: {
    page: string;
  };
}) {
  const { page } = await searchParams;
  const { records, totalPages, currentPage, totalCount } = await getRecords({
    page: parseInt(page),
  });

  return (
    <div className="p-4">
      <header>
        <h1 className="text-2xl font-bold mb-4">Creditors Viewer</h1>
      </header>
      <main className="flex flex-col gap-4">
        <RecordsTable
          records={records}
          totalPages={totalPages}
          currentPage={currentPage}
        />
        <p className="text-sm text-gray-500 text-center">Total: {totalCount}</p>
      </main>
    </div>
  );
}

export const dynamic = "force-dynamic";
