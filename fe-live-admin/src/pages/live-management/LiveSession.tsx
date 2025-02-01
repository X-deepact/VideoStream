import LivestreamSessions
	from "@/components/livestream-management/LivestreamSessions.tsx";
import { LIVESTREAM_STATUS } from "@/lib/interface.tsx";

const LiveSession = () => {
	return (
		<>
			<LivestreamSessions
				defaultStatus={[LIVESTREAM_STATUS.STARTED]}
				pageTitle="Live Sessions"
			/>
		</>
	);
};

export default LiveSession;
