## 🎉 LIVE STREAM
This is a live streaming project for streamers and users to use. With some basic features of a live and video management application

## ✨ Features
- Go live with camera or schedule a live stream (video available)
- When live, there are features such as live chat (comment), expressing emotions (like, heart,...), shares, number of emotions expressed, number of views and number of shares
- After live (video), there is also a similar feature when live
- The streamer's channel contains basic information of the streamer, live and video of the streamer
- Streamer subscription list, viewed history list, reaction video list, video bookmark list
- Notify when streamer has registered live and update user status (online/offline)
- Manage basic user information and 2-step authentication (google auth)

## 🖥 Environment Support
- Go 1.22.2
- Docker
- PostgreSQL
- FFmpeg

## 📦 Installation
- Automatically update the go.mod file and create a go.sum file to lock the dependency versions.
```bash
go mod tidy
```
- Create a config.yaml file from the config.example.yaml file. Update postgresql and redis information
-  Create a docker-compose.yml file from the docker-compose-stream-server.yml. Run docker compose
```bash
docker-compose --version

docker-compose up
```

## 🔗 Links
- http://localhost:8787/: backend link, set port 8787 in config
- http://localhost:8787/api/file/: link images, videos (files)
- rtmp://localhost:1935/{appname}/movie: RTMP link
- http://127.0.0.1:7001/{appname}/movie.flv: FLV link
- http://127.0.0.1:7002/{appname}/movie.m3u8: HLS link

## ⌨️ Development
- Run docker and start livego
- Run project
```bash
go run gitlab/live/be-live-api/cmd/client
```

## 🔨 Features that need to be developed in the future
- Chat: private chat and group chat
- Streamer can view their own detailed statistics