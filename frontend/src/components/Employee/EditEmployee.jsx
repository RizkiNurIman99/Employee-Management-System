import React, { useEffect, useRef, useState } from "react";
import { Button } from "../ui/button";
import { X } from "lucide-react";
import API_ENDPOINTS from "@/config/api";
import api from "@/config/axios";

const FormField = ({
  name,
  label,
  value,
  onChange,
  type = "text",
  required = false,
}) => {
  return (
    <div>
      <label htmlFor={name}>{label}</label>
      <div className="mt-1">
        <input
          type={type}
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          required={required}
          className="flex h-10 w-full rounded-md border border-border bg-white text-base font-DMsans px-3 py-2 ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foregroundfocus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-border dark:bg-second_dark dark:text-white"
        />
      </div>
    </div>
  );
};

const EditEmployee = ({
  isOpen,
  setIsOpen,
  side = "right",
  user,
  updateUser,
}) => {
  const [formData, setFormData] = useState({
    uid: "",
    name: "",
    empId: "",
    department: "",
    role: "",
    picture: null,
  });

  const [selectedPicture, setSelectedPicture] = useState(null);
  const fileInputRef = useRef();

  const getAvatarUrl = (picture) =>
    `${import.meta.env.VITE_IMAGE_BASE_URL}/avatar/${picture || "default-avatar.png"}`;

  useEffect(() => {
    if (user) {
      setFormData({
        uid: user.uid,
        name: user.name || "",
        empId: user.empId || "",
        department: user.department || "",
        role: user.role || "",
        picture: user.picture || null,
      });
      setSelectedPicture(null);
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePictureChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedPicture(file);
    }
  };
  const handleClickPictureChange = () => {
    fileInputRef.current.click();
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    const dataToUpdate = new FormData();
    dataToUpdate.append("uid", formData.uid);
    dataToUpdate.append("name", formData.name);
    dataToUpdate.append("empId", formData.empId);
    dataToUpdate.append("department", formData.department);
    dataToUpdate.append("role", formData.role);

    if (selectedPicture) {
      dataToUpdate.append("picture", selectedPicture);
    }
    try {
      const res = await api.put(
        `${API_ENDPOINTS.UPDATE_EMPLOYEE}/${formData.uid}`,
        dataToUpdate,
        {
          headers: { "Content-Type": "multipart/form-data" },
        },
      );
      updateUser(res.data.updatedEmployee);
      setIsOpen(false);
    } catch (error) {
      console.log("update error", error);
    }
  };

  return (
    <div
      id={`dialog-${side}`}
      aria-labelledby="slide-over"
      role="dialog"
      aria-modal="true"
      aria-hidden={false}
      className={`relative z-[100] font-DMsans ${
        isOpen ? "" : "pointer-events-none"
      }`}>
      {/* backdrop */}
      <div
        onClick={() => setIsOpen(false)}
        className={`transition-opacity duration-500 ease-in-out fixed inset-0 bg-black/50 backdrop-blur-sm ${
          isOpen ? "opacity-100" : "opacity-0"
        }`}
      />

      <div
        onClick={(e) => e.stopPropagation()}
        className={`transform transition-transform duration-500 ease-in-out fixed inset-y-0 right-0 w-screen max-w-md bg-white dark:bg-dark flex flex-col overflow-y-auto ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}>
        <div className="flex items-center justify-between border-b border-b-border dark:border-b-border p-6">
          <h2 id="slide-over" className="text-lg font-semibold">
            Edit Profile
          </h2>
          <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
            <X className="w-5 h-5" />
          </Button>
        </div>
        <div className="flex-1">
          <form onSubmit={handleSubmit} className="space-y-4 p-6">
            <div className="space-y-2 flex-grow">
              {/* Profile Picture Section */}
              <div>
                <label className="block text-base font-medium text-dark dark:text-white">
                  Profile Picture
                </label>
                <div className="mt-2 flex items-center gap-4">
                  <img
                    src={getAvatarUrl(user?.picture)}
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = `${import.meta.env.VITE_IMAGE_BASE_URL}/avatar/default-avatar.png`;
                    }}
                    alt="avatar"
                    className="object-cover size-20 rounded-full"
                  />

                  <input
                    type="file"
                    accept="image/*"
                    ref={fileInputRef}
                    className="hidden"
                    onChange={handlePictureChange}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleClickPictureChange}>
                    Change Picture
                  </Button>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 pb-5">
              <div className="sm:col-span-2">
                <FormField
                  label="Name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="sm:col-span-2">
                <FormField
                  label="Department"
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <FormField
                  label="Employee ID"
                  name="empId"
                  value={formData.empId}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <FormField
                  label="Role"
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            <div className="flex-shrink-0 pt-6 mt-auto ">
              <div className="flex justify-end gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsOpen(false)}
                  className="cursor-pointer">
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="bg-orange-500 hover:bg-orange-600 cursor-pointer text-white">
                  Save Changes
                </Button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditEmployee;
