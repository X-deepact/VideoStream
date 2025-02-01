
const SomethingWentWrong = () => {
	return (
		<div className="child-center w-full">
			<div className="flex items-center justify-center min-h-[calc(100vh-6rem)]">
				<div className="flex flex-col items-center select-none">
					<h1 className="font-mono text-8xl text-slate-400">500</h1>
					<h1 className="mb-1 text-xl font-semibold">We're sorry. Something went wrong</h1>
					<span className="text-slate-500 text-center">
						Try refreshing the page or attempting to the action again.
          </span>
					<span className="text-slate-500 text-center">
						Please contact your administrator if this problem persists.
          </span>
				</div>
			</div>
		</div>
	);
};

export default SomethingWentWrong;
