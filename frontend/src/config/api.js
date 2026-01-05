const API_BASE_URL = import.meta.VITE_BASE_URL;

const API_ENDPOINTS = {
  LOGIN: `${API_BASE_URL}api/login`,
  REGISTER: `${API_BASE_URL}auth/register`,
  AVATAR: `${API_BASE_URL}avatar`,
  EMPLOYEES: `${API_BASE_URL}api/employees`,
  CREATE_EMPLOYEE: `${API_BASE_URL}api/createEmployee`,
  UPDATE_EMPLOYEE: `${API_BASE_URL}api/updateEmployee`,
  DELETE_EMPLOYEE: `${API_BASE_URL}api/deleteEmployee`,
  TODAYS_ATTENDANCE: `${API_BASE_URL}api/attendance`,
  MANUAL_CHECKIN: `${API_BASE_URL}api/attendance/manual-checkIn`,
  MANUAL_CHECKOUT: `${API_BASE_URL}api/attendance/manual-checkOut`,
  MANUAL_MARK_STATUS: `${API_BASE_URL}api/attendance/mark-status`,
  GET_MANUAL_ATTEND: `${API_BASE_URL}api/employees/manualAttend`,
  GET_ALL_TODAYS_ATTENDANCE: `${API_BASE_URL}api/attendance/attendances`,
  DELETE_ATTENDANCE_RECORD: `${API_BASE_URL}api/attendance/delete-record`,

  DAILY_REPORT: `${API_BASE_URL}api/attendance-report/daily-report`,
};

export default API_ENDPOINTS;
