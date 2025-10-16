export const API_BASE_URL = "http://localhost:8082";
export const REALTIME_BASE_URL = "http://172.16.0.174:5000";

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
  mq7: number;
  coPpm: number;
  aqi: number;
  mq135: number;
  mq135R: number;
  mq7R: number;
};

export async function getEmissionAverages(): Promise<EmissionAverages> {
  const data = await authorizedGet("/api/emissionRecords/averages");
  // Basic validation to ensure expected numeric properties exist
  const obj = data as Partial<EmissionAverages> | undefined;
  if (!obj) throw new Error("No data returned");
  const required: (keyof EmissionAverages)[] = [
    "mq7",
    "coPpm",
    "aqi",
    "mq135",
    "mq135R",
    "mq7R",
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
    "mq7",
    "coPpm",
    "aqi",
    "mq135",
    "mq135R",
    "mq7R",
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

export type HighestPolluter = {
  mq7: number;
  licensePlate: string;
  recordCount: number;
  coPpm: number;
  aqi: number;
  mq135: number;
  mq135R: number;
  mq7R: number;
  totalScore: number;
  vehicleType: string;
};

export async function getHighestPollutingVehicles(
  pollutantType: string = "total",
  limit: number = 10
): Promise<HighestPolluter[]> {
  const params = new URLSearchParams({
    pollutantType: pollutantType,
    limit: limit.toString(),
  });
  const data = await authorizedGet(`/api/emissionRecords/highest-polluters?${params}`);
  return data as HighestPolluter[];
}

// Reports (binary downloads)
export async function fetchReportPdf(): Promise<Blob> {
  const response = await authorizedFetch(`/api/reports/pdf`, {
    method: "GET",
    headers: { accept: "*/*" },
  });
  if (!response.ok) {
    throw new Error(`Failed to fetch PDF report (${response.status})`);
  }
  return await response.blob();
}

export async function fetchReportCsv(): Promise<Blob> {
  const response = await authorizedFetch(`/api/reports/csv`, {
    method: "GET",
    headers: { accept: "*/*" },
  });
  if (!response.ok) {
    throw new Error(`Failed to fetch CSV report (${response.status})`);
  }
  return await response.blob();
}

// Adjustable emission averages over an interval
export type AdjustableInterval = "hour" | "day" | "month" | "year";

export type AdjustableAveragesResponse = Record<string, EmissionAverages>;

export async function getAdjustableEmissionAverages(
  startDate: string,
  endDate: string,
  interval: AdjustableInterval
): Promise<AdjustableAveragesResponse> {
  const params = new URLSearchParams({
    startDate,
    endDate,
    interval,
  });
  const data = await authorizedGet(`/api/emissionRecords/averages/adjustable?${params.toString()}`);
  // Basic shape check: ensure values match EmissionAverages keys
  const obj = (data || {}) as Record<string, Partial<EmissionAverages>>;
  for (const key of Object.keys(obj)) {
    const entry = obj[key];
    const required: (keyof EmissionAverages)[] = ["mq7", "coPpm", "aqi", "mq135", "mq135R", "mq7R"];
    for (const k of required) {
      if (typeof entry[k] !== "number") {
        throw new Error(`Invalid adjustable averages at '${key}': missing ${k}`);
      }
    }
  }
  return data as AdjustableAveragesResponse;
}

// Alerts (paginated list and delete)
export type AlertItem = {
  id: number;
  type: string;
  message: string;
  sentTo: string;
  status: string;
  vehicleDetectionId: number | null;
};

export type AlertsResponse = {
  content: AlertItem[];
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

export async function getAlerts(
  page: number = 0,
  size: number = 10,
  sort: string = "id,ASC"
): Promise<AlertsResponse> {
  const params = new URLSearchParams({
    page: String(page),
    size: String(size),
    sort,
  });
  const data = await authorizedGet(`/api/alerts/search?${params.toString()}`);
  return data as AlertsResponse;
}

export async function deleteAlert(id: number): Promise<void> {
  const response = await authorizedFetch(`/api/alerts/${id}`, { method: "DELETE" });
  if (response.status !== 204 && !response.ok) {
    throw new Error(`Failed to delete alert (${response.status})`);
  }
}

// Sensors data
export type SensorsData = {
  reading_count: number;
  sensors: {
    mq: {
      connected: boolean;
      data: {
        AQI: number;
        CO_PPM: number;
        MQ135: number;
        MQ135_R: number;
        MQ7: number;
        MQ7_R: number;
      };
      fresh: boolean;
      visible: boolean;
      warming_up: boolean;
      warmup_remaining: number;
    };
    pm25: {
      connected: boolean;
      fresh: boolean;
      unit: string;
      value: number;
      visible: boolean;
    };
    ultrasonic: {
      actual_distance: number | null;
      detection_state: string;
      direction: string | null;
      enabled: boolean;
      path_type: string | null;
      sensor1: number | null;
      sensor2: number | null;
      speed: number | null;
      unit: string;
      vehicle_detected: boolean;
    };
  };
  status: {
    mq_sensors: string;
    pms5003: string;
    ultrasonic: string;
  };
  timestamp: string;
  vehicle_detection: {
    active: boolean;
    message: string;
  };
};

async function sensorsAuthorizedFetch(path: string, init?: RequestInit): Promise<Response> {
  const { accessToken, refreshToken, setAccessToken, clearAuth } = useAuthStore.getState();
  const doFetch = async (token?: string) => {
    const headers: Record<string, string> = {
      ...(init?.headers as Record<string, string> | undefined),
    };
    if (token) headers["Authorization"] = `Bearer ${token}`;
    return fetch(`${REALTIME_BASE_URL}${path}`, {
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

export async function getSensorsData(): Promise<SensorsData> {
  const response = await sensorsAuthorizedFetch("/api/sensors", { 
    method: "GET", 
    headers: { accept: "application/json" } 
  });
  const isJson = response.headers.get("content-type")?.includes("application/json");
  const data = isJson ? await response.json() : undefined;
  if (!response.ok) {
    const message = (data as { message?: string } | undefined)?.message || `Request failed (${response.status})`;
    throw new Error(message);
  }
  return data as SensorsData;
}

