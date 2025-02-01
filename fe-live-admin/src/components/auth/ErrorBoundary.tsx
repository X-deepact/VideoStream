import React from 'react';
import SomethingWentWrong from "@/pages/SomethingWentWrong.tsx";

interface State {
	hasError: boolean;
}

class ErrorBoundary extends React.Component<React.PropsWithChildren<{}>, State> {
	constructor(props: React.PropsWithChildren<{}>) {
		super(props);
		this.state = { hasError: false };
	}

	static getDerivedStateFromError(): State {
		return { hasError: true };
	}

	componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
		console.error("ErrorBoundary caught an error", error, errorInfo);
	}

	render() {
		if (this.state.hasError) {
			return <SomethingWentWrong />;
		}
		return this.props.children;
	}
}

export default ErrorBoundary;
