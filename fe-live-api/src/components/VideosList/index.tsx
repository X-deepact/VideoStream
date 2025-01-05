import React from 'react';
import VideoItem from './VideoItem';
import { StreamsResponse } from '@/data/dto/stream';

interface VideosListProps {
  videos: StreamsResponse[]; // Replace with the correct type for your videos
}

const VideosList: React.FC<VideosListProps> = ({ videos }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {videos.map((video, index) => (
        <VideoItem key={index} video={video} />
      ))}
    </div>
  );
};

export default VideosList;
