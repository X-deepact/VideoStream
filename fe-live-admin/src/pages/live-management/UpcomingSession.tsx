import LivestreamSessions
	from "@/components/livestream-management/LivestreamSessions.tsx";
import { LIVESTREAM_STATUS } from "@/lib/interface.tsx";

const UpcomingSession = () => {
	return (
		<>
			<LivestreamSessions
				defaultStatus={[LIVESTREAM_STATUS.UPCOMING]}
				pageTitle="Upcoming Sessions"
			/>
		</>
	);
};

export default UpcomingSession;
