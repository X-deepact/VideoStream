import LivestreamSessions from "@/components/livestream-management/LivestreamSessions.tsx";

const UpcomingSession = () => {
	return (
		<>
			<LivestreamSessions
				defaultStatus={["upcoming"]}
				pageTitle="Upcoming Sessions"
			/>
		</>
	);
};

export default UpcomingSession;
