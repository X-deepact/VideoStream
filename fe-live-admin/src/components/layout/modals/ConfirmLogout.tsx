import {
	Dialog, DialogClose,
	DialogContent, DialogDescription, DialogFooter,
	DialogHeader,
	DialogTitle
} from "@/components/ui/dialog.tsx";
import { Button } from "@/components/ui/button.tsx";

interface DialogProps {
	isOpen: boolean;
	setOpen: React.Dispatch<React.SetStateAction<boolean>>;
	
	onConfirm(): void;
}

export const ConfirmLogout = ({isOpen, setOpen, onConfirm}: DialogProps) => {
	return (
		<Dialog open={isOpen} onOpenChange={setOpen}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>
						Are you sure you want to log out?
					</DialogTitle>
					<DialogDescription>
						Changes you made might not be saved
					</DialogDescription>
				</DialogHeader>
				<DialogFooter className="sm:justify-end">
					<DialogClose asChild>
						<Button>
							Close
						</Button>
					</DialogClose>
					<Button variant="destructive" onClick={onConfirm}>
						Log out
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
};