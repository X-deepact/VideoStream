import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { APP_LOGIN_PATH, APP_PROFILE_PATH } from '@/router';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { logout } from '@/services/auth.service';
import { useAuth } from '@/lib/auth-util';
import { toast } from '@/hooks/use-toast';
import { getAvatarFallbackText } from '@/lib/utils';
import RoleBadge from '../common/RoleBadge';
import { ROLE } from '@/type/role';
import { ConfirmLogout } from "@/components/layout/modals/ConfirmLogout.tsx";

const MyProfile: React.FC = () => {
	const navigate = useNavigate();
	const {logoutUser} = useAuth();
	const [isConfirmLogoutOpen, setConfirmLogoutOpen] = useState(false);
	
	const user = JSON.parse(localStorage.getItem('user') || '');
	if (!user) return;
	
	const avatarUrl = user.avatar;
	const name = user.username.substring(0, 2).toUpperCase();
	const displayName = user.display_name;
	const role = user.role;
	
	const onLogout = () => {
		setConfirmLogoutOpen(true);
		
	}
	
	const handleLogout = () => {
		logout().then(() => {
			logoutUser();
			toast({
				description: 'Logout successfully.',
			});
			navigate(APP_LOGIN_PATH);
		});
	}
	
	return (
		<div className="flex justify-center items-center">
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<div className="flex items-center gap-2">
						<Avatar className="w-8 h-8 cursor-pointer border border-gray-400">
							<AvatarImage src={avatarUrl}/>
							<AvatarFallback>
								{getAvatarFallbackText(name || 'NA')}
							</AvatarFallback>
						</Avatar>
						
						<div className="flex flex-col items-start gap-0">
							<p className="font-medium text-sm">{displayName}</p>
							<RoleBadge role={role as ROLE}/>
						</div>
					</div>
				</DropdownMenuTrigger>
				<DropdownMenuContent>
					<DropdownMenuItem onClick={() => navigate(APP_PROFILE_PATH)}>
						Profile
					</DropdownMenuItem>
					<DropdownMenuItem onClick={() => onLogout()}>
						Log out
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>
			
			{
				isConfirmLogoutOpen && (
					<ConfirmLogout
						isOpen={isConfirmLogoutOpen}
						setOpen={setConfirmLogoutOpen}
						onConfirm={handleLogout}
					/>
				)
			}
		</div>
	);
};

export default MyProfile;
