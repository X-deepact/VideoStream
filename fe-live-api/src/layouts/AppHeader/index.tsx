import { SidebarTriggerHangBurger } from '@/components/CustomSidebar';
import { siteData } from '@/data/site';
import UserAvatar from './UserAvatar';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Bell, PodcastIcon, Radio, Search } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  CATEGORY_FILTER_KEYWORD,
  FEED_PATH,
  getFEUrl,
  GLOBAL_CATEGORY_FILTERABLE_PAGES,
  GLOBAL_CONTENT_UNSEARCHABLE_PAGES,
  LIVE_STREAM_PATH,
  WATCH_LIVE_PATH,
  WATCH_VIDEO_PATH,
} from '@/data/route';
import useUserAccount from '@/hooks/useUserAccount';
import { USER_ROLE } from '@/data/types/role';
import React, {
  lazy,
  Suspense,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { Badge } from '@/components/ui/badge';
import TooltipComponent from '@/components/TooltipComponent';
import { useFeedSearch } from '@/context/SearchContext';
import { debounce } from 'lodash';
import { useIsMobile } from '@/hooks/useMobile';
import SearchBox from './SearchBox';
import CategoryPills from '@/components/CategoryPills';
import { CategoryResponse } from '@/data/dto/category';
import { useCategory } from '@/context/CategoryContext';
import { FixedCategories } from '@/data/types/category';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useNotificationSheet } from '@/hooks/useNotificationsSheet';
import { NotificationItem } from '@/components/Notification/Content';
import { cn } from '@/lib/utils';
import {
  readNotification,
  resetNotificationsCount,
} from '@/services/notification';
import { toast } from 'sonner';
import {
  NOTIFICATION_TYPE,
  NotificationResponse,
} from '@/data/dto/notification';
import { useNotificationWS } from '@/context/NotificationContext';
import { useLiveStreamStatus } from '@/hooks/useLiveStreamStatus';
import useCategories from '@/hooks/useCategories';
import InlineLoading from '@/components/InlineLoading';
const LazyNotificationContent = lazy(
  () => import('@/components/Notification/Content')
);

