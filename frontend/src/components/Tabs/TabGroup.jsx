import React, { useEffect, useState } from "react";
import API_ENDPOINTS from "@/config/api";
import { Button } from "../ui/button";
import axios from "axios";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import toast from "react-hot-toast";

const TabGroup = ({ onAction }) => {
  const [notCheckedInEmployees, setNotCheckedInEmployees] = useState([]);
  const [notCheckedOutEmployees, setNotCheckedOutEmployees] = useState([]);
  const [activeTab, setActiveTab] = useState("add-attendance");
  const [selectedEmployeeId, setSelectedEmployeeId] = useState("");

  const [isLoading, setIsLoading] = useState(false);

  return (
    <div>
      <p>Add Attendance</p>
      <Select>
        <SelectTrigger>
          <SelectValue></SelectValue>
        </SelectTrigger>
      </Select>
    </div>
  );
};

export default TabGroup;
