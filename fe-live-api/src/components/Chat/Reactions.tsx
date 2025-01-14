import { Reaction, ReactionIcons, ReactionStats } from '@/data/chat';
import { Button } from '../ui/button';
import { formatKMBCount } from '@/lib/utils';
import { useMemo, useState } from 'react';
import { useSidebar } from '@/components/CustomSidebar';
import { Drawer, DrawerContent, DrawerTrigger } from '@/components/ui/drawer';
import { useMatch } from 'react-router-dom';
import { WATCH_VIDEO_PATH } from '@/data/route';

export interface OnReactOnLiveParams {
  reaction: Reaction;
}

interface ComponentProps {
  stats: {
    likeCount: number;
    likeInfo: ReactionStats;
    currentReactionType?: Reaction;
  };
  onReactOnLive: (params: OnReactOnLiveParams) => void;
}

const Reactions = (props: ComponentProps) => {
  const match = useMatch(WATCH_VIDEO_PATH);

  const { stats, onReactOnLive } = props;
  const { isMobile } = useSidebar();

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const reactions = Object.values(Reaction);

  // determine the most popular reaction
  const mostPopularReaction = useMemo(() => {
    let maxCount = 0;
    let popularReaction: Reaction | null = Reaction.HEART; // default reaction (if there is no reaction count yet)

    reactions.forEach((reaction) => {
      const count = stats.likeInfo[reaction] || 0;
      if (count > maxCount) {
        maxCount = count;
        popularReaction = reaction;
      }
    });

    return popularReaction;
  }, [stats.likeInfo, reactions]);

  const mostPopularCount = formatKMBCount(
    mostPopularReaction ? stats.likeInfo[mostPopularReaction] : 0
  );

  const currentReaction = stats.currentReactionType;
  const currentReactionCount = currentReaction
    ? formatKMBCount(stats.likeInfo[currentReaction])
    : null;

  const triggerReactions = useMemo(() => {
    if (!currentReaction || currentReaction === mostPopularReaction) {
      return [mostPopularReaction];
    }
    return [mostPopularReaction, currentReaction];
  }, [currentReaction, mostPopularReaction]);

  if (isMobile && match) {
    return (
      <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
        <DrawerTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
          >
            {triggerReactions.map((reaction, index) => (
              <div key={reaction} className="flex items-center gap-1">
                <span className="text-lg">{ReactionIcons[reaction]}</span>
                {index === 0 && (
                  <span className="text-sm">{mostPopularCount}</span>
                )}
                {index !== 0 && Number(currentReactionCount) > 0 && (
                  <span className="text-sm">{currentReactionCount}</span>
                )}
              </div>
            ))}
          </Button>
        </DrawerTrigger>
        <DrawerContent>
          <div className="p-4">
            <h3 className="text-lg font-bold mb-4 text-center">Reactions</h3>
            <div className="flex flex-wrap gap-2 items-center justify-center">
              {reactions.map((reaction) => {
                const isActive = stats?.currentReactionType === reaction;
                const reactionCount = formatKMBCount(stats.likeInfo[reaction]);

                return (
                  <Button
                    onClick={() => {
                      onReactOnLive({ reaction });
                      setIsDrawerOpen(false);
                    }}
                    variant="ghost"
                    size="sm"
                    className={`rounded-full ${
                      isActive
                        ? 'bg-primary hover:bg-primary'
                        : 'bg-transparent'
                    }`}
                    key={reaction}
                  >
                    <div className="flex items-center gap-1">
                      <p className="text-lg">{ReactionIcons[reaction]}</p>
                      {reactionCount && (
                        <span
                          className={`text-[9px] ${
                            isActive
                              ? 'text-white'
                              : 'text-black dark:text-white'
                          } `}
                        >
                          {reactionCount}
                        </span>
                      )}
                    </div>
                  </Button>
                );
              })}
            </div>
          </div>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <div
      className="flex justify-between items-center px-0 overflow-x-auto scrollbar-hide  no-scrollbar"
      style={{
        WebkitOverflowScrolling: 'touch',
        scrollbarWidth: 'none',
        msOverflowStyle: 'none',
      }}
    >
      {reactions.map((reaction) => {
        const isActive = stats?.currentReactionType === reaction;

        const reactionCount = formatKMBCount(stats.likeInfo[reaction]);

        return (
          <Button
            onClick={() => onReactOnLive({ reaction })}
            variant="ghost"
            size="sm"
            className={`rounded-full ${
              isActive ? 'bg-primary hover:bg-primary' : 'bg-transparent'
            }`}
            key={reaction}
          >
            <div className="flex items-center gap-1">
              <p className="text-lg">{ReactionIcons[reaction]}</p>
              {reactionCount && (
                <span
                  className={`text-[9px] ${
                    isActive ? 'text-white' : 'text-black dark:text-white'
                  } `}
                >
                  {reactionCount}
                </span>
              )}
            </div>
          </Button>
        );
      })}
    </div>
  );
};

export default Reactions;
