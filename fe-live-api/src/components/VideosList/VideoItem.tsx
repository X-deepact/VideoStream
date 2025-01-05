import React from 'react';
import { StreamsResponse } from '@/data/dto/stream';
import { getTimeAgoFormat } from '@/lib/date-time';
import { Badge } from '../ui/badge';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  STREAMER_PROFILE_PATH,
  WATCH_LIVE_PATH,
  WATCH_VIDEO_PATH,
} from '@/data/route';
import { CONTENT_STATUS } from '@/data/types/stream';
import TooltipComponent from '../TooltipComponent';
import AuthImage from '../AuthImage';
import AppAvatar from '../AppAvatar';

interface VideoItemProps {
  video: StreamsResponse;
}

const VideoItem: React.FC<VideoItemProps> = ({ video }) => {
  const navigate = useNavigate();

  const isLive = video.status === CONTENT_STATUS.LIVE;

  const handleWatchVideo = () => {
    let path = '';
    if (isLive) path = WATCH_LIVE_PATH.replace(':id', video.id.toString());
    else path = WATCH_VIDEO_PATH.replace(':id', video.id.toString());
    navigate(path);
  };

  return (
    <div
      className={`overflow-hidden relative cursor-pointer group`}
      onClick={handleWatchVideo}
    >
      {video.status === 'live' && (
        <Badge
          variant="destructive"
          className="absolute top-2.5 left-2.5 bg-red-600 text-white text-xs font-bold py-0.5 px-1 rounded-[5px]"
        >
          LIVE
        </Badge>
      )}

      <div
        className={`overflow-hidden aspect-video rounded-lg border border-background group-hover:border-primary group-hover:border-spacing-3 group-hover:border-4 transition-all ease-in-out duration-300`}
      >
        <AuthImage
          src={video.thumbnail_url}
          alt={video.title}
          className="w-full h-full object-cover"
        />
      </div>

      <div className="flex gap-4 mt-3">
        <AppAvatar url={video?.avatar_file_url || ''} />

        <div className="space-y-1">
          <TooltipComponent
            text={video.title}
            children={
              <p className="font-semibold text-base line-clamp-2 text-ellipsis">
                {video.title}
              </p>
            }
          />
          <div>
            <NavLink
              to={`${STREAMER_PROFILE_PATH}/${video.user_id}`}
              className="text-sm font-medium text-muted-foreground"
            >
              {video.display_name}
            </NavLink>
            <p className="text-xs text-muted-foreground">
              {video.status === 'live'
                ? `Live ${getTimeAgoFormat(video.started_at)}`
                : getTimeAgoFormat(video.started_at)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoItem;
