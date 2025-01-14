export type StreamDetailsUpdateRequest = {
  id?: number;
  title: string;
  description: string | undefined;
  categories: string[];
  streamType: STREAM_TYPE;
  thumbnailImage: File | null;
  thumbnailPreview?: string | null;
};

export enum STREAM_TYPE {
  'CAMERA' = 'camera',
  'SOFTWARE' = 'software',
}

export const enum CONTENT_STATUS {
  LIVE = 'live', // currently streaming
  UPCOMING = 'upcoming', // premire scheduled-streams
  VIDEO = 'video', // stream ended
}

export const enum VIDEO_FETCH_STATUS_CODE {
  ENCODING = 'ENCODING',
  OK = 'OK',
  NOT_FOUND = 'NOT_FOUND',
  UNKNOWN = 'UNKNOWN',
}
