export const API_BASE_URL = "https://clismabackend-0-0-1.onrender.com";

type LoginRequestBody = {
  username: string;
  password: string;
};

type LoginSuccessResponse = {
  token: string;
};

type LoginErrorResponse = {
  status: number;
  code: string;
  message: string;
};

export async function loginRequest(body: LoginRequestBody): Promise<LoginSuccessResponse> {
  const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  const isJson = response.headers.get("content-type")?.includes("application/json");
  const data = isJson ? await response.json() : undefined;

  if (!response.ok) {
    const errorData = (data as LoginErrorResponse) || {
      status: response.status,
      code: "UNKNOWN_ERROR",
      message: "Unexpected error",
    };
    throw new Error(errorData.message || "Login failed");
  }

  return data as LoginSuccessResponse;
}


