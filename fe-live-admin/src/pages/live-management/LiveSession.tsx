import LivestreamSessions from "@/components/livestream-management/LivestreamSessions.tsx";

const LiveSession = () => {
	return (
		<>
			<LivestreamSessions
				defaultStatus={["started"]}
				pageTitle="Live Sessions"
			/>
		</>
	);
};

export default LiveSession;
