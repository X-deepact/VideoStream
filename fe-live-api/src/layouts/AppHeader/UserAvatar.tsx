import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/CustomSidebar';
import React, { useEffect, useState } from 'react';
import { Separator } from '@/components/ui/separator';
import { DropdownMenu } from '@/components/ui/dropdown-menu';
import { ModeSwitcher } from '@/components/ModeSwitcher';
import { getLoggedInUserInfo } from '@/data/model/userAccount';
import { useProfileNavItems } from '@/hooks/useProfileNavItems';
import { EVENT_EMITTER_NAME, EventEmitter } from '@/lib/event-emitter';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { getAvatarFallbackText } from '@/lib/utils';
import { USER_ROLE } from '@/data/types/role';

const UserAvatar = React.memo(() => {
  const [isOpen, setIsOpen] = useState(false);

  const currentUser = getLoggedInUserInfo();
  const profileNavItems = useProfileNavItems();

  const [user, setUser] = useState<{
    username: string;
    displayName: string;
    avatarUrl: string;
  }>({
    username: currentUser.username || 'unknown',
    displayName: currentUser.display_name || 'Unknown',
    avatarUrl: currentUser.avatar_file_name || '',
  });

  const handleAccountChange = () => {
    const updatedUser = getLoggedInUserInfo();
    if (updatedUser) {
      setUser({
        username: updatedUser.username || 'unknown',
        displayName: updatedUser.display_name || 'Unknown',
        avatarUrl: updatedUser.avatar_file_name || '',
      });
    }
  };

  useEffect(() => {
    EventEmitter.subscribe(
      EVENT_EMITTER_NAME.USER_PROFILE_UPDATE,
      handleAccountChange
    );

    return () => {
      EventEmitter.unsubscribe(
        EVENT_EMITTER_NAME.USER_PROFILE_UPDATE,
        handleAccountChange
      );
    };
  }, []);

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Avatar className="w-8 h-8 cursor-pointer">
          <AvatarImage src={user?.avatarUrl} />
          <AvatarFallback>
            {getAvatarFallbackText(user?.displayName || 'NA')}
          </AvatarFallback>
        </Avatar>
      </PopoverTrigger>
      <PopoverContent
        className="w-48 overflow-hidden rounded-lg p-0"
        align="end"
      >
        <Sidebar collapsible="none" className="bg-transparent">
          <SidebarContent>
            <div className="flex gap-2 items-center justify-start py-3 pb-2 px-4">
              {/* <AppAvatar url={user?.avatarUrl || ''} /> */}
              <Avatar className="w-8 h-8">
                <AvatarImage src={user?.avatarUrl} />
                <AvatarFallback>
                  {getAvatarFallbackText(user?.displayName || 'NA')}
                </AvatarFallback>
              </Avatar>

              <div className="flex flex-col gap-1">
                <p className="text-sm">{user?.displayName}</p>
                <p className="text-xs -mt-1">@{user?.username}</p>
              </div>
            </div>
            <Separator />
            {profileNavItems.map((group, index) => {
              if (
                group.length === 1 &&
                group[0].accessRoles.length !== 0 &&
                !group[0].accessRoles.includes(
                  currentUser.role_type as USER_ROLE
                )
              )
                return;

              return (
                <SidebarGroup
                  key={index}
                  className="border-b last:border-none pt-0"
                >
                  <SidebarGroupContent className="gap-0">
                    <SidebarMenu>
                      {group.map((item, index) => {
                        if (
                          item.accessRoles.length === 0 ||
                          item.accessRoles.includes(
                            currentUser.role_type as USER_ROLE
                          )
                        )
                          return (
                            <DropdownMenu key={item.label}>
                              <SidebarMenuItem key={index}>
                                <SidebarMenuButton onClick={item?.action}>
                                  {item?.id === 'theme' ? (
                                    <ModeSwitcher label={item.label} />
                                  ) : (
                                    <React.Fragment>
                                      <item.icon /> <span>{item.label}</span>
                                    </React.Fragment>
                                  )}
                                </SidebarMenuButton>
                              </SidebarMenuItem>
                            </DropdownMenu>
                          );
                      })}
                    </SidebarMenu>
                  </SidebarGroupContent>
                </SidebarGroup>
              );
            })}
          </SidebarContent>
        </Sidebar>
      </PopoverContent>
    </Popover>
  );
});

export default UserAvatar;
