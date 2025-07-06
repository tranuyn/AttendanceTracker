import { useApi } from "../api/rest-util";

export function useComplainService() {
  const { get, patch, postForm, put } = useApi();

  const getWithMonth = (params) => get("/complains/get-by-month", params);

  const changeStatus = async (id, data) => {
    return await patch(`/complains/update-status/${id}`, data);
  };

  const createComplain = async (body) => {
    return await postForm("/complains/create", body);
  };

  const updateComplain = async (id, body) => {
    return await put(`/complains/update/${id}`, body);
  };

  return { getWithMonth, changeStatus, createComplain, updateComplain };
}
