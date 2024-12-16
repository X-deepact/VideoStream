import _ from 'lodash';
import { apiInitializeStream } from '@/api/stream';
import { ServiceResponse } from '@/data/api';
import { StreamInitializeResponse } from '@/data/dto/stream';
import { STREAM_TYPE } from '@/types/stream';
import { StreamInitializeRules } from '@/data/validations';
import { StreamInitializeFields } from '@/types/stream';

export enum StreamInitializeError {
  INVALID_TITLE = 'INVALID_TITLE',
  INVALID_DESCRIPTION = 'INVALID_DESCRIPTION',
  INVALID_STREAM_TYPE = 'INVALID_STREAM_TYPE',
  INVALID_THUMBNAIL_IMAGE = 'INVALID_THUMBNAIL_IMAGE',
  ACTION_FAILURE = 'ACTION_FAILURE',
}

export const initializeStream = async ({
  title,
  description,
  streamType,
  thumbnailImage,
}: StreamInitializeFields): Promise<
  ServiceResponse<StreamInitializeResponse, StreamInitializeError>
> => {
  let errors: Partial<Record<StreamInitializeError, boolean>> = {};
  let titleFailure = false,
    descriptionFailure = false,
    streamTypeFailure = false,
    thumbnailImageFailure = false;

  if (
    !title ||
    title.length < StreamInitializeRules.title.min ||
    title.length > StreamInitializeRules.title.max
  )
    titleFailure = true;
  if (!description || description.length === 0) descriptionFailure = true;
  if (!Object.values(STREAM_TYPE)?.includes(streamType))
    streamTypeFailure = true;
  if (thumbnailImage === null) thumbnailImageFailure = true;

  let result: StreamInitializeResponse | undefined = undefined;
  let msg: string = '';
  if (
    !titleFailure &&
    !descriptionFailure &&
    !streamTypeFailure &&
    !thumbnailImageFailure
  ) {
    const { data, error, message } = await apiInitializeStream({
      title,
      description,
      streamType,
      thumbnailImage,
    });
    if (!error && !_.isEmpty(data)) {
      errors = {};
      const { id, title, description, thumbnail_url, push_url, broadcast_url } =
        data; // code, message, data

      result = {
        id,
        title,
        description,
        thumbnail_url,
        push_url,
        broadcast_url,
      };
    } else {
      msg = message;
    }
  } else {
    errors[StreamInitializeError.INVALID_TITLE] = titleFailure;
    errors[StreamInitializeError.INVALID_DESCRIPTION] = descriptionFailure;
    errors[StreamInitializeError.INVALID_STREAM_TYPE] = streamTypeFailure;
    errors[StreamInitializeError.INVALID_THUMBNAIL_IMAGE] =
      thumbnailImageFailure;
  }

  return {
    data: result,
    errors: Object.keys(errors).length
      ? (errors as Record<StreamInitializeError, boolean>)
      : undefined,
    message: msg,
  };
};
