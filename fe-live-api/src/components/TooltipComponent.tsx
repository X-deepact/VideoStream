import React from 'react';
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

const TooltipComponent = React.forwardRef<HTMLButtonElement, ComponentProps>(
  (props, ref) => {
    const { align, text, children } = props;

    return (
      <TooltipProvider>
        <Tooltip delayDuration={100}>
          <TooltipTrigger asChild ref={ref}>
            {children}
          </TooltipTrigger>
          {text && (
            <TooltipContent
              arrowPadding={10}
              sideOffset={6}
              className='TooltipContent bg-black text-white dark:bg-white dark:text-black'
              align={align || 'start'}
            >
              <span>{text}</span>
            </TooltipContent>
          )}
        </Tooltip>
      </TooltipProvider>
    );
  }
);

TooltipComponent.displayName = 'TooltipComponent';

export default TooltipComponent;
