export const API_BASE_URL = "http://localhost:8082";

type LoginRequestBody = {
  username: string;
  password: string;
};

type LoginSuccessResponse = {
  token: string; // access token (back-compat)
  refreshToken?: string; // some backends may omit here; ours provides it per sample
};

type RefreshTokenRequest = {
  refreshToken: string;
};

type RefreshTokenResponse = {
  accessToken: string;
  refreshToken: string;
  tokenType?: string;
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

async function refreshAccessToken(refreshToken: string): Promise<RefreshTokenResponse> {
  const response = await fetch(`${API_BASE_URL}/api/auth/refresh-token`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ refreshToken } satisfies RefreshTokenRequest),
  });

  const isJson = response.headers.get("content-type")?.includes("application/json");
  const data = isJson ? await response.json() : undefined;

  if (!response.ok) {
    const message = (data as { message?: string } | undefined)?.message || `Refresh failed (${response.status})`;
    throw new Error(message);
  }
  return data as RefreshTokenResponse;
}

// Attempts to parse a count value from various possible JSON shapes
function parseCountFromData(data: unknown): number {
  if (typeof data === "number") return data;
  if (typeof data === "string") {
    const asNumber = Number(data);
    if (!Number.isNaN(asNumber)) return asNumber;
  }
  if (data && typeof data === "object") {
    const maybe = (data as Record<string, unknown>).count;
    if (typeof maybe === "number") return maybe;
    if (typeof maybe === "string") {
      const asNumber = Number(maybe);
      if (!Number.isNaN(asNumber)) return asNumber;
    }
  }
  throw new Error("Unable to parse count from response");
}

import { useAuthStore } from "@/lib/authStore";

async function authorizedFetch(path: string, init?: RequestInit): Promise<Response> {
  const { accessToken, refreshToken, setAccessToken, clearAuth } = useAuthStore.getState();
  const doFetch = async (token?: string) => {
    const headers: Record<string, string> = {
      ...(init?.headers as Record<string, string> | undefined),
    };
    if (token) headers["Authorization"] = `Bearer ${token}`;
    return fetch(`${API_BASE_URL}${path}`, {
      ...init,
      headers,
    });
  };

  let response = await doFetch(accessToken ?? undefined);
  if (response.status !== 401) return response;

  // Try refresh if we have a refresh token
  if (!refreshToken) {
    clearAuth();
    return response; // propagate 401
  }

  try {
    const refreshed = await refreshAccessToken(refreshToken);
    setAccessToken(refreshed.accessToken);
    response = await doFetch(refreshed.accessToken);
    return response;
  } catch {
    clearAuth();
    return response; // original 401
  }
}

async function authorizedGet(path: string): Promise<unknown> {
  const response = await authorizedFetch(path, { method: "GET", headers: { accept: "application/json" } });
  const isJson = response.headers.get("content-type")?.includes("application/json");
  const data = isJson ? await response.json() : undefined;
  if (!response.ok) {
    const message = (data as { message?: string } | undefined)?.message || `Request failed (${response.status})`;
    throw new Error(message);
  }
  return data;
}

export async function getVehicleDetectionsCount(): Promise<number> {
  const data = await authorizedGet("/api/vehicleDetections/count");
  return parseCountFromData(data);
}

export async function getHotspotsCount(): Promise<number> {
  const data = await authorizedGet("/api/hotspots/count");
  return parseCountFromData(data);
}

export type EmissionAverages = {
  coLevel: number;
  noxLevel: number;
  co2Level: number;
  pm10Level: number;
  pm25Level: number;
};

export async function getEmissionAverages(): Promise<EmissionAverages> {
  const data = await authorizedGet("/api/emissionRecords/averages");
  // Basic validation to ensure expected numeric properties exist
  const obj = data as Partial<EmissionAverages> | undefined;
  if (!obj) throw new Error("No data returned");
  const required: (keyof EmissionAverages)[] = [
    "coLevel",
    "noxLevel",
    "co2Level",
    "pm10Level",
    "pm25Level",
  ];
  for (const k of required) {
    if (typeof obj[k] !== "number") {
      throw new Error(`Invalid averages response: missing ${k}`);
    }
  }
  return obj as EmissionAverages;
}

export async function getEmissionAveragesByVehicleType(vehicleType: string): Promise<EmissionAverages> {
  const data = await authorizedGet(`/api/emissionRecords/averages/vehicleType/${vehicleType}`);
  // Basic validation to ensure expected numeric properties exist
  const obj = data as Partial<EmissionAverages> | undefined;
  if (!obj) throw new Error("No data returned");
  const required: (keyof EmissionAverages)[] = [
    "coLevel",
    "noxLevel",
    "co2Level",
    "pm10Level",
    "pm25Level",
  ];
  for (const k of required) {
    if (typeof obj[k] !== "number") {
      throw new Error(`Invalid averages response: missing ${k}`);
    }
  }
  return obj as EmissionAverages;
}

export type HotspotLocation = {
  id: number;
  name: string;
  description: string;
  latitude: number;
  longitude: number;
  dateCreated: string;
  lastUpdated: string;
};

export type Hotspot = {
  id: number;
  location: HotspotLocation;
  pollutionLevel: number;
};

export type HotspotsResponse = {
  content: Hotspot[];
  pageable: {
    pageNumber: number;
    pageSize: number;
    sort: {
      empty: boolean;
      sorted: boolean;
      unsorted: boolean;
    };
    offset: number;
    paged: boolean;
    unpaged: boolean;
  };
  totalPages: number;
  totalElements: number;
  last: boolean;
  size: number;
  number: number;
  sort: {
    empty: boolean;
    sorted: boolean;
    unsorted: boolean;
  };
  first: boolean;
  numberOfElements: number;
  empty: boolean;
};

export async function getHotspots(
  page: number = 0,
  size: number = 10,
  sort: string = "id,ASC"
): Promise<HotspotsResponse> {
  const params = new URLSearchParams({
    page: page.toString(),
    size: size.toString(),
    sort: sort,
  });
  const data = await authorizedGet(`/api/hotspots/search?${params}`);
  return data as HotspotsResponse;
}

