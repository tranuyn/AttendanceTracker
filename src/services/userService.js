import { useApi } from "../api/rest-util";

export function useUserService() {
  const { get, patch, post, del } = useApi();

  const getMe = async () => {
    return await get("/users/me");
  };

  const getAllUsers = async () => {
    return await get("/users/all");
  };

  const getUsers = async ({ page = 0, size = 10, sort = "name,asc", searchkey = "" }) => {
    const params = new URLSearchParams({
      page,
      size,
      sort,
    });
    if (searchkey) {
      params.append("searchkey", searchkey);
    }
    return await get(`/users?${params.toString()}`);
  };

  const updateUser = async (id, data) => {
    return await patch(`/users/${id}`, data);
  };
  
  const createUser = async (data) => await post("/users/create", data);

  const deleteUser = async (id) => await del(`/users/${id}`);


  return {
    getMe,
    getAllUsers,
    getUsers,
    createUser,
    updateUser,
    deleteUser,
  };
}
