export type StreamInitializeFields = {
  title: string;
  description: string | undefined;
  streamType: STREAM_TYPE;
  thumbnailImage: File | null;
};

export enum STREAM_TYPE {
  'CAMERA' = 'camera',
  'SOFTWARE' = 'software',
}
