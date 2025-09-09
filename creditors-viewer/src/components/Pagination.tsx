import {
  Pagination as PaginationComponent,
  PaginationContent,
  PaginationItem,
  PaginationPrevious,
  PaginationNext,
} from "@/components/ui/pagination";

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}) {
  return (
    <PaginationComponent className="flex-shrink-1 w-auto mx-0">
      <PaginationContent className="flex flex-row items-center gap-2">
        <PaginationItem>
          <PaginationPrevious
            onClick={() => currentPage > 1 && onPageChange(currentPage - 1)}
          >
            Пред.
          </PaginationPrevious>
        </PaginationItem>
        <PaginationItem className="text-sm">
          Страница {currentPage} из {totalPages}
        </PaginationItem>

        <PaginationItem>
          <PaginationNext
            onClick={() =>
              currentPage < totalPages && onPageChange(currentPage + 1)
            }
          >
            След.
          </PaginationNext>
        </PaginationItem>
      </PaginationContent>
    </PaginationComponent>
  );
}
