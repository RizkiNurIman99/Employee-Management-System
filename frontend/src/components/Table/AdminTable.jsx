import React, { useEffect, useState } from "react";
import TablePagination from "../Pagination/TablePagination";
import Loading from "../Loading/Loading";
import { Trash2 } from "lucide-react";
import API_ENDPOINTS from "@/config/api";
import toast from "react-hot-toast";
import ConfirmationDialog from "../Actions/ConfirmationDialog";
import { formattedDateShort } from "@/config/formatDate";
import api from "@/config/axios";

const AdminTable = ({ data, onUpdate }) => {
  const [loading, setLoading] = useState(true);
  const [currentData, setCurrentData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [deleteAdmin, setDeleteAdmin] = useState(null);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
      setCurrentData(data);
    });
    return () => clearTimeout(timer);
  }, [data]);

  const handleDeleteAdmin = (admin) => {
    setDeleteAdmin(admin);
    setIsConfirmOpen(true);
  };

  const handleConfirmDeleteAdmin = async () => {
    if (!deleteAdmin) return;
    const toastId = toast.loading("Deleting Admin .... ");
    try {
      await api.delete(`${API_ENDPOINTS.DELETE_ADMIN}/${deleteAdmin._id}`);
      setCurrentData((prevData) =>
        prevData.filter((admin) => admin._id !== deleteAdmin._id),
      );
      toast.success("Admin deleted successfully", { id: toastId });
      onUpdate(); // Refresh data
    } catch (error) {
      toast.error("Failed to delete admin", { id: toastId });
    } finally {
      setIsConfirmOpen(false);
      setDeleteAdmin(null);
    }
  };

  const handleItemsPerPageChange = (event) => {
    setItemsPerPage(Number(event.target.value));
    setCurrentPage(1);
  };

  const lastItemIndex = currentPage * itemsPerPage;
  const firstItemIndex = lastItemIndex - itemsPerPage;
  const paginatedData = currentData.slice(firstItemIndex, lastItemIndex);

  if (loading) {
    return <Loading />;
  }

  return (
    <div>
      <div className="overflow-x-auto rounded-md border border-border dark:border-border">
        <table className="w-full overflow-x-hidden font-DMsans text-base bg-white dark:bg-surface_dark ring ring-gray-300 dark:ring-0">
          <thead className="bg-gray-50 dark:bg-gray-800">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">
                Username
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">
                Name
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">
                Role
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">
                Created At
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {paginatedData.length > 0 ? (
              paginatedData.map((admin) => (
                <tr
                  key={admin._id}
                  className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-4 py-4 text-sm text-gray-900 dark:text-white">
                    {admin.username}
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-900 dark:text-white">
                    {admin.name}
                  </td>
                  <td className="px-4 py-4 text-sm">
                    <span
                      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${
                        admin.role === "active"
                          ? "bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300"
                          : "bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300"
                      }`}>
                      {admin.role}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-900 dark:text-white">
                    {formattedDateShort(admin.createdAt)}
                  </td>
                  <td className="px-4 py-4 text-sm">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleDeleteAdmin(admin)}
                        className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300">
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="5"
                  className="px-4 py-4 text-center text-gray-500 dark:text-gray-400">
                  No admins found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {currentData.length > itemsPerPage && (
        <TablePagination
          currentPage={currentPage}
          totalPages={Math.ceil(currentData.length / itemsPerPage)}
          onPageChange={setCurrentPage}
          itemsPerPage={itemsPerPage}
          onItemsPerPageChange={handleItemsPerPageChange}
          totalItems={currentData.length}
        />
      )}
      <ConfirmationDialog
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={handleConfirmDeleteAdmin}
        title="Delete Admin"
        message={`Are you sure you want to delete admin "${deleteAdmin?.name}"? This action cannot be undone.`}
      />
    </div>
  );
};

export default AdminTable;
