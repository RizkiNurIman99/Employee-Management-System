import React, { useCallback, useEffect, useState } from "react";
import AdminForm from "@/components/Admin/AdminForm";
import AdminTable from "@/components/Table/AdminTable";
import API_ENDPOINTS from "@/config/api";
import api from "@/config/axios";
import toast from "react-hot-toast";

const ManageUser = () => {
  const [adminData, setAdminData] = useState([]);

  const fetchAdmins = useCallback(async () => {
    try {
      const res = await api.get(API_ENDPOINTS.ADMINS);
      setAdminData(res.data.admins);
    } catch (error) {
      toast.error("Error fetching admins");
    }
  }, []);

  useEffect(() => {
    fetchAdmins();
  }, [fetchAdmins]);

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-DMsans font-bold text-gray-900 dark:text-white">
        Manage Admins
      </h1>
      <AdminForm onSuccess={fetchAdmins} />
      <AdminTable data={adminData} onUpdate={fetchAdmins} />
    </div>
  );
};

export default ManageUser;
