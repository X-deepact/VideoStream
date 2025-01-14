import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertTriangle } from 'lucide-react';

interface ComponentProps {
  variant: 'default' | 'destructive';
  title: string;
  description: string;
  subDescription?: string;
  className?: string;
}

const AppAlert = (props: ComponentProps): JSX.Element => {
  const { variant, title, description, subDescription, className } = props;

  return (
    <div className={`inline-flex ${className}`}>
      <Alert variant={variant}>
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>{title}</AlertTitle>
        <AlertDescription>{description}</AlertDescription>
        {subDescription && (
          <AlertDescription className="mt-2">{subDescription}</AlertDescription>
        )}
      </Alert>
    </div>
  );
};

export default AppAlert;
