import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

// departments: [{ value, label }]
const SelectDepartment = ({ departments = [], value = "all", onChange }) => {
  return (
    <div className="flex w-full items-center gap-3">
      <label
        className="shrink-0 whitespace-nowrap font-DMsans text-base font-medium"
        htmlFor="">
        Select Department :
      </label>
      <Select value={value} onValueChange={onChange} className="py-7">
        <SelectTrigger className="w-full flex-1 font-DMsans text-base bg-white">
          <SelectValue placeholder="Select Department" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all" className="font-DMsans font-medium text-base">
            All
          </SelectItem>
          {departments.map((department) => (
            <SelectItem
              key={department.value}
              value={department.value}
              className="font-DMsans font-medium text-base">
              {department.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default SelectDepartment;
