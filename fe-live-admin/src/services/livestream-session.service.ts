import axios from "axios";
import authHeader from "@/services/auth-header.ts";
import {
  formatDateToCustomFormat,
  getTimezoneOffsetAsHoursAndMinutes,
} from "@/lib/date-formated.ts";

const API_URL = import.meta.env.VITE_API_BASE_URL + "/api/streams";

export const getLivestreamSessionList = (
  page: number = 1,
  options?: string[]
) => {
  const additionalParams = options?.length
    ? options.map((option) => option.replace("=", "=")).join("&")
    : "";

  const URL = `${API_URL}?page=${page}&limit=10&sort_by=started_at&sort=DESC${
    additionalParams ? `&${additionalParams}` : ""
  }`;
  return axios.get(URL, {
    headers: authHeader(),
  });
};

export const createNewLivestreamSession = (body: any) => {
  const formData = new FormData();

  for (const key in body) {
    if (Array.isArray(body[key])) {
      const values =
        key === "category_ids"
          ? body[key].map((value) => JSON.stringify(value))
          : [JSON.stringify(body[key])];

      values.forEach((value) => formData.append(key, value));
    } else {
      formData.append(key, body[key]);
    }
  }

  return axios.post(`${API_URL}`, formData, {
    headers: {
      ...authHeader(),
      "Content-Type": "multipart/form-data",
    },
  });
};

export const getStreamById = (id: string, opt?: { signal: AbortSignal }) => {
  return axios.get(`${API_URL}/${id}`, {
    headers: authHeader(),
    signal: opt?.signal,
  });
};

export const updateStreamThumbnail = (id: string, thumbnail: File) => {
  const body = {
    thumbnail: thumbnail,
  };
  return axios.patch(`${API_URL}/${id}/change-thumbnail`, body, {
    headers: {
      ...authHeader(),
      "Content-Type": "multipart/form-data",
    },
  });
};

export const updateStreamDetail = (id: string, body: any) => {
  return axios.patch(`${API_URL}/${id}`, body, {
    headers: authHeader(),
  });
};

export const updateStreamScheduledTimeAndVideo = (
  id: string,
  date: Date,
  video?: File
) => {
  const body = new FormData();
  body.append(
    "scheduled_at",
    formatDateToCustomFormat(date, getTimezoneOffsetAsHoursAndMinutes())
  );

  if (video) body.append("video", video);

  return axios.patch(`${API_URL}/${id}/scheduled`, body, {
    headers: {
      ...authHeader(),
      "Content-Type": "multipart/form-data",
    },
  });
};

export const endLivestreamSession = (id: string) => {
  return axios.post(
    `${API_URL}/${id}/end_live`,
    {},
    {
      headers: authHeader(),
    }
  );
};
