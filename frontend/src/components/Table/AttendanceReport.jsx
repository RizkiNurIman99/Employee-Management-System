import React, { useEffect, useState } from "react";
import { attendanceTableColumns } from "../Constant";
import Loading from "../Loading/Loading";
import { Download, Eye, Trash2 } from "lucide-react";
import { Button } from "../ui/button";
import ViewUser from "../Employee/ViewUser";
import DatePicker from "../Date Picker/DatePicker";
import TablePagination from "../Pagination/TablePagination";
import API_ENDPOINTS from "@/config/api";
import toast from "react-hot-toast";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { formattedDateShort, formatTime } from "@/config/formatDate";
import api from "@/config/axios";
import Option from "../Actions/Option";
import ConfirmationDialog from "../Actions/ConfirmationDialog";

const AttendanceReport = () => {
  const [loading, setLoading] = useState(false);
  const [currentData, setCurrentData] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [viewUser, setViewUser] = useState(false);
  const [deleteUser, setDeleteUser] = useState(null);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    if (!selectedDate) {
      setLoading(false);
      return;
    }
    const fetchAttendance = async () => {
      try {
        setLoading(true);
        const formattedDate = selectedDate.toLocaleDateString("en-CA", {
          timeZone: "Asia/Jakarta",
        });
        const res = await api.get(
          `${API_ENDPOINTS.DAILY_REPORT}?date=${formattedDate}`,
        );
        setCurrentData(res.data.record || []);
      } catch (error) {
        console.error("Error fetching data", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAttendance();
  }, [selectedDate]);

  const handleViewUser = (user) => {
    setSelectedUser(user);
    setViewUser(true);
  };
  const handleDeleteUser = (user) => {
    setDeleteUser(user);
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

  const exportExcle = () => {
    if (currentData.length === 0) return toast.error("No Data to Export");

    const worksheet = XLSX.utils.json_to_sheet(currentData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Daily Report");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    const file = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(file, `Attendance_Daily_${new Date().toLocaleDateString()}.xlsx`);
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  const lastItemIndex = currentPage * itemsPerPage;
  const firstItemIndex = lastItemIndex - itemsPerPage;
  const paginatedData = currentData.slice(firstItemIndex, lastItemIndex);

  return (
    <div className="pb-6 h-screen">
      <div className="flex items-center justify-between">
        <div className="mb-6">
          <h1 className="text-2xl font-bold font-DMsans">Attendance Report</h1>
          <p className="text-gray-600 dark:text-gray-300 text-sm font-DMsans mt-1">
            View today's attendance data and recap daily, weekly, and monthly
            reports
          </p>
        </div>
      </div>
      <div className="flex items-center justify-between pb-5">
        <DatePicker onDataChange={handleDateChange} />
        <Button
          variant="outline"
          onClick={exportExcle}
          className="text-base font-DMsans text-dark dark:text-light border border-border dark:border-border ">
          <span>
            <Download />
          </span>
          Export
        </Button>
      </div>
      <div className="border border-border overflow-x-auto rounded-md dark:border-border ">
        <table className="w-full table-auto font-DMsans text-base bg-white dark:bg-secondary">
          <thead className="border-b border-border dark:bg-secondary-background">
            <tr className="text-left">
              {attendanceTableColumns.map((column, index) => (
                <th
                  key={index}
                  className="px-4 py-2 text-dark dark:text-light font-medium">
                  {column.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              <td colSpan="10" className="text-center">
                {loading && <Loading />}
              </td>
            </tr>
            {!loading &&
              (paginatedData.length === 0 ? (
                <tr className="w-full">
                  <td
                    colSpan="10"
                    className="text-center py-4 font-DMsans text-base font-medium">
                    Attendance data is not available
                  </td>
                </tr>
              ) : (
                paginatedData.map((user, idx) => (
                  <tr
                    key={idx}
                    className="font-DMsans text-sm md:text-base bg-light dark:bg-second_dark border-b border-b-gray-200  dark:border-b-surface_dark">
                    <td className="px-4 py-2">
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
                    <td className="px-4 py-2">{user.empId}</td>
                    <td className="px-4 py-2">{user.department}</td>
                    <td className="px-4 py-2">
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
                    <td className="px-4 py-2">{user.status}</td>
                    <td className="px-4 py-2">
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
              ))}
          </tbody>
        </table>
      </div>
      <TablePagination
        currentPage={currentPage}
        totalItems={currentData.length}
        itemsPerPage={itemsPerPage}
        onPageChange={setCurrentPage}
      />
      <ViewUser
        isOpen={viewUser}
        setIsOpen={setViewUser}
        user={selectedUser}
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
        message={`Are you sure you want to delete the attendance data for ${deleteUser?.name}? `}
        textButtonClose="Cancel"
        textButtonConfirm="Delete"
      />
    </div>
  );
};

export default AttendanceReport;
