import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import React, { useState } from 'react';
import { Separator } from '@/components/ui/separator';
import { DropdownMenu } from '@/components/ui/dropdown-menu';
import { ModeSwitcher } from '@/components/ModeSwitcher';
import useUserAccount from '@/hooks/useUserAccount';
import { UserAccountModel } from '@/data/model/userAccount';
import { useProfileNavItems } from '@/hooks/useProfileNavItems';
import DefaultPf from '@/assets/images/pf.jpeg';

const UserAvatar = React.memo(() => {
  const [isOpen, setIsOpen] = useState(false);

  const profileNavItems = useProfileNavItems();
  const currentUser: UserAccountModel = useUserAccount();
  const avatarUrl = currentUser.avatar_file_name || DefaultPf;

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Avatar className="w-8 h-8 cursor-pointer">
          {/* <AvatarImage src={avatarUrl} /> */}
          <img src={avatarUrl} />
          <AvatarFallback>PF</AvatarFallback>
        </Avatar>
      </PopoverTrigger>
      <PopoverContent
        className="w-48 overflow-hidden rounded-lg p-0"
        align="end"
      >
        <Sidebar collapsible="none" className="bg-transparent">
          <SidebarContent>
            <div className="flex gap-2 items-center justify-start py-3 pb-2 px-4">
              <Avatar className="w-8 h-8">
                {/* <AvatarImage src={avatarUrl} /> */}
                <img src={avatarUrl} />
                <AvatarFallback>PF</AvatarFallback>
              </Avatar>
              <div className="flex flex-col gap-1">
                <p className="text-sm">{currentUser.display_name}</p>
                <p className="text-xs -mt-1">@{currentUser.username}</p>
              </div>
            </div>
            <Separator />
            {profileNavItems.map((group, index) => (
              <SidebarGroup
                key={index}
                className="border-b last:border-none pt-0"
              >
                <SidebarGroupContent className="gap-0">
                  <SidebarMenu>
                    {group.map((item, index) => (
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
                    ))}
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
            ))}
          </SidebarContent>
        </Sidebar>
      </PopoverContent>
    </Popover>
  );
});

export default UserAvatar;
