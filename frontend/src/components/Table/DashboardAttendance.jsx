import { useEffect, useState } from "react";
import Loading from "../Loading/Loading";
import ViewUser from "../Employee/ViewUser";
import Option from "../Actions/Option";
import TablePagination from "../Pagination/TablePagination";

import toast from "react-hot-toast";
import API_ENDPOINTS from "@/config/api";
import { formattedDateShort, formatTime } from "@/config/formatDate";
import { Eye, Trash2 } from "lucide-react";
import { attendanceTableColumns } from "../Constant";
import ConfirmationDialog from "../Actions/ConfirmationDialog";
import api from "@/config/axios";

const StatusPill = ({ status }) => {
  const getStatusColor = () => {
    switch (status) {
      case "On-Time":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-500";
      case "Late":
        return "bg-red-50 text-red-500 dark:bg-red-900/20 dark:text-red-500";
      case "Absent":
        return "bg-violet-100 text-violet-800 dark:bg-violet-900/30 dark:text-violet-500";
      case "Sick":
        return "bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-500";
      case "Leave":
        return "bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-500";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
    }
  };
  const getDotColor = () => {
    switch (status) {
      case "On-Time":
        return "bg-green-500";
      case "Late":
        return "bg-red-500";
      case "Absent":
        return "bg-violet-500";
      case "Sick":
        return "bg-pink-500";
      case "Leave":
        return "bg-violet-500";
      default:
        return "bg-gray-400";
    }
  };
  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${getStatusColor()}`}>
      <span className={`w-2 h-2 rounded-full mr-2 ${getDotColor()}`} />
      {status}
    </span>
  );
};

const DashboardAttendance = ({ Data }) => {
  const [loading, setLoading] = useState(true);
  const [currentData, setCurrentData] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [viewUser, setViewUser] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  useEffect(() => {
    if (Data) {
      setCurrentData(Data);
      setLoading(false);
    }
  }, [Data]);

  const handleViewUser = (user) => {
    setSelectedUser(user);
    setViewUser(true);
  };

  const handleDeleteUser = (user) => {
    setUserToDelete(user);
    setIsConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!userToDelete) return;
    const toastId = toast.loading("Delete data ....");
    try {
      await api.delete(
        `${API_ENDPOINTS.DELETE_ATTENDANCE_RECORD}/${userToDelete._id}`,
      );
      setCurrentData((prevData) =>
        prevData.filter((item) => item._id !== userToDelete._id),
      );
      toast.success("Data has been deleted", { id: toastId });
    } catch (error) {
      toast.error("failed to delete data", { id: toastId });
    } finally {
      setIsConfirmOpen(false);
      setUserToDelete(null);
    }
  };

  const handleItemsPerPageChange = (event) => {
    setItemsPerPage(Number(event.target.value));
    setCurrentPage(1);
  };

  const lastItemIndex = currentPage * itemsPerPage;
  const firstItemIndex = lastItemIndex - itemsPerPage;
  const paginatedData = currentData.slice(firstItemIndex, lastItemIndex);

  return (
    <div className="flex h-full flex-col">
      <div className="overflow-x-auto border border-border rounded-md max-w-full">
        <div className="inline-block min-w-full align-middle">
          <table className="w-full table-auto font-DMsans text-base bg-white dark:bg-secondary">
            <thead className="border-b border-border dark:bg-secondary-background">
              <tr>
                {attendanceTableColumns.map((column, index) => (
                  <th
                    key={index}
                    style={{ width: column.width }}
                    className={`px-4 py-3 font-semibold text-start tracking-wide whitespace-nowrap`}>
                    {column.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-accent">
              {loading ? (
                <tr>
                  <td
                    colSpan={attendanceTableColumns.length}
                    className="text-center py-8">
                    <Loading />
                  </td>
                </tr>
              ) : paginatedData.length === 0 ? (
                <tr>
                  <td
                    colSpan={attendanceTableColumns.length}
                    className="text-center py-8 text-dark dark:text-white font-medium">
                    No attendance data available
                  </td>
                </tr>
              ) : (
                paginatedData.map((user) => (
                  <tr
                    key={user._id}
                    className="hover:bg-accent dark:hover:bg-secondary-background whitespace-nowrap border-border border-b dark:border-border last:border-none">
                    {/* User info */}
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={
                            user.picture
                              ? `${import.meta.env.VITE_IMAGE_BASE_URL}/avatar/${user.picture}`
                              : "/default-avatar.png"
                          }
                          className="size-7 rounded-full object-cover shrink-0"
                        />
                        <div>
                          <p className="font-semibold text-dark dark:text-white">
                            {user.name}
                          </p>
                          <p className="text-xs text-gray-500">{user.role}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">{user.empId}</td>
                    <td className="px-4 py-3">{user.department}</td>
                    <td className="px-4 py-3">
                      <div>
                        <p className="font-semibold text-gray-800 text-sm dark:text-gray-200">
                          {formattedDateShort(user.date)}
                        </p>
                        <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                          <span className="font-medium text-green-600">
                            {formatTime(user.clockIn)}
                          </span>
                          <span>→</span>
                          <span className="font-medium text-red-600">
                            {user.clockOut ? formatTime(user.clockOut) : "---"}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 align-middle">
                      <StatusPill status={user.status} />
                    </td>
                    <td className="px-4 py-3 align-middle text-center">
                      <Option
                        menuItem={[
                          {
                            label: "View Details",
                            icon: Eye,
                            onClick: () => handleViewUser(user),
                          },
                          {
                            label: "Delete",
                            icon: Trash2,
                            onClick: () => handleDeleteUser(user),
                          },
                        ]}
                      />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
      <TablePagination
        currentPage={currentPage}
        totalItems={currentData.length}
        itemsPerPage={itemsPerPage}
        onPageChange={setCurrentPage}
        onItemsPerPageChange={handleItemsPerPageChange}
      />
      <ViewUser
        user={selectedUser}
        isOpen={viewUser}
        setIsOpen={setViewUser}
        fields={[
          { key: "empId", label: "Employee ID" },
          { key: "department", label: "Department" },
          {
            key: "clockIn",
            label: "Clock In",
            formatter: (value) => formatTime(value),
          },
          {
            key: "clockOut",
            label: "Clock Out",
            formatter: (value) => (value ? formatTime(value) : "---"),
          },
          { key: "status", label: "Status" },
        ]}
      />
      <ConfirmationDialog
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Attendance Data"
        message={`Are you sure you want to delete the attendance data for ${userToDelete?.name}? `}
        textButtonClose="Cancel"
        textButtonConfirm="Delete"
      />
    </div>
  );
};

export default DashboardAttendance;
