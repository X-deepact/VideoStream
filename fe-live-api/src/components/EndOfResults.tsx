import { AlertCircle } from 'lucide-react';

const EndOfResults = () => {
  return (
    <div className="flex justify-center items-center">
      <span className="flex gap-1 items-center bg-zinc-400 dark:bg-secondary text-center mt-4 text-white text-xs px-3 py-1 rounded-full">
        <AlertCircle className="w-3 h-3 text-white" /> End of results
      </span>
    </div>
  );
};

export default EndOfResults;
