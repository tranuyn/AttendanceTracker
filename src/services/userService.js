import { useApi } from "../api/rest-util";

export function useUserService() {
  const { get, patch } = useApi();

  const getMe = async () => {
    return await get("/users/me");
  };

  const getAllUsers = async () => {
    return await get("/users/all");
  };

  const updateUser = async (id, data) => {
    return await patch(`/users/${id}`, data);
  };

  return { getMe, getAllUsers, updateUser };
}
