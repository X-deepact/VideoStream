package cache

const (
	// expect: videoname. example: key = fmt.Sprintf(cachekeys.VIDEO_ENCODING_PREFIX, "2f2ccfc3-3bbb-45a6-9879-0c574576dda6.mp4"), value = boolean(true)
	VIDEO_ENCODING_PREFIX = "video:encoding:%s" // be-api will do encoding. both backends can check
	// expect stream id. example : key = fmt.Sprintf(cachekeys.IS_ENDING_LIVE_PREFIX, "1"), value = boolean(true)
	IS_ENDING_LIVE_PREFIX = "stream:ending:%d" // it is for pub sub. be-admin ends live, be-api do ending by checking in cron and ws
)

const (
	CHANNEL_END_LIVE = "channel:end-live-%d"
)
