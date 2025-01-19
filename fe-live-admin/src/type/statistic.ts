export interface LiveStatisticsResponse {
	title: string;
	description: string;
	stream_id: number;
	status: string;
	likes: number;
	current_viewers: number;
	total_viewers: number;
	comments: number;
}

export interface UserStatisticsResponse {
	display_name: string;
	role_type: string;
	total_comments: number;
	total_likes: number;
	total_streams: number;
	total_views: number;
	user_id: number;
	username: string;
}


export interface VideoStatisticsResponse {
	title: string;
	views: number;
	likes: number;
	comments: number;
	shares: number;
	duration: number;
	video_size: number;
	created_at: string;
  }
  
  