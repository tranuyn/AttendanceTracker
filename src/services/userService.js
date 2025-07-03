import { useApi } from "../api/rest-util";

export function useUserService() {
  const { get } = useApi();

  const getAllUsers = async () => {
    return await get("/users");
  };


  return { getAllUsers };
}
