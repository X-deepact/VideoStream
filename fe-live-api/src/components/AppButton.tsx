import { Button as ShadcnButton } from './ui/button'; // Import Shadcn's Button component
import TooltipComponent from './TooltipComponent'; // Your TooltipComponent
import { LucideIcon } from 'lucide-react';
import { useIsMobile } from '@/hooks/useMobile';
import { cn } from '@/lib/utils';

interface ButtonProps {
  Icon: LucideIcon;
  label: string;
  isIconActive?: boolean;
  tooltipOnSmallScreens?: boolean;
  size?: 'sm' | 'lg' | 'default' | 'icon' | null | undefined;
  variant?:
    | 'default'
    | 'outline'
    | 'ghost'
    | 'destructive'
    | 'link'
    | 'secondary';
  className?: string;
  onClick: () => void;
}

const AppButton: React.FC<ButtonProps> = ({
  Icon,
  label,
  tooltipOnSmallScreens = false,
  isIconActive = false,
  size = 'default',
  variant = 'default',
  className = '',
  onClick,
}) => {
  const isMobile = useIsMobile();

  const buttonContent = (
    <>
      {Icon && (
        <Icon className={cn(isIconActive ? 'fill-primary text-primary' : '')} />
      )}
      {size !== 'icon' && <span className="hidden md:inline">{label}</span>}
    </>
  );

  return (tooltipOnSmallScreens && isMobile) || size === 'icon' ? (
    <TooltipComponent text={label} align="center">
      <ShadcnButton
        onClick={onClick}
        size={size}
        variant={variant}
        className={className}
      >
        {buttonContent}
      </ShadcnButton>
    </TooltipComponent>
  ) : (
    <ShadcnButton
      onClick={onClick}
      size={size}
      variant={variant}
      className={className}
    >
      {Icon && (
        <Icon className={cn(isIconActive ? 'fill-primary text-primary' : '')} />
      )}{' '}
      {label}
    </ShadcnButton>
  );
};

export default AppButton;
