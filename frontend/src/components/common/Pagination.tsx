import { Button } from "../common/Button";
import { ChevronLeft, ChevronRight } from "lucide-react";

type PaginationProps = {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

export const Pagination = ({ currentPage, totalPages, onPageChange }: PaginationProps) => {
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-between bg-white dark:bg-slate-900 px-6 py-4 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xs mt-4">
      <span className="text-xs text-slate-550 font-medium">
        Page {currentPage} of {totalPages}
      </span>
      <div className="flex gap-2">
        <Button
          variant="secondary"
          size="sm"
          disabled={currentPage <= 1}
          onClick={() => onPageChange(currentPage - 1)}
          className="flex items-center gap-1"
        >
          <ChevronLeft size={14} />
          Previous
        </Button>
        <Button
          variant="secondary"
          size="sm"
          disabled={currentPage >= totalPages}
          onClick={() => onPageChange(currentPage + 1)}
          className="flex items-center gap-1"
        >
          Next
          <ChevronRight size={14} />
        </Button>
      </div>
    </div>
  );
};
