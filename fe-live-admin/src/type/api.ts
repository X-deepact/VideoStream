import { SORT_ORDER } from "@/lib/validation";

export interface PaginatedResponse<T> {
  code: number;
  message: string;
  data: {
    index: number;
    current_page: number;
    length: number;
    total_items: number;
    page_size: number;
    next: number;
    page: T[];
  };
}

export interface ApiError {
  code: number;
  message: string;
}

export type ApiResult<T> = {
  data: T;
  message: string;
  code: number;
  error?: ApiError | string | number | undefined;
};

export interface CommonQueryStrings extends Record<string, unknown> {
  page?: number;
  limit?: number;
  keyword?: string;
  sortBy?: string;
  sort?: SORT_ORDER;
}

export type CommonQueryStringsType = CommonQueryStrings;
export interface Video {
  id: number;
  title: string;
  description: string;
  broadcast_url: string;
  stream_type: string;
  thumbnail_file_name: string;
  started_at: string;
  ended_at: string;
  user: [];
  categories: [];
  live_stream_analytic: [];
  schedule_stream: [];
}
