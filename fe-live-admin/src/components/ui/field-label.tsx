import { Label } from "@/components/ui/label.tsx";
import React from "react";

const FieldLabel = ({label, isRequired}) => {
	if (isRequired) {
		return (
			<Label>
				{label} <span className="text-red-500" >*</span>
			</Label>
		)
	}
	return (
		<Label>{label}</Label>
	)
};

export default FieldLabel;