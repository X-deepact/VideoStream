import React from 'react';
import { VirtuosoGrid } from 'react-virtuoso';
import { Bookmark } from 'lucide-react';
import VideoItem from '@/components/VideoItem';
import { StreamsResponse } from '@/data/dto/stream';

interface VideoListProps {
  videos: StreamsResponse[];
  className?: string;
  onBookmarkVideo: (video: StreamsResponse) => void;
}

const VideoList: React.FC<VideoListProps> = ({
  videos,
  className,
  onBookmarkVideo,
}) => {
  const List = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement>
  >(({ style, children, ...props }, ref) => (
    <div
      ref={ref}
      {...props}
      style={{ ...style }}
      className='grid gap-4 grid-cols-[repeat(auto-fill,minmax(300px,1fr))]'
    >
      {children}
    </div>
  ));

  const Item = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement>
  >(({ children, ...props }, ref) => (
    <div ref={ref} {...props}>
      {children}
    </div>
  ));

  List.displayName = 'List';
  Item.displayName = 'Item';

  return (
    <div className={`${className}`}>
      <VirtuosoGrid
        useWindowScroll
        style={{ height: window.innerHeight }}
        data={videos}
        itemContent={(_, video) => (
          <div key={video.id}>
            <VideoItem
              key={video.id}
              video={video}
              isSingle={false}
              isGrid
              actions={[
                {
                  Icon: Bookmark,
                  isIconActive: video.is_saved,
                  label: video.is_saved ? 'Bookmarked' : 'Bookmark',
                  onClick: () => onBookmarkVideo(video),
                },
              ]}
            />
          </div>
        )}
        components={{
          List,
          Item,
        }}
      />
    </div>
  );
};

export default VideoList;
