import React, { useEffect, useState } from "react";
import { Button } from "../ui/button";
import socket from "@/config/socket";
import API_ENDPOINTS from "@/config/api";
import { toast } from "react-hot-toast";
import api from "@/config/axios";

const RfidFormRegister = ({ onSuccess }) => {
  const [formData, setFormData] = useState({
    uid: "",
    picture: "",
    name: "",
    empId: "",
    department: "",
    role: "",
  });

  const showMessage = (message, type = "success") => {
    if (type === "success") {
      toast.success(message, {
        duration: 3000,
        position: "top-center",
        style: {
          fontFamily: "DM Sans, sans-serif",
          background: "#4caf50",
          color: "#fff",
        },
      });
    } else {
      toast.error(message, {
        duration: 3000,
        position: "top-center",
        style: {
          fontFamily: "DM Sans, sans-serif",
          background: "#fff",
          color: "#000",
        },
      });
    }
  };
  useEffect(() => {
    const handleUidDetected = (data) => {
      setFormData((prev) => ({
        ...prev,
        uid: data.uid,
      }));

      if (data.message) {
        if (data.isRegistered) {
          toast.error(data.message);
        } else {
          toast.success(data.message);
        }
      }
    };
    socket.on("uid-detected", handleUidDetected);
    return () => {
      socket.off("uid-detected", handleUidDetected);
    };
  }, []);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleUploadPicture = (e) => {
    const file = e.target.files[0];

    if (!file) {
      console.log("No file selected");

      setFormData((prev) => ({
        ...prev,
        picture: "",
      }));
      return;
    }
    const maxSize = 2 * 1024 * 1024; // 2MB
    if (file.size > maxSize) {
      console.warn("file too large, max size is 2MB");
      toast.error("File too large, max size is 2MB");
      return;
    }
    setFormData((prev) => ({
      ...prev,
      picture: file,
    }));
    const fileName = document.getElementById("file-name");
    if (fileName) {
      fileName.value = file.name;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const requireFields = ["uid", "name", "empId", "department", "role"];
    const missingFields = requireFields.filter((field) => !formData[field]);

    if (missingFields.length > 0) {
      showMessage(
        `Please fill in all fields: ${missingFields.join(", ")}`,
        "error",
      );
      return;
    }
    try {
      const formDataToSend = new FormData();
      formDataToSend.append("uid", formData.uid);
      formDataToSend.append("name", formData.name);
      formDataToSend.append("empId", formData.empId);
      formDataToSend.append("department", formData.department);
      formDataToSend.append("role", formData.role);
      if (formData.picture) {
        formDataToSend.append("picture", formData.picture);
      }
      const res = await api.post(API_ENDPOINTS.CREATE_EMPLOYEE, formDataToSend);

      console.log("Response from server:", res.data);
      toast.success("User registered successfully");
      setFormData({
        uid: "",
        picture: "",
        name: "",
        empId: "",
        department: "",
        role: "",
      });
      const fileName = document.getElementById("file-name");
      if (fileName) fileName.value = "";

      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      const errorMsg = error.response?.data?.error || error.message;
      toast.error(errorMsg || "Failed to register user");
    }
  };

  return (
    <div className="w-full flex flex-col mb-7">
      <div className="space-y-4 ">
        <h1 className="font-DMsans text-xl font-semibold text-dark dark:text-light ">
          Employee Registration for RFID Access
        </h1>
        <form
          onSubmit={handleSubmit}
          className="font-DMsans bg-light dark:bg-secondary-background p-4 rounded-md border border-border dark:border-border">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-base font-medium text-dark dark:text-light font-DMsans mb-1">
                RFID No / UID
              </label>
              <input
                type="text"
                name="uid"
                placeholder="UID"
                className="w-full p-2 border border-border rounded-md bg-surface dark:bg-surface_dark dark:border-border text-dark dark:text-light focus:outline-none dark:focus:border-light/50 focus:border-gray-500"
                value={formData.uid}
                onChange={handleChange}
                readOnly
              />
            </div>
            <div>
              <label className="block text-base font-medium text-dark dark:text-light font-DMsans mb-1">
                Name
              </label>
              <input
                type="text"
                name="name"
                placeholder="Name"
                className="w-full p-2 border border-border rounded-md bg-surface dark:bg-surface_dark dark:border-border text-dark dark:text-light focus:outline-none dark:focus:border-light/50 focus:border-gray-500"
                value={formData.name}
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="block text-base font-medium text-dark dark:text-light font-DMsans mb-1">
                Employee ID
              </label>
              <input
                type="text"
                name="empId"
                placeholder="EMP ID"
                className="w-full p-2 border border-border  rounded-md bg-surface dark:bg-surface_dark dark:border-border text-dark dark:text-light focus:outline-none dark:focus:border-light/50 focus:border-gray-500"
                value={formData.empId}
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="block text-base font-medium text-dark dark:text-light  font-DMsans mb-1">
                Department
              </label>
              <input
                type="text"
                name="department"
                placeholder="Department"
                className="w-full p-2 border border-border rounded-md bg-surface dark:bg-surface_dark dark:border-border text-dark dark:text-light focus:outline-none dark:focus:border-light/50 focus:border-gray-500"
                value={formData.department}
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="block text-base font-medium text-dark dark:text-light  font-DMsans mb-1">
                Role
              </label>
              <input
                type="text"
                name="role"
                placeholder="Role"
                className="w-full p-2 border border-border rounded-md bg-surface dark:bg-surface_dark dark:border-border text-dark dark:text-light focus:outline-none dark:focus:border-light/50 focus:border-gray-500"
                value={formData.role}
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="block text-base font-medium text-dark dark:text-light font-DMsans mb-1">
                Profile Picture
              </label>
              <div className="relative flex items-center">
                <input
                  type="file"
                  id="file-upload"
                  className="absolute inset-0 opacity-0 cursor-pointer z-10"
                  accept="image/png, image/jpeg, image/jpg"
                  onChange={handleUploadPicture}
                />
                <input
                  type="text"
                  id="file-name"
                  placeholder="No file chosen"
                  disabled
                  className="w-full p-2 border border-border rounded-md bg-surface dark:bg-surface_dark dark:border-border text-dark dark:text-light focus:outline-none"
                />
                <label
                  htmlFor="file-upload"
                  className="absolute right-2 bg-light border border-border shadow dark:bg-second_dark dark:border-border dark:text-light px-3 py-1 rounded cursor-pointer text-sm z-20">
                  {formData.picture ? (
                    <span
                      title="remove file"
                      onClick={() => {
                        setFormData((prev) => ({
                          ...prev,
                          picture: "",
                        }));
                        const fileInput =
                          document.getElementById("file-upload");
                        const fileName = document.getElementById("file-name");
                        if (fileInput) fileInput.value = "";
                        if (fileName) fileName.value = "";
                      }}>
                      Cancel
                    </span>
                  ) : (
                    "Choose File"
                  )}
                </label>
              </div>
              <span className="text-gray-500 dark:text-light-50 font-DMsans text-[12px]">
                PNG, JPG or JPEG (Max. 2MB)
              </span>
            </div>
          </div>
          <Button className="text-light text-base bg-orange-500 hover:bg-orange-600 rounded-md cursor-pointer">
            Register
          </Button>
        </form>
      </div>
    </div>
  );
};

export default RfidFormRegister;
