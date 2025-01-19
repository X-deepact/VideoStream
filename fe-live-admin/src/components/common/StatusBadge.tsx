import { LIVESTREAM_STATUS } from "@/lib/interface.tsx";
import { cn } from "@/lib/utils.ts";

interface StatusBadgeProps {
	status: LIVESTREAM_STATUS;
	style?: 'text' | 'badge';
}

const statusStyle: Record<LIVESTREAM_STATUS, string> = {
	[LIVESTREAM_STATUS.UPCOMING]: 'text-black',
	[LIVESTREAM_STATUS.STARTED]: 'text-blue-800',
	[LIVESTREAM_STATUS.ENDED]: 'text-red-800',
}

const badgeStyles: Record<LIVESTREAM_STATUS, string> = {
	[LIVESTREAM_STATUS.UPCOMING]: 'bg-black text-white',
	[LIVESTREAM_STATUS.STARTED]: 'bg-blue-100 text-blue-800',
	[LIVESTREAM_STATUS.ENDED]: 'bg-red-100 text-red-800',
};


const StatusBadge: React.FC<StatusBadgeProps> = ({ status, style = "badge" }) => {
	if (style === "text") {
		return (
			<span
				className={cn('text-xs font-semibold capitalize', statusStyle[status])}
			>
        {status?.toString()}
      </span>
		)
	}
	return (
		<span
			className={cn(
				'px-2 py-1 text-xs font-medium rounded-full capitalize',
				badgeStyles[status]
			)}
		>
			{status?.toString()}
		</span>
	);
};

export default StatusBadge;
