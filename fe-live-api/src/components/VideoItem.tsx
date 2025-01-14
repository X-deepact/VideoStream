import React from 'react';
import { StreamsResponse } from '@/data/dto/stream';
import {
  getFormattedDate,
  getMicrosecondsToHHMMSS,
  getTimeAgoFormat,
} from '@/lib/date-time';
import { Badge } from './ui/badge';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  STREAMER_PROFILE_PATH,
  WATCH_LIVE_PATH,
  WATCH_VIDEO_PATH,
} from '@/data/route';
import { CONTENT_STATUS } from '@/data/types/stream';
import AuthImage from './AuthImage';
import AppAvatar from './AppAvatar';
import { useIsMobile } from '@/hooks/useMobile';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { LucideIcon, MoreVertical } from 'lucide-react';
import { Button } from './ui/button';
import { cn } from '@/lib/utils';

interface VideoItemProps {
  video: StreamsResponse;
  isSingle?: boolean; // not in grid
  isGrid?: boolean;
  actions?: Array<{
    Icon?: LucideIcon;
    isIconActive?: boolean;
    label: string;
    onClick: (video: StreamsResponse) => void;
  }>;
}

const VideoItem: React.FC<VideoItemProps> = ({
  video,
  isSingle = true,
  isGrid = false,
  actions,
}) => {
  const isMobile = useIsMobile();
  const navigate = useNavigate();

  const isSingleStyleMobile = isMobile && isSingle;
  const isVideo = video.status === CONTENT_STATUS.VIDEO;
  const isLive = video.status === CONTENT_STATUS.LIVE;
  const isUpcoming = video.status === CONTENT_STATUS.UPCOMING;

  const handleWatchVideo = () => {
    let path = '';
    if (isLive || isUpcoming)
      path = WATCH_LIVE_PATH.replace(':id', video.id.toString());
    else path = WATCH_VIDEO_PATH.replace(':id', video.id.toString());
    navigate(path);
  };

  return (
    <div
      className="overflow-hidden relative cursor-pointer"
      onClick={handleWatchVideo}
    >
      <div
        className={cn(
          isSingleStyleMobile ? 'flex flex-col gap-4' : 'flex gap-4',
          isGrid && 'flex-col'
        )}
      >
        {/* 1) thumbnail */}
        <div
          className={cn(
            'overflow-hidden aspect-video rounded-lg hover:rounded-none border border-transparent hover:border-primary hover:border-4 transition-all ease-in-out duration-300 relative',
            !isGrid && 'md:max-w-[350px] md:min-w-[240px]'
          )}
        >
          {/* live status */}
          {isLive && (
            <Badge
              variant="destructive"
              className="absolute top-2.5 left-2.5 bg-red-600 text-white text-xs font-bold py-0.5 px-1 rounded-[5px]"
            >
              LIVE
            </Badge>
          )}

          {/* upcoming status */}
          {isUpcoming && (
            <Badge className="absolute top-2.5 left-2.5 bg-green-600 hover:bg-green-800 text-white text-xs font-bold py-0.5 px-1 rounded-[5px]">
              Upcoming
            </Badge>
          )}

          {/* duration */}
          {isVideo && (
            <OverlayStats
              classes="top-2 left-2"
              content={getMicrosecondsToHHMMSS(video?.duration)}
            />
          )}

          {/* views */}
          {isVideo && (
            <OverlayStats
              classes="bottom-2 left-2"
              content={`${video?.views} view${video?.views > 1 ? 's' : ''}`}
            />
          )}

          {/* uploaded/streamed/upcoming time */}
          {isLive && (
            <OverlayStats
              classes="bottom-2 right-2"
              content={`Live ${getTimeAgoFormat(video.started_at)}`}
            />
          )}
          {isVideo && (
            <OverlayStats
              classes="bottom-2 right-2"
              content={getTimeAgoFormat(video.started_at)}
            />
          )}
          {isUpcoming && (
            <OverlayStats
              classes="bottom-2 right-2"
              content={`Live on ${getFormattedDate(
                new Date(video?.scheduled_at || ''),
                true
              )}`}
            />
          )}

          {/* thumbnail image */}
          <AuthImage
            isThumbnail
            src={video.thumbnail_url}
            alt={video.title}
            className="w-full h-full object-cover"
          />
        </div>

        {/* 2) title, avatar, datetime */}
        <div
          className={cn(
            'flex gap-4 w-full md:w-1/2',
            isGrid ? 'md:w-full' : ''
          )}
        >
          {(isSingleStyleMobile || isGrid) && (
            <AppAvatar classes="w-10 h-10" url={video?.avatar_file_url} />
          )}
          <div className="space-y-1 flex-1">
            {/* title - 2 lines at most */}
            <p
              title={video.title}
              className={cn(
                isSingleStyleMobile ? 'text-lg' : 'text-base md:text-lg',
                'hover:text-primary font-bold line-clamp-2 text-ellipsis'
              )}
            >
              {video.title}
            </p>

            {/* avatar and streamer name */}
            <div className="flex gap-2 md:items-center">
              {!isGrid && (
                <div className="hidden md:block md:mt-2">
                  <AppAvatar classes="w-10 h-10" url={video?.avatar_file_url} />
                </div>
              )}
              <NavLink
                to={`${STREAMER_PROFILE_PATH}/${video.user_id}`}
                className="text-sm font-medium text-muted-foreground"
              >
                {video.display_name}
              </NavLink>
            </div>
          </div>
          {!!actions && actions.length > 0 && (
            <div>
              <Actions actions={actions} video={video} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VideoItem;

const OverlayStats = ({
  content,
  classes,
}: {
  content: string | JSX.Element;
  classes: string;
}) => {
  return (
    <div
      className={cn(
        'absolute bg-black/40 backdrop-blur text-white z-10 text-xs p-1 py-0.5 rounded-[5px]',
        classes
      )}
    >
      {content}
    </div>
  );
};

const Actions = ({
  actions,
  video,
}: {
  actions: Array<{
    Icon?: LucideIcon;
    isIconActive?: boolean;
    label: string;
    onClick: (video: StreamsResponse) => void;
  }>;
  video: StreamsResponse;
}) => {
  return (
    <div className="flex items-start">
      <DropdownMenu>
        <DropdownMenuTrigger>
          <Button size="icon" variant="ghost" className="px-2.5 outline-none">
            <MoreVertical className="w-5 h-5 cursor-pointer text-muted-foreground hover:text-primary" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {actions?.map((action, idx) => (
            <DropdownMenuItem
              key={idx}
              className="cursor-pointer"
              onClick={(e) => {
                e.stopPropagation();
                action.onClick(video);
              }}
            >
              {action.Icon && (
                <action.Icon
                  className={cn(
                    action?.isIconActive ? 'fill-primary text-primary' : ''
                  )}
                />
              )}
              {action.label}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
