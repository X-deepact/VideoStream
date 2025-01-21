//  Auth Interfaces

export interface AuthContextProps {
	status: string;
  isAuthenticated: boolean;
	setUserStatus: (status: string) => void;
  loginUser: () => void;
  logoutUser: () => void;
}

export interface AccountProps {
  id: string;
  username: string;
  display_name: string;
  email: string;
  role?: string;
  createdAt: string;
  updatedAt: string;
  creator: string;
	deleted_at?: string;
	admin_logs: string
}

export interface LivestreamStatistics {
  title: string;
  videoSize: string;
  views: number;
  duration: string;
	comments: number;
}

export enum LIVESTREAM_STATUS {
	UPCOMING = "upcoming",
	STARTED= "started",
	ENDED = "ended",
}

export enum LIVESTREAM_TYPE {
	SPORT = "Sport",
	ESPORT = "E-Sport",
}

export interface LivestreamSession {
	id: string;
	title: string;
	description: string;
	broadcast_url: string;
	push_url: string;
	thumbnail_file_name: string;
	started_at: Date;
	ended_at: Date;
	user: AccountProps;
	status: LIVESTREAM_STATUS;
	stream_type: LIVESTREAM_TYPE;
	live_stream_analytic: LivestreamStatistics;
}

export interface Catalogue {
	id: number,
	name: string,
	created_by_id: number,
	created_at: Date,
	updated_at: Date,
	created_by_user: AccountProps,
	updated_by_user: AccountProps
}