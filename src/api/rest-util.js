import { useAuth0 } from "@auth0/auth0-react";

const TIMEOUT = 30000;
const apiConfig = {
  baseUrl: "http://localhost:8081/",
};

function buildHeaders(token) {
  const headers = {
    "Content-Type": "application/json",
    Accept: "application/json",
  };
  if (token) headers.Authorization = `Bearer ${token.__raw}`;
  return headers;
}

async function withTimeout(promise, ms) {
  const timeout = new Promise((_, reject) =>
    setTimeout(() => reject(new Error("Request timed out")), ms)
  );
  return Promise.race([promise, timeout]);
}

export function useApi() {
  const { getIdTokenClaims, isAuthenticated, isLoading } = useAuth0();

  async function request(path, { method = "GET", data, params } = {}) {
    let url = apiConfig.baseUrl.replace(/\/+$/, "") + path;
    if (params) {
      const qs = new URLSearchParams(params).toString();
      url += "?" + qs;
    }
    
    // Kiểm tra trạng thái Auth0 trước khi gọi API
    if (isLoading) {
      throw new Error("Auth is still loading");
    }
    
    if (!isAuthenticated) {
      window.location.href = "/login";
      return;
    }

    let token;
    try {
      token = await getIdTokenClaims();
      if (!token) throw new Error("No token");
    } catch (error) {
      console.error("Token error:", error);
      // Thay vì redirect ngay, có thể retry hoặc thông báo lỗi
      window.location.href = "/login";
      return;
    }

    const opts = {
      method,
      headers: buildHeaders(token),
    };
    if (data) {
      if (data instanceof FormData) {
        delete opts.headers["Content-Type"];
        opts.body = data;
      } else {
        opts.body = JSON.stringify(data);
      }
    }

    let res;
    try {
      res = await withTimeout(fetch(url, opts), TIMEOUT);
    } catch (err) {
      console.error("Request error:", err);
      throw err;
    }

    if (res.status === 401) {
      window.location.href = "/login";
      return;
    }

    const text = await res.text();
    try {
      return JSON.parse(text);
    } catch {
      return text;
    }
  }

  // các tiện ích
  const get = (path, params) => request(path, { method: "GET", params });
  const post = (path, data) => request(path, { method: "POST", data });
  const postForm = (path, formData) =>
    request(path, { method: "POST", data: formData });
  const put = (path, data) => request(path, { method: "PUT", data });
  const patch = (path, data) => request(path, { method: "PATCH", data });
  const del = (path, params) => request(path, { method: "DELETE", params });

  return { get, post, postForm, put, patch, del };
}