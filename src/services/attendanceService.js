import { useApi } from "../api/rest-util";
import dayjs from "dayjs";

export function useAttendanceService() {
  const { get, post, postForm, put } = useApi();

  const checkInWithImage = async (formData) => {
    return await postForm("/attendance/checkin", formData);
  };

  const checkOutWithImage = async (formData) => {
    return await postForm("/attendance/checkout", formData);
  };

  // API cho staff: lấy chấm công tuần này của chính mình
  const getMyWeeklyAttendance = async (from, to) => {
    return await get(`/attendance/me?from=${from}&to=${to}`);
  };

  const getReportMonthly = (params) =>
    get("/attendance/report/monthly", params);

  const getReportYearly = async (year, userId) => {
    return await get(`/attendance/report/yearly?year=${year}&userId=${userId}`);
  };
  // API cho admin: lấy tất cả attendance giữa from - to
  const getAttendanceBetween = async (from, to) => {
    return await get(`/attendance/getBetween?from=${from}&to=${to}`);
  };

  const getAllAttendance = async ({ year, month, page = 0, size = 10 }) => {
    let url = `/attendance/all?page=${page}&size=${size}`;
    if (year) url += `&year=${year}`;
    if (month) url += `&month=${month}`;
    return await get(url);
  };

  const updateAttendace = async (id, body) => {
    return await put(`/attendance/update/${id}`, body);
  };
  return {
    checkInWithImage,
    checkOutWithImage,
    getMyWeeklyAttendance,
    getReportMonthly,
    getAttendanceBetween,
    getReportYearly,
    getAllAttendance,
    updateAttendace,
  };
}
