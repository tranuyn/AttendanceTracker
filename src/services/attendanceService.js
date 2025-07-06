import { useApi } from "../api/rest-util";
import dayjs from "dayjs";

export function useAttendanceService() {
  const { get, post, postForm } = useApi();

  const checkInWithImage = async (formData) => {
    return await postForm("/attendance/checkin", formData);
  };

  const checkOutWithImage = async (formData) => {
    return await postForm("/attendance/checkout", formData);
  };

  const getReportMonthly = (params) =>
    get("/attendance/report/monthly", params);

  // API cho staff: lấy chấm công tuần này của chính mình
  const getMyWeeklyAttendance = async () => {
    const startOfWeek = dayjs().startOf("week").format("YYYY-MM-DD");
    const endOfWeek = dayjs().endOf("week").format("YYYY-MM-DD");
    return await get(`/attendance/me?from=${"2025-07-01"}&to=${endOfWeek}`);
  };

  // API cho admin: lấy chấm công tuần này của một user cụ thể (bằng userId)
  const getUserWeeklyAttendance = async (userId) => {
    const startOfWeek = dayjs().startOf("week").format("YYYY-MM-DD");
    const endOfWeek = dayjs().endOf("week").format("YYYY-MM-DD");
    return await get(`/attendance/filter?userId=${userId}`);
  };

  return {
    checkInWithImage,
    checkOutWithImage,
    getMyWeeklyAttendance,
    getUserWeeklyAttendance,
    getReportMonthly,
  };
}
