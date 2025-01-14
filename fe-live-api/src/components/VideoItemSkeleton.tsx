import { Skeleton } from './ui/skeleton';

const VideoItemSkeleton = () => {
  return (
    <div className="space-y-3">
      <div className="flex flex-col space-y-3">
        <Skeleton className="h-[150px] min-w-[250px] rounded-xl bg-muted/60" />
        <div className="flex space-x-2">
          <Skeleton className="h-12 w-12 min-w-12 rounded-full bg-muted/60" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-[220px] bg-muted/60" />
            <Skeleton className="h-4 w-[180px] bg-muted/60" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoItemSkeleton;
