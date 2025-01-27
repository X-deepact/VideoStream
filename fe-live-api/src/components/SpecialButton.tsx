import { LucideIcon } from 'lucide-react';

const SpecialButton = ({
  label,
  Icon,
  onClick,
}: {
  label: string;
  Icon?: LucideIcon;
  onClick: () => void;
}) => {
  return (
    <button
      onClick={onClick}
      className='relative px-5 py-2 font-medium text-sm overflow-hidden group bg-purple-600 hover:bg-gradient-to-r hover:from-purple-700 hover:to-purple-500 text-white hover:ring-2 hover:ring-offset-2 dark:hover:ring-offset-black hover:ring-purple-500 transition-all ease-out duration-300 rounded-full'
    >
      <span className='absolute right-0 w-8 h-32 -mt-12 transition-all duration-1000 transform translate-x-12 bg-white dark:bg-black opacity-10 rotate-12 group-hover:-translate-x-40 ease'></span>
      {!Icon ? (
        <span className='relative'>{label}</span>
      ) : (
        <div className='flex gap-2 items-center'>
          {Icon && <Icon size={17} />} {label}
        </div>
      )}
    </button>
  );
};

export default SpecialButton;
