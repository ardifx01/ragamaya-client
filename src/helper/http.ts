import axios from "axios";
import Cookies from "js-cookie";

const RequestAPI = async (
  path: string,
  method: "get" | "post" | "delete",
  body?: any,
  overrideToPatchMethod?: boolean
) => {
  const token = Cookies.get("access_token");
  const BASE_API_URL = process.env.NEXT_PUBLIC_BASE_API;

  const isGetMethod = method.toLowerCase() === "get";

  try {
    const headers: any = {
      Authorization: `Bearer ${token}`,
    };

    if (!isGetMethod) {
      if (!(body instanceof FormData)) {
        headers["Content-Type"] = "application/json";
      }
      headers["X-HTTP-Method-Override"] = overrideToPatchMethod
        ? "PATCH"
        : method.toUpperCase();
    }

    const response = await axios({
      url: `${BASE_API_URL}${path}`,
      method: overrideToPatchMethod ? "POST" : method,
      headers: headers,

      params: isGetMethod ? body : undefined,
      data: !isGetMethod ? body : undefined,
    });

    return response.data;
  } catch (error: any) {
    console.error("API Request failed:", error);
    throw (
      error.response?.data || new Error(error.message || "API Request failed")
    );
  }
};

export default RequestAPI;
