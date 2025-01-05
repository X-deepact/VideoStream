import { Separator } from '@/components/ui/separator';
import { SidebarTriggerHangBurger } from '@/components/CustomSidebar';
import { siteData } from '@/data/site';
import UserAvatar from './UserAvatar';
import { Button } from '@/components/ui/button';
import { PodcastIcon, Radio } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { FEED_PATH, LIVE_STREAM_PATH } from '@/data/route';
import useUserAccount from '@/hooks/useUserAccount';
import { USER_ROLE } from '@/data/types/role';
import React, { useEffect, useState } from 'react';
import { EVENT_EMITTER_NAME, EventEmitter } from '@/lib/event-emitter';
import { Badge } from '@/components/ui/badge';

const AppHeader = React.memo(() => {
  const navigate = useNavigate();
  const currentUser = useUserAccount();
  const handleGoLive = () => navigate(LIVE_STREAM_PATH);

  const [isStreamingLive, setIsStreamingLive] = useState(false);

  const handleLiveStart = () => setIsStreamingLive(true);
  const handleLiveEnd = () => setIsStreamingLive(false);

  // event subscribes
  EventEmitter.subscribe(EVENT_EMITTER_NAME.LIVE_STREAM_START, handleLiveStart);
  EventEmitter.subscribe(EVENT_EMITTER_NAME.LIVE_STREAM_END, handleLiveEnd);

  useEffect(() => {
    // Cleanup subscription on unmount
    return () => {
      EventEmitter.unsubscribe(
        EVENT_EMITTER_NAME.LIVE_STREAM_START,
        handleLiveStart
      );

      EventEmitter.unsubscribe(
        EVENT_EMITTER_NAME.LIVE_STREAM_END,
        handleLiveEnd
      );
    };
  }, []);

  return (
    <header className="flex fixed w-full top-0 py-2 bg-background border-b shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:py-3 z-50">
      <div className="px-4 flex items-center gap-1">
        <SidebarTriggerHangBurger />
        <Button
          variant="ghost"
          onClick={() => navigate(FEED_PATH)}
          size="lg"
          className="px-2 w-[146px]"
        >
          <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-sidebar-primary-foreground">
            {siteData.logo && <siteData.logo />}
          </div>
          <div className="grid flex-1 text-left text-sm leading-tight">
            <span className="truncate font-semibold">{siteData.name}</span>
            <span className="truncate text-xs">{siteData.description}</span>
          </div>
        </Button>
      </div>
      <div className="flex px-4 justify-between items-center w-full">
        <div className="ml-auto flex gap-3 items-center">
          {currentUser && currentUser.role_type === USER_ROLE.STREAMER && (
            <>
              {isStreamingLive ? (
                <Badge
                  variant="destructive"
                  className="bg-red-600 gap-1 rounded-sm"
                >
                  <PodcastIcon className="w-3 h-3" /> LIVE
                </Badge>
              ) : (
                <>
                  <Button size="sm" onClick={handleGoLive}>
                    <Radio />
                    Go Live
                  </Button>
                  <Separator orientation="vertical" className="h-4" />
                </>
              )}
            </>
          )}
          <UserAvatar />
        </div>
      </div>
    </header>
  );
});

export default AppHeader;
