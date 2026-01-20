import React, { useEffect, useState } from "react";
import TablePagination from "../Pagination/TablePagination";
import { employeeColumns } from "../Constant";
import Loading from "../Loading/Loading";
import ViewUser from "../Employee/ViewUser";
import Option from "../Actions/Option";
import { Eye, PenBoxIcon, Trash2 } from "lucide-react";
import API_ENDPOINTS from "@/config/api";
import EditEmployee from "../Employee/EditEmployee";
import toast from "react-hot-toast";
import axios from "axios";
import ConfirmationDialog from "../Actions/ConfirmationDialog";
import { formattedDateShort } from "@/config/formatDate";

const EmployeeTable = ({ data }) => {
  const [loading, setLoading] = useState(true);
  const [currentData, setCurrentData] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [viewUser, setViewUser] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [openEditUser, setOpenEditUser] = useState(false);
  const [editUser, setEditUser] = useState(null);
  const [deleteUser, setDeleteUser] = useState(null);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  const [itemsPerPage, setItemsPerPage] = useState(5);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
      setCurrentData(data);
      console.log("Data received:", data);
    });
    return () => clearTimeout(timer);
  }, [data]);

  const handleViewUser = (user) => {
    setSelectedUser(user);
    setViewUser(true);
  };
  const handleEditUser = (user) => {
    setEditUser(user);
    setOpenEditUser(true);
  };

  const updatedUser = async (updateUser) => {
    try {
      const res = await axios.put(
        `${API_ENDPOINTS.UPDATE_EMPLOYEE}/${updateUser.uid}`,
        updateUser,
      );

      const updated = res.data.updatedEmployee;

      setCurrentData((prevData) =>
        prevData.map((user) => (user.uid === updated.uid ? updated : user)),
      );
      setTimeout(() => {
        toast.success("User updated successfully");
      }, 1500);
    } catch (error) {
      setTimeout(() => {
        toast.error("Failed to update user");
      }, 1000);
    }
  };
  const handleDeleteUser = (user) => {
    setDeleteUser(user);
    setIsConfirmOpen(true);
  };
  const handleConfirmDeleteUser = async () => {
    if (!deleteUser) return null;
    const toastId = toast.loading("Delete Employee .... ");
    try {
      await axios.delete(`${API_ENDPOINTS.DELETE_EMPLOYEE}/${deleteUser._id}`);
      setCurrentData((prevData) =>
        prevData.filter((employee) => employee._id !== deleteUser._id),
      );
      toast.success("Data has been deleted", { id: toastId });
    } catch (error) {
      console.error("failed to delete data:", error);
      toast.error("failed to delete data", { id: toastId });
    } finally {
      setIsConfirmOpen(false);
      setDeleteUser(null);
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
    <div>
      <div className="overflow-x-auto rounded-md border border-border dark:border-border">
        <table className=" w-full overflow-x-hidden font-DMsans text-base bg-white dark:bg-surface_dark ring ring-gray-300 dark:ring-0">
          <thead className="border-b border-border dark:border-border dark:bg-second_dark h-12">
            <tr className="text-left whitespace-nowrap">
              {employeeColumns.map((column, index) => (
                <th key={index} className="px-4 py-2 font-medium">
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
                    className="font-DMsans text-sm md:text-base bg-light dark:bg-surface_dark border-b border-border dark:border-border last:border-none">
                    <td className="px-4 py-2 ">{user.uid}</td>
                    <td className="px-4 py-2 flex items-center gap-2 whitespace-nowrap">
                      <img
                        src={
                          user.picture
                            ? `${import.meta.env.VITE_IMAGE_BASE_URL}/avatar/${user.picture}`
                            : "/default-avatar.png"
                        }
                        className="size-10 shrink-0 rounded-full object-cover"
                      />
                      <div className="flex flex-col">
                        <span className="text-base font-dark dark:font-light font-bold">
                          {user.name}
                        </span>
                        <span className="text-sm text-gray-500">
                          {user.role}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap">
                      {user.empId}
                    </td>
                    <td className="px-4 py-2">{user.department}</td>
                    <td className="px-4 py-2">
                      {formattedDateShort(user.createdAt)}
                    </td>
                    <td className="px-4 py-2 text-center">
                      <Option
                        menuItem={[
                          {
                            label: "View",
                            icon: Eye,
                            onClick: () => {
                              console.log("view user");

                              handleViewUser(user);
                            },
                          },
                          {
                            label: "Edit",
                            icon: PenBoxIcon,
                            onClick: () => {
                              handleEditUser(user);
                            },
                          },
                          {
                            label: "delete",
                            icon: Trash2,
                            onClick: () => handleDeleteUser(user),
                          },
                          ,
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
        onItemsPerPageChange={handleItemsPerPageChange}
      />
      <ViewUser
        isOpen={viewUser}
        setIsOpen={setViewUser}
        user={selectedUser}
        fields={[
          { key: "empId", label: "Employee ID" },
          { key: "department", label: "Department" },
          { key: "role", label: "Role" },
        ]}
      />
      <EditEmployee
        isOpen={openEditUser}
        setIsOpen={setOpenEditUser}
        user={editUser}
        updateUser={updatedUser}
      />
      <ConfirmationDialog
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={handleConfirmDeleteUser}
        title="Delete Employee Data"
        message={`Are you sure you want to delete employee for ${deleteUser?.name}?`}
        textButtonClose="Cancel"
        textButtonConfirm="Delete"
      />
    </div>
  );
};

export default EmployeeTable;
