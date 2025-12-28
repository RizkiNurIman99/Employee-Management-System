import React, { useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Button } from "../ui/button";
import { Calendar } from "../ui/calendar";

import { CalendarIcon } from "lucide-react";
import { Label } from "../ui/label";
import { formattedDateShort } from "@/config/formatDate";
import { Input } from "../ui/input";

const DatePicker = ({ onDataChange }) => {
  const [open, setOpen] = useState(false);
  const [date, setDate] = useState(null);
  const [month, setMonth] = useState(null);
  const [value, setValue] = useState("");

  const handleSelected = (selectedDate) => {
    if (!selectedDate) return;
    setDate(selectedDate);
    const formated = formattedDateShort(selectedDate);
    setValue(formated);
    setOpen(false);
    if (onDataChange) onDataChange(selectedDate);
  };

  return (
    <div className="flex gap-5 font-DMsans">
      <Label>Select Date :</Label>
      <div className="flex items-center gap-2 relative">
        <Input
          type={date}
          id="date"
          className="bg-background pr-5"
          placeholder="Select Date"
          value={value}
          readOnly
        />
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="ghost"
              id="date-picker"
              className="absolute top-1/2 right-2 size-6 -translate-y-1/2">
              <CalendarIcon className="size-3.5" />
              <span className="sr-only">Select date</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto overflow-hidden p-0">
            <Calendar
              mode="single"
              selected={date}
              onSelect={handleSelected}
              month={month}
              onMotnhChange={setMonth}
              captionLayout="dropdown"
            />
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
};

export default DatePicker;
