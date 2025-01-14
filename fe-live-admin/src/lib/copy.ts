import { toast } from "@/hooks/use-toast.ts";

const copyToClipBoard = (text: string) => {
	if (navigator.clipboard) {
		navigator.clipboard.writeText(text)
		.then(() => {
			toast({
				description: "URL successfully copied to clipboard!"
			})
		})
		.catch((error) => {
			toast({
				description: "Failed to copy URL. Please try again!",
				variant: "destructive"
			})
		})
	}
}

export default copyToClipBoard;