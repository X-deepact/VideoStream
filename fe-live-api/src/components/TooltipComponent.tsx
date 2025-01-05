import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from './ui/tooltip';

interface ComponentProps {
  align?: 'start' | 'center' | 'end';
  text: string;
  children: JSX.Element;
}

const TooltipComponent = (props: ComponentProps) => {
  const { align, text, children } = props;

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>{children}</TooltipTrigger>
        <TooltipContent
          className="bg-secondary dark:bg-muted text-black dark:text-white max-w-full"
          align={align || 'start'}
        >
          <p>{text}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default TooltipComponent;
