export const fetchWithAuth = async (url: string, options: RequestInit = {}) => {
  const token = localStorage.getItem("token");

  const res = await fetch(url, {
    ...options,
    headers: {
      ...options.headers,
      Authorization: `Bearer ${token}`,
    },
  });

  if (res.status === 401 || res.status === 403) {
    // Token invalid or expired
    localStorage.removeItem("token");
    window.location.href = "/signup";
    alert("Your session has expired. Please sign in again.");
    throw new Error("Unauthorized - Token expired");
  }

  return res;
};