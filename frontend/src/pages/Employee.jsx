import RfidFormRegister from "@/components/RFID_Register/RfidFormRegister";
import EmployeeTable from "@/components/Table/EmployeeTable";
import API_ENDPOINTS from "@/config/api";
import api from "@/config/axios";
import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";

const Employee = () => {
  const [employeeData, setEmployeeData] = useState([]);

  const fetchDataEmpoyees = useCallback(async () => {
    try {
      const res = await api.get(API_ENDPOINTS.EMPLOYEES);
      setEmployeeData(res.data.employees);
    } catch (error) {
      toast.error("ERROR");
    }
  }, []);

  useEffect(() => {
    fetchDataEmpoyees();
  }, [fetchDataEmpoyees]);
  return (
    <>
      <RfidFormRegister onSuccess={fetchDataEmpoyees} />
      <EmployeeTable data={employeeData} />
    </>
  );
};

export default Employee;
