import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { X } from "lucide-react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { SelectGroup } from "@radix-ui/react-select";
import { Button } from "../ui/button";
import API_ENDPOINTS from "@/config/api";

const ManualAttendance = ({ onAction }) => {
  const [notCheckedInEmployees, setNotCheckedInEmployees] = useState([]);
  const [notCheckedOutEmployees, setNotCheckedOutEmployees] = useState([]);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchEmployees = async () => {
      setIsLoading(true);
      try {
        const [notCheckInRes, notCheckOutRes] = await Promise.all([
          axios.get(`${API_ENDPOINTS.GET_MANUAL_ATTEND}?type=not-checkedIn`),
          axios.get(`${API_ENDPOINTS.GET_MANUAL_ATTEND}?type=not-checkedOut`),
        ]);
        setNotCheckedInEmployees(notCheckInRes.data.employees || []);
        setNotCheckedOutEmployees(notCheckOutRes.data.employees || []);
      } catch (error) {
        console.error("Failed to fetch employees:", error);
        toast.error("Failed to fetch employee data.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchEmployees();
  }, [onAction]);

  const selectedEmployee = [
    ...notCheckedInEmployees,
    ...notCheckedOutEmployees,
  ].find((emp) => emp.empId === selectedEmployeeId);

  const handleAction = (type, status = null) => {
    if (!selectedEmployeeId) {
      toast.error("Please select an employee first.");
      return;
    }

    onAction(type, selectedEmployeeId, status);
    setSelectedEmployeeId("");
  };

  const renderEmployeeItem = (employee) => (
    <SelectItem key={employee.empId} value={employee.empId} className="text-base">
      <div className="flex items-center gap-3">
        <img
          src={
            employee.picture
              ? `${API_ENDPOINTS.AVATAR}/${employee.picture}`
              : "/default-avatar.png"
          }
          alt={employee.name}
          className="size-5 shrink-0 rounded-full object-cover"
        />
        <span className="truncate">
          {employee.name} ({employee.empId})
        </span>
      </div>
    </SelectItem>
  );

  return (
    <div className="w-full bg-light border border-border dark:bg-accent rounded-md p-4">
      <div className="flex flex-col gap-2">
        <span className="text-base font-DMsans font-medium">
          Manual Attendance :
        </span>

        <div className="flex flex-wrap gap-6 md:gap-3 items-center">
          {/* Dropdown Select */}
          <Select
            value={selectedEmployeeId}
            onValueChange={setSelectedEmployeeId}
            disabled={isLoading}
          >
            <SelectTrigger className="w-1/2 text-base text-accent-foreground bg-accent">
              <SelectValue
                placeholder={
                  isLoading ? "Loading employees..." : "Select Employee"
                }
              />
            </SelectTrigger>
            <SelectContent className="bg-accent dark:bg-secondary-background">
              {notCheckedInEmployees.length > 0 && (
                <SelectGroup>
                  <SelectLabel>For Check-In / Absent</SelectLabel>
                  {notCheckedInEmployees.map(renderEmployeeItem)}
                </SelectGroup>
              )}

              {notCheckedOutEmployees.length > 0 && (
                <SelectGroup>
                  <SelectLabel>For Check-Out</SelectLabel>
                  {notCheckedOutEmployees.map(renderEmployeeItem)}
                </SelectGroup>
              )}
            </SelectContent>
          </Select>
          <div className="flex gap-2">
            <Button variant="default"
              onClick={() => handleAction("Check-in")}
              disabled={isLoading}
            >
              Check-In
            </Button>
            <Button
              variant="default"
              onClick={() => handleAction("Check-out")}
              disabled={isLoading}
            >
              Check-Out
            </Button>
          </div>
              
        </div>
      </div>
    </div>
  );
};

export default ManualAttendance;