const AppHeader = React.memo(() => {
  const { pathname } = useLocation();
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const currentUser = useUserAccount();
  const handleGoLive = () => navigate(LIVE_STREAM_PATH);

  const isSearchDisabled = useMemo(
    () => GLOBAL_CONTENT_UNSEARCHABLE_PAGES.includes(pathname),
    [pathname]
  );
  const isCategoryFilterEnabled = useMemo(
    () => GLOBAL_CATEGORY_FILTERABLE_PAGES.includes(pathname),
    [pathname]
  );

  const isStreamingLive = useLiveStreamStatus();
  const { isOpen, openSheet, closeSheet } = useNotificationSheet();

  // ----- ✅ SEARCH ----- //
  // --------------------- //
  const { setSearchTerm } = useFeedSearch();
  const [isSmallSearchExpanded, setIsSmallSearchExpanded] = useState(false);

  const debouncedSetSearchTerm = useMemo(
    () =>
      debounce((value: string) => {
        setSearchTerm(value);
      }, 500),
    [setSearchTerm]
  );

  useEffect(() => {
    return () => debouncedSetSearchTerm.cancel();
  }, [debouncedSetSearchTerm]);

  useEffect(() => {
    if (!isMobile) setIsSmallSearchExpanded(false);
  }, [isMobile]);

  // ----- ✅ CATEGORY ----- //
  // ----------------------- //
  const { filteredCategory, setFilteredCategory } = useCategory();
  const {
    categories,
    isLoading: isCategoryFetching,
    error: categoryFetchError,
    fetchCategories,
  } = useCategories({
    initialFetch: false,
    addFixedCategories: true,
  });
  const memoizedFetchCategories = useCallback(fetchCategories, []);

  const handleFilterCategory = (category: CategoryResponse) => {
    setFilteredCategory(category);

    const params = new URLSearchParams(location.search);
    params.set(CATEGORY_FILTER_KEYWORD, String(category.id));

    navigate(`${location.pathname}?${params.toString()}`);
  };

  useEffect(() => {
    if (isCategoryFilterEnabled) memoizedFetchCategories();
  }, [isCategoryFilterEnabled, memoizedFetchCategories]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const categoryId = params.get(CATEGORY_FILTER_KEYWORD);

    if (categoryId) {
      const category = categories.find((c) => String(c.id) === categoryId);
      if (category) setFilteredCategory(category);
      else setFilteredCategory(FixedCategories[0]);
    }
  }, [setFilteredCategory, filteredCategory, categories]);

  // ---- ✅ NOTIFICATIONS -----//
  // -------------------------- //
  const {
    newNotifications,
    count: notiCount,
    setCount: setNotificationsCount,
  } = useNotificationWS(); // useNotificationWebSocket()

  const handleResetNotificationsCount = async () => {
    await resetNotificationsCount();
    setNotificationsCount(0);
  };

  const handleMarkAsRead = (noti: NotificationResponse) => {
    const handleNavigation = async () => {
      try {
        switch (noti.type) {
          case NOTIFICATION_TYPE.SUBSCRIBE_LIVE:
            navigate(getFEUrl(WATCH_LIVE_PATH, noti.stream_id.toString()));
            break;
          case NOTIFICATION_TYPE.SUBSCRIBE_VIDEO:
            navigate(getFEUrl(WATCH_VIDEO_PATH, noti.stream_id.toString()));
            break;
          default:
            break;
        }

        if (!noti.is_read) {
          await readNotification(noti.id);
        }
      } finally {
        //
      }
    };

    handleNavigation();
  };

  useEffect(() => {
    if (newNotifications?.length > 0)
      newNotifications?.map((newNoti: NotificationResponse) => {
        if (!newNoti.is_read)
          return toast(
            <NotificationItem
              notification={newNoti}
              onMarkAsRead={handleMarkAsRead}
            />
          );
      });
  }, [newNotifications]);

  return (
    <header className='flex flex-col fixed top-0 group-has-[[data-collapsible=icon]]/sidebar-wrapper:py-3 z-50 w-full shrink-0'>
      {/* header */}
      <div className='flex justify-between w-full top-0 py-2 border-b dark:border-gray-900 items-center gap-2 transition-[width,height] ease-linear backdrop-blur bg-background/90'>
        {!isSmallSearchExpanded && (
          <div className='px-4 flex items-center gap-1'>
            <SidebarTriggerHangBurger />
            <Button
              variant='ghost'
              onClick={() => navigate(FEED_PATH)}
              size='lg'
              className='px-2 w-[146px]'
            >
              <div className='flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-sidebar-primary-foreground'>
                {siteData.logo && <siteData.logo />}
              </div>
              <div className='grid flex-1 text-left text-sm leading-tight'>
                <span className='truncate font-semibold'>{siteData.name}</span>
                <span className='truncate text-xs'>{siteData.description}</span>
              </div>
            </Button>

            {/* md: search box */}
            {!isSearchDisabled && (
              <div className='hidden md:block lg:hidden'>
                <SearchBox
                  filteredCategory={filteredCategory}
                  onSearch={(value) => debouncedSetSearchTerm(value)}
                />
              </div>
            )}
          </div>
        )}

        {/* lg: search box */}
        {!isSearchDisabled && (
          <div className='w-1/2 md:w-1/3 hidden lg:block'>
            <SearchBox
              filteredCategory={filteredCategory}
              onSearch={(value) => debouncedSetSearchTerm(value)}
            />
          </div>
        )}

        {/* sm: search box is expanded in mobile devices */}
        {!isSearchDisabled && isSmallSearchExpanded && (
          <div className='flex gap-3 w-full mx-4'>
            <TooltipComponent
              text='Back'
              children={
                <Button
                  variant='outline'
                  onClick={() => setIsSmallSearchExpanded(false)}
                >
                  <ArrowLeft className='w-4 h-4' />
                </Button>
              }
            />
            <div className='w-full'>
              <SearchBox
                filteredCategory={filteredCategory}
                onSearch={(value) => debouncedSetSearchTerm(value)}
              />
            </div>
          </div>
        )}

        {/* sm: search box collapsed */}
        {!isSmallSearchExpanded && (
          <div className='flex px-4 justify-between items-center'>
            <div className='ml-auto flex gap-3 items-center'>
              {!isSearchDisabled && (
                <div className='block md:hidden'>
                  <TooltipComponent
                    align='center'
                    text='Search videos'
                    children={
                      <Button
                        size='sm'
                        variant='secondary'
                        onClick={() => {
                          setIsSmallSearchExpanded(true);
                        }}
                      >
                        <Search className='w-6 h-6' />
                      </Button>
                    }
                  />
                </div>
              )}

              {currentUser && currentUser.role_type === USER_ROLE.STREAMER && (
                <>
                  {isStreamingLive ? (
                    <Badge
                      variant='destructive'
                      className='bg-red-600 gap-1 rounded-sm'
                    >
                      <PodcastIcon className='w-3 h-3' /> LIVE
                    </Badge>
                  ) : (
                    <Button
                      size='sm'
                      className='rounded-full'
                      onClick={handleGoLive}
                    >
                      <Radio />
                      Go Live
                    </Button>
                  )}
                </>
              )}
              <Sheet open={isOpen} onOpenChange={closeSheet}>
                <SheetTrigger asChild>
                  <TooltipComponent text='Notifications' align='center'>
                    <Button
                      size='icon'
                      className={cn(
                        'relative rounded-full p-3 px-2 bg-transparent shadow-none dark:bg-transparent hover:bg-muted dark:hover:bg-secondary'
                      )}
                      onClick={() => {
                        openSheet();
                        handleResetNotificationsCount();
                      }}
                    >
                      <Bell
                        className='text-black dark:text-white'
                        style={{ width: '20px', height: '20px' }}
                      />
                      {notiCount > 0 && (
                        <div className='absolute bg-red-500 text-white px-1 max-content rounded-full text-[9px] -top-0.5 right-0 w-5 h-5'>
                          {notiCount < 100 ? notiCount : '99+'}
                        </div>
                      )}
                    </Button>
                  </TooltipComponent>
                </SheetTrigger>
                <SheetContent
                  side='right'
                  className='w-[500px] p-0 overflow-y-auto'
                >
                  <Suspense fallback={<InlineLoading />}>
                    <LazyNotificationContent closeSheet={closeSheet} />
                  </Suspense>
                </SheetContent>
              </Sheet>
              <UserAvatar />
            </div>
          </div>
        )}
      </div>

      {/* categories */}
      {isCategoryFilterEnabled &&
        !isCategoryFetching &&
        !categoryFetchError && (
          <div className='px-6 py-2 bg-background border-b dark:border-gray-900'>
            <CategoryPills
              isLoading={isCategoryFetching}
              categories={categories}
              filteredCategory={filteredCategory}
              categoryFetchError={categoryFetchError}
              onSelect={handleFilterCategory}
            />
          </div>
        )}
    </header>
  );
});

export default AppHeader;
