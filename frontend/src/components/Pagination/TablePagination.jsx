import { ChevronLeft, ChevronRight } from "lucide-react";
import React from "react";
import { Button } from "../ui/button";

const TablePagination = ({
  itemsPerPage,
  totalItems,
  currentPage,
  onPageChange,
  onItemsPerPageChange,
}) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  if (totalPages <= 1) {
    return null;
  }

  const handlePrevious = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  const firstItem = (currentPage - 1) * itemsPerPage + 1;
  const lastItem = Math.min(currentPage * itemsPerPage, totalItems);

  return (
    <div className="flex item-center justify-between px-4 bg-light dark:bg-second_dark mt-4 h-14 rounded-md border border-border dark:border-border">
      <div className="flex gap-2 items-center font-DMsans text-sm">
        <span>Rows per page : </span>
        <select
          value={itemsPerPage}
          onChange={onItemsPerPageChange}
          className="rounded border border-border bg-light p-1 focus:outline-none focus:ring-1 focus:ring-orange-500 dark:border-border dark:bg-second_dark">
          <option value="5">5</option>
          <option value="10">10</option>
          <option value="15">15</option>
        </select>
      </div>
      <div className="flex items-center gap-4">
        <div className="text-sm text-gray-600 dark:text-gray-300">
          Showing <span className="font-semibold">{firstItem}</span>-
          <span className="font-semibold">{lastItem}</span> of{" "}
          <span className="font-semibold">{totalItems}</span>
        </div>
        <div className="flex items-center gap-2 font-DMsans">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentPage === 1}
            className="flex items-center gap-1 cursor-pointer disabled:opaicty-50">
            <ChevronLeft className="size-4" />
          </Button>
          <div className="text-sm font-DMsans">
            {currentPage} / {totalPages}
          </div>
          <Button
            variant="outline"
            onClick={handleNext}
            disabled={currentPage === totalPages}
            className="cursor-pointer">
            <ChevronRight className="size-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TablePagination;
