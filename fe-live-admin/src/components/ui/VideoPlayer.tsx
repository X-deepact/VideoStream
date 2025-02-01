import { useCallback, useEffect, useRef, useState } from "react";
import axios from "axios";
import authHeader from "@/services/auth-header.ts";
import videojs from "video.js";
import "video.js/dist/video-js.css";

interface VideoPlayerProps {
	videoPath: string;
}

export const VideoPlayer = ({ videoPath }: VideoPlayerProps) => {
	const [videoURL, setVideoURL] = useState<string>("");
	const videoElementRef = useRef<HTMLVideoElement | null>(null);
	const videoJSPlayerRef = useRef<any>(null);

	// Keep track of the last path we fetched so we don't re-fetch if it's unchanged
	const lastFetchedPathRef = useRef<string | null>(null);

	const fetchVideo = useCallback(async () => {
		// If no path or if the path hasn't changed, skip fetching
		if (!videoPath || videoPath === lastFetchedPathRef.current) {
			return;
		}

		lastFetchedPathRef.current = videoPath;

		try {
			const response = await axios.get(videoPath, {
				responseType: "blob",
				headers: authHeader(),
			});
			const blob = new Blob([response.data], { type: "video/mp4" });
			const blobURL = URL.createObjectURL(blob);
			setVideoURL(blobURL);
		} catch (error) {
			console.error("Error loading video:", error);
		}
	}, [videoPath]);

	// Fetch video whenever the videoPath changes
	useEffect(() => {
		let isCancelled = false;

		const doFetch = async () => {
			await fetchVideo();
			if (isCancelled) return;
			// Any post-fetch logic goes here
		};

		doFetch();

		// Cancel fetch if component unmounts mid-request
		return () => {
			isCancelled = true;
		};
	}, [fetchVideo]);

	// Initialize video.js player and handle cleanup
	useEffect(() => {
		if (!videoURL || !videoElementRef.current) return;

		videoJSPlayerRef.current = videojs(
			videoElementRef.current,
			{
				autoplay: false,
				controls: true,
				responsive: true,
				fluid: true,
				preload: "auto",
				aspectRatio: "16:9",
			},
			() => {
				console.log("MP4 Player initialized");
			}
		);

		videoJSPlayerRef.current.src({
			src: videoURL,
			type: "video/mp4",
		});

		return () => {
			if (videoJSPlayerRef.current) {
				videoJSPlayerRef.current.dispose();
				videoJSPlayerRef.current = null;
				console.log("MP4 Player disposed");
			}
			URL.revokeObjectURL(videoURL);
		};
	}, [videoURL]);

	return (
		<div className="w-full" data-vjs-player>
			<video ref={videoElementRef} className="video-js vjs-default-skin" />
		</div>
	);
};
