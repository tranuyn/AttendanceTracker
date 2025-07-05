import { useApi } from "../api/rest-util";

export function useAttendanceService() {
  const { get, post } = useApi();

  const checkInWithImage = async () => {
    return await post("/attendance/checkin");
  };

  const checkOutWithImage = async () => {
    return await post("/attendance/checkout");
  };

  return { checkInWithImage, checkOutWithImage };
}
