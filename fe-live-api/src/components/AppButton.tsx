import { Button as ShadcnButton } from './ui/button'; // Import Shadcn's Button component
import TooltipComponent from './TooltipComponent'; // Your TooltipComponent
import { LucideIcon } from 'lucide-react';
import { useIsMobile } from '@/hooks/useMobile';
import { cn } from '@/lib/utils';

interface ButtonProps {
  Icon: LucideIcon;
  label: string;
  isIconActive: boolean;
  tooltipOnSmallScreens?: boolean;
  size?: 'sm' | 'lg' | 'default' | 'icon' | null | undefined;
  variant?: 'default' | 'outline' | 'ghost' | 'destructive' | 'link';
  onClick: () => void;
}

const AppButton: React.FC<ButtonProps> = ({
  Icon,
  label,
  tooltipOnSmallScreens = false,
  isIconActive = false,
  size = 'default',
  variant = 'default',
  onClick,
}) => {
  const isMobile = useIsMobile();

  const buttonContent = (
    <>
      {Icon && (
        <Icon className={cn(isIconActive ? 'fill-primary text-primary' : '')} />
      )}
      <span className="hidden md:inline">{label}</span>
    </>
  );

  return tooltipOnSmallScreens && isMobile ? (
    <TooltipComponent text={label} align="center">
      <ShadcnButton onClick={onClick} size={size} variant={variant}>
        {buttonContent}
      </ShadcnButton>
    </TooltipComponent>
  ) : (
    <ShadcnButton onClick={onClick} size={size} variant={variant}>
      {Icon && (
        <Icon className={cn(isIconActive ? 'fill-primary text-primary' : '')} />
      )}{' '}
      {label}
    </ShadcnButton>
  );
};

export default AppButton;
