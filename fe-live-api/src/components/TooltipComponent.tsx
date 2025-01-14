import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from './ui/tooltip';

interface ComponentProps {
  align?: 'start' | 'center' | 'end';
  text?: string;
  children: JSX.Element;
}

const TooltipComponent = (props: ComponentProps) => {
  const { align, text, children } = props;

  return (
    <TooltipProvider>
      <Tooltip delayDuration={100}>
        <TooltipTrigger asChild>{children}</TooltipTrigger>
        {text && (
          <TooltipContent
            arrowPadding={10}
            sideOffset={6}
            className="TooltipContent bg-secondary dark:bg-white text-black dark:text-black"
            align={align || 'start'}
          >
            <p>{text}</p>
          </TooltipContent>
        )}
      </Tooltip>
    </TooltipProvider>
  );
};

export default TooltipComponent;
