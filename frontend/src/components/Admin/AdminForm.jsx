import React, { useState } from "react";
import { Button } from "../ui/button";
import API_ENDPOINTS from "@/config/api";
import toast from "react-hot-toast";
import api from "@/config/axios";

const inputClassName =
  "mt-2 block w-full rounded-md border border-border px-4 py-3 font-DMsans text-[16px] bg-surface dark:bg-surface_dark text-dark font-Dmsans transition outline-none placeholder:text-dark/35 focus:border-dark/30 focus:ring-4 focus:ring-dark/5 dark:border-white/10 dark:bg-second_dark dark:text-light dark:placeholder:text-light/35 dark:focus:border-secondary_light/40 dark:focus:ring-white/5";

const labelClassName =
  "block text-sm font-semibold font-DMsans text-dark/80 dark:text-light/80";

const AdminForm = ({ onSuccess }) => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    confirmPassword: "",
    name: "",
    role: "active",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    setLoading(true);
    try {
      const { confirmPassword, ...dataToSend } = formData;
      await api.post(API_ENDPOINTS.CREATE_ADMIN, dataToSend);
      toast.success("Admin created successfully");
      setFormData({
        username: "",
        password: "",
        confirmPassword: "",
        name: "",
        role: "active",
      });
      onSuccess();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to create admin");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="overflow-hidden rounded-md border border-border bg-white shadow-[0_24px_60px_rgba(20,20,20,0.08)] dark:border-white/10 dark:bg-surface_dark">
      <form onSubmit={handleSubmit} className="p-2 md:p-4">
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <div>
            <label htmlFor="username" className={labelClassName}>
              Username
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              autoComplete="username"
              placeholder="Enter username"
              required
              className={inputClassName}
            />
          </div>

          <div>
            <label htmlFor="name" className={labelClassName}>
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              autoComplete="name"
              placeholder="Enter full name"
              required
              className={inputClassName}
            />
          </div>

          <div>
            <label htmlFor="password" className={labelClassName}>
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              autoComplete="new-password"
              placeholder="Minimum 6 characters"
              required
              minLength="6"
              className={inputClassName}
            />
          </div>

          <div>
            <label htmlFor="confirmPassword" className={labelClassName}>
              Confirm Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              autoComplete="new-password"
              placeholder="Repeat password"
              required
              className={inputClassName}
            />
          </div>

          <div>
            <label htmlFor="role" className={labelClassName}>
              Role
            </label>
            <select
              id="role"
              name="role"
              value={formData.role}
              onChange={handleChange}
              className={inputClassName}>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>

          <div className="flex items-end">
            <Button
              type="submit"
              disabled={loading}
              className="h-12 w-full rounded-md bg-orange-500 text-white px-6 font-DMsans text-sm font-semibold  hover:bg-orange-600 dark:hover:bg-orange-600">
              {loading ? "Creating..." : "Create Admin"}
            </Button>
          </div>
        </div>
      </form>
    </section>
  );
};

export default AdminForm;
