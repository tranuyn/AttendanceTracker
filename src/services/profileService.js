import { useApi } from "../api/rest-util";

export function useProfileService() {
  const { get, patch } = useApi();

  const getMyProfile = async () => {
    return await get("/users/me");
  };
  const updateProfile = async (data) => {
    return await patch("/users/me", data);
  };

  return { getMyProfile, updateProfile };
}
