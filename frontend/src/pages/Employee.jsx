import RfidFormRegister from "@/components/RFID_Register/RfidFormRegister";
import SelectDepartment from "@/components/Select/SelectDepartment";
import EmployeeTable from "@/components/Table/EmployeeTable";
import API_ENDPOINTS from "@/config/api";
import api from "@/config/axios";
import { useCallback, useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";

export const DEPARTMENTS = [
  { value: "SD IT Insan Sejahtera", label: "SD IT Insan Sejahtera" },
  { value: "SMP IT Insan Sejahtera", label: "SMP IT Insan Sejahtera" },
];
const DEPARTMENT_VALUES = DEPARTMENTS.map((d) => d.value);

const Employee = () => {
  const [employeeData, setEmployeeData] = useState([]);
  const [department, setDepartment] = useState("all");
  const [loading, setLoading] = useState(true);

  const fetchDataEmpoyees = useCallback(async () => {
    try {
      const res = await api.get(API_ENDPOINTS.EMPLOYEES);
      setEmployeeData(res.data.employees ?? []);
    } catch (error) {
      toast.error("ERROR");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDataEmpoyees();
  }, [fetchDataEmpoyees]);

  const filteredData = useMemo(
    () =>
      department === "all"
        ? employeeData
        : employeeData.filter((e) => e.department === department),
    [employeeData, department],
  );
  return (
    <>
      <RfidFormRegister onSuccess={fetchDataEmpoyees} />
      <div className="my-4 flex items-center justify-between gap-4">
        <div className="w-full max-w-xs">
          <SelectDepartment
            departments={DEPARTMENTS}
            value={department}
            onChange={setDepartment}
          />
        </div>
      </div>
      <EmployeeTable
        data={filteredData}
        loading={loading}
        onRefresh={fetchDataEmpoyees}
      />
    </>
  );
};

export default Employee;
