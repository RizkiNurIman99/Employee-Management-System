const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

if (!API_BASE_URL) {
  throw new Error("Environment variable VITE_API_BASE_URL is missing!");
}

const API_ENDPOINTS = {
  LOGIN: `${API_BASE_URL}/login`,

  AVATAR: `${API_BASE_URL}/avatar`,
  EMPLOYEES: `${API_BASE_URL}/employees`,
  CREATE_EMPLOYEE: `${API_BASE_URL}/createEmployee`,
  UPDATE_EMPLOYEE: `${API_BASE_URL}/updateEmployee`,
  DELETE_EMPLOYEE: `${API_BASE_URL}/deleteEmployee`,
  TODAYS_ATTENDANCE: `${API_BASE_URL}/attendance`,
  MANUAL_CHECKIN: `${API_BASE_URL}/attendance/manual-checkIn`,
  MANUAL_CHECKOUT: `${API_BASE_URL}/attendance/manual-checkOut`,
  MANUAL_MARK_STATUS: `${API_BASE_URL}/attendance/mark-status`,
  GET_MANUAL_ATTEND: `${API_BASE_URL}/employees/manualAttend`,
  GET_ALL_TODAYS_ATTENDANCE: `${API_BASE_URL}/attendance/attendances`,
  DELETE_ATTENDANCE_RECORD: `${API_BASE_URL}/attendance/delete-record`,

  DAILY_REPORT: `${API_BASE_URL}/attendance-report/daily-report`,
};

export default API_ENDPOINTS;
